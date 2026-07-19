import { useState } from 'react';
import { useTheme } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import CommandCenter from '@/pages/CommandCenter';
import LiveIntercept from '@/pages/LiveIntercept';
import FICNAudit from '@/pages/FICNAudit';
import SyndicateGraph from '@/pages/SyndicateGraph';
import SystemSettings from '@/pages/SystemSettings';
import NotFound from '@/pages/not-found';
import Incident360Drawer from '@/components/Incident360Drawer';
import { IncidentCaseProvider } from '@/contexts/IncidentCaseContext';
// @ts-ignore
import AuthPortal from '@/components/AuthPortal';

const queryClient = new QueryClient();

function AppShell() {
  const { resolvedTheme } = useTheme();
  const [aiConfidenceCutoff, setAiConfidenceCutoff] = useState(87);
  const [deepfakeSensorWeight, setDeepfakeSensorWeight] = useState(1.4);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Always-visible header */}
      <Header />

      {/* Main layout: sidebar + content */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-hidden">
          <Switch>
            <Route path="/" component={CommandCenter} />
            <Route path="/intercept">
              <LiveIntercept deepfakeSensorWeight={deepfakeSensorWeight} />
            </Route>
            <Route path="/ficn">
              <FICNAudit aiConfidenceCutoff={aiConfidenceCutoff} />
            </Route>
            <Route path="/syndicate" component={SyndicateGraph} />
            <Route path="/settings">
              <SystemSettings
                aiConfidenceCutoff={aiConfidenceCutoff}
                setAiConfidenceCutoff={setAiConfidenceCutoff}
                deepfakeSensorWeight={deepfakeSensorWeight}
                setDeepfakeSensorWeight={setDeepfakeSensorWeight}
              />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        theme={resolvedTheme === 'light' ? 'light' : 'dark'}
        toastOptions={{
          style: {
            background: 'var(--st-panel)',
            border: '1px solid var(--st-border)',
            color: 'var(--st-text-body)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: '11px',
          },
        }}
      />
      <Incident360Drawer />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  if (!isAuthenticated) return <AuthPortal onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <IncidentCaseProvider>
            <AppShell />
          </IncidentCaseProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
