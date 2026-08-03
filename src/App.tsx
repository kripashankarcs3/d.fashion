import { Suspense, lazy, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import AppShell from '@/components/AppShell';
import { GuestOnly, Protected } from '@/components/RouteGuards';
import ScrollManager from '@/components/ScrollManager';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  AUTHENTICATED_HOME,
  FALLBACK_PAGE_TITLE,
  PAGE_TITLES,
  ROUTES,
  ROUTE_ALIASES,
} from '@/config/navigation';
import { useAuthStore } from '@/store/useAuthStore';

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

/** A protected page: auth gate first, then its own error boundary. */
function AppRoute({ name, children }: { name: string; children: ReactNode }) {
  return (
    <Protected fallback={<PageFallback />}>
      <ErrorBoundary pageName={name}>{children}</ErrorBoundary>
    </Protected>
  );
}

/** The front door: signed-out visitors go to login, members to the dashboard. */
function EntryRedirect() {
  const authReady = useAuthStore((s) => s.authReady);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!authReady) return <PageFallback />;
  return <Redirect to={isAuthenticated ? AUTHENTICATED_HOME : ROUTES.login} />;
}

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    document.title =
      PAGE_TITLES[ROUTE_ALIASES[location] ?? location] ?? FALLBACK_PAGE_TITLE;
  }, [location]);

  return (
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
          <ScrollManager path={location} />
          <Suspense fallback={<PageFallback />}>
            <Switch>
              {/* Entry point — auth-switched. Signed-out visitors land on login;
                  signed-in members on the dashboard. */}
              <Route path={ROUTES.root}>
                <EntryRedirect />
              </Route>

              {/* Public — the campaign landing page. */}
              <Route path={ROUTES.home}>
                <ErrorBoundary pageName="Home">
                  <Home />
                </ErrorBoundary>
              </Route>
              <Route path={ROUTES.pricing}>
                <ErrorBoundary pageName="Pricing">
                  <Pricing />
                </ErrorBoundary>
              </Route>

              {/* Guest only */}
              <Route path={ROUTES.login}>
                <GuestOnly fallback={<PageFallback />}>
                  <ErrorBoundary pageName="Sign in">
                    <Login />
                  </ErrorBoundary>
                </GuestOnly>
              </Route>
              <Route path={ROUTES.signup}>
                <GuestOnly fallback={<PageFallback />}>
                  <ErrorBoundary pageName="Sign up">
                    <Signup />
                  </ErrorBoundary>
                </GuestOnly>
              </Route>

              {/* Requires a session */}
              <Route path={ROUTES.dashboard}>
                <AppRoute name="Dashboard">
                  <Dashboard />
                </AppRoute>
              </Route>
              <Route path={ROUTES.upload}>
                <AppRoute name="Upload">
                  <Upload />
                </AppRoute>
              </Route>
              <Route path={ROUTES.report}>
                <AppRoute name="Report">
                  <Report />
                </AppRoute>
              </Route>
              <Route path={ROUTES.tryOn}>
                <AppRoute name="Try-On">
                  <TryOn />
                </AppRoute>
              </Route>
              <Route path={ROUTES.chat}>
                <AppRoute name="D'Style">
                  <Chat />
                </AppRoute>
              </Route>

              {/* Legacy paths */}
              {Object.entries(ROUTE_ALIASES).map(([from, to]) => (
                <Route key={from} path={from}>
                  <Redirect to={to} replace />
                </Route>
              ))}

              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </AppShell>
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
