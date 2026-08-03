import React, { Suspense, lazy, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import AppShell from '@/components/AppShell';
import RequireAuth from '@/components/RequireAuth';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from '@/pages/Home';
import NotFound from '@/pages/not-found';

const Upload = lazy(() => import('@/pages/Upload'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Report = lazy(() => import('@/pages/Report'));
const Chat = lazy(() => import('@/pages/Chat'));
const TryOn = lazy(() => import('@/pages/TryOn'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));

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

const PAGE_TITLES: Record<string, string> = {
  '/': "D'Fashion — Discover Your Colour Season",
  '/upload': "Upload — D'Fashion",
  '/report': "Your Colour Report — D'Fashion",
  '/try-on': "Virtual Try-On — D'Fashion",
  '/tryon': "Virtual Try-On — D'Fashion",
  '/chat': "D'Style Stylist Chat — D'Fashion",
  '/dashboard': "Dashboard — D'Fashion",
  '/pricing': "Pricing — D'Fashion",
  '/login': "Sign In — D'Fashion",
  '/signup': "Sign Up — D'Fashion",
};

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    document.title = PAGE_TITLES[location] ?? "D'Fashion";
  }, [location]);

  return (
    <RequireAuth fallback={<PageFallback />}>
      <AppShell>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="will-change-transform"
          >
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
                <Route path="/login">
                  <ErrorBoundary pageName="Sign in"><Login /></ErrorBoundary>
                </Route>
                <Route path="/signup">
                  <ErrorBoundary pageName="Sign up"><Signup /></ErrorBoundary>
                </Route>
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </AppShell>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MotionConfig reducedMotion="user">
          <WouterRouter>
            <Router />
          </WouterRouter>
        </MotionConfig>
        <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}