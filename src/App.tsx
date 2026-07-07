import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthPortal from './components/AuthPortal';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { SettingsProvider } from './contexts/SettingsContext';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import LiveIntercept from './pages/LiveIntercept';
import FICNAudit from './pages/FICNAudit';
import SyndicateGraph from './pages/SyndicateGraph';
import SystemSettings from './pages/SystemSettings';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={CommandCenter} />
      <Route path="/intercept" component={LiveIntercept} />
      <Route path="/ficn" component={FICNAudit} />
      <Route path="/syndicate" component={SyndicateGraph} />
      <Route path="/settings" component={SystemSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  if (!isAuthenticated) return <AuthPortal onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster 
            theme="dark" 
            toastOptions={{
              style: {
                background: '#0D1321',
                border: '1px solid #1F2937',
                color: '#F9FAFB',
                fontFamily: 'Inter, sans-serif'
              }
            }} 
          />
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
