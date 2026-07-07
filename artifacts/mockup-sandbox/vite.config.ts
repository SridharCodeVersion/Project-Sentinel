import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

// Default values for deployment platforms
const port = Number(process.env.PORT ?? 5173);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig(async () => {
  const plugins = [
    mockupPreviewPlugin(),
    react(),
    tailwindcss(),
  ];

  // Enable Replit-only plugin only inside Replit development
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID
  ) {
    const { cartographer } = await import(
      "@replit/vite-plugin-cartographer"
    );

    plugins.push(
      cartographer({
        root: path.resolve(import.meta.dirname, ".."),
      })
    );
  }

  return {
    base: basePath,

    plugins,

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },

    root: path.resolve(import.meta.dirname),

    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },

    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },

    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});