import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import AppShell from '@/components/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from '@/pages/Home';
import NotFound from '@/pages/not-found';

const Upload = lazy(() => import('@/pages/Upload'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Report = lazy(() => import('@/pages/Report'));
const Chat = lazy(() => import('@/pages/Chat'));
const TryOn = lazy(() => import('@/pages/TryOn'));
const Pricing = lazy(() => import('@/pages/Pricing'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
    mutations: { retry: 0 },
  },
});

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

function Router() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/upload">
            <ErrorBoundary pageName="Upload"><Upload /></ErrorBoundary>
          </Route>
          <Route path="/report">
            <ErrorBoundary pageName="Report"><Report /></ErrorBoundary>
          </Route>
          <Route path="/try-on">
            <ErrorBoundary pageName="Try-On"><TryOn /></ErrorBoundary>
          </Route>
          <Route path="/tryon">
            <ErrorBoundary pageName="Try-On"><TryOn /></ErrorBoundary>
          </Route>
          <Route path="/chat">
            <ErrorBoundary pageName="D'Style"><Chat /></ErrorBoundary>
          </Route>
          <Route path="/dashboard">
            <ErrorBoundary pageName="Dashboard"><Dashboard /></ErrorBoundary>
          </Route>
          <Route path="/pricing">
            <ErrorBoundary pageName="Pricing"><Pricing /></ErrorBoundary>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </AppShell>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Router />
        </WouterRouter>
        <Toaster richColors position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}