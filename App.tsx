import React, { useState, Suspense } from 'react';
import PreviewPage from './components/PreviewPage';
import AnalyticsPage from './components/AnalyticsPage';

import DocsPage from './components/docs/DocsPage';
import { motion, AnimatePresence } from 'framer-motion';

// Builder is lazy loaded since it's heavier and not the first view when landing is enabled
const LazyBuilder = React.lazy(() => import('./components/Builder'));

// Helper to get current route
function getRoute(): string {
  if (typeof window === 'undefined') return '/';
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  const pathname = window.location.pathname;
  const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return (withoutBase || '/').replace(/\/$/, '') || '/';
}

// Separate component for the main app (now just the Builder directly)
function MainApp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center text-gray-400">
          Loading builder...
        </div>
      }
    >
      <LazyBuilder />
    </Suspense>
  );
}

function App() {
  const route = getRoute();

  if (route === '/preview') {
    return <PreviewPage />;
  }

  // Dynamic Profile Routing: e.g. /p/client-slug
  if (route.startsWith('/p/')) {
    return <PreviewPage />;
  }

  if (route === '/analytics') {
    return <AnalyticsPage />;
  }

  if (route.startsWith('/doc')) {
    return <DocsPage />;
  }

  return <MainApp />;
}

export default App;
