/**
 * Local dev launcher — starts API (8080) + Sentinel UI (18756).
 * Command Center needs both. Auth/DB routes need DATABASE_URL; hotspot + ledger do not.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWin = process.platform === "win32";
const apiPort = process.env.API_PORT ?? "8080";
const webPort = process.env.WEB_PORT ?? "18756";

async function isPortBusy(port) {
  const net = await import("node:net");
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(true));
    server.once("listening", () => {
      server.close(() => resolve(false));
    });
    server.listen(port, "127.0.0.1");
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: isWin,
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

function start(command, args, env) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: isWin,
    env: { ...process.env, ...env },
  });
  child.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
  return child;
}

console.log("▸ Building API server…");
await run("pnpm", ["--filter", "@workspace/api-server", "run", "build"]);

const apiBusy = await isPortBusy(Number(apiPort));
const webBusy = await isPortBusy(Number(webPort));
if (apiBusy || webBusy) {
  console.error(
    `\n✖ Port${apiBusy && webBusy ? "s" : ""} ${[apiBusy && apiPort, webBusy && webPort].filter(Boolean).join(" and ")} already in use.`,
  );
  console.error(
    "  Stop old dev servers first (close other terminals), then run: pnpm run dev\n",
  );
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.log(
    "▸ DATABASE_URL not set — Command Center live data will work; auth routes will not.",
  );
}

console.log(`▸ Starting API on http://localhost:${apiPort}`);
const api = start("node", ["--enable-source-maps", "artifacts/api-server/dist/index.mjs"], {
  PORT: apiPort,
});

await new Promise((resolve) => setTimeout(resolve, 2000));

console.log(`▸ Starting UI on http://localhost:${webPort}`);
console.log("▸ Login: commander@i4c.gov.in / Sentinel@2026");
console.log("▸ Press Ctrl+C to stop both servers.\n");

const web = start("pnpm", ["--filter", "@workspace/sentinel", "run", "dev"], {
  PORT: webPort,
  BASE_PATH: "/",
  API_PROXY_TARGET: `http://localhost:${apiPort}`,
});

function shutdown() {
  api.kill();
  web.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

api.on("exit", (code) => {
  if (code && code !== 0) shutdown();
});
web.on("exit", (code) => {
  if (code && code !== 0) shutdown();
});
