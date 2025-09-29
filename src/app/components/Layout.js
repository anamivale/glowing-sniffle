import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load components
const Navbar = dynamic(() => import("./navbar"), {
  loading: () => <div className="h-12 bg-gray-900 animate-pulse" />
});

const Sidebar = dynamic(() => import("./sidebar"), {
  loading: () => <div className="w-64 bg-gray-900 animate-pulse" />
});

const Layout = React.memo(({ children }) => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-black text-white">
        {/* Navbar (fixed) */}
        <Suspense fallback={<div className="h-12 bg-gray-900 animate-pulse" />}>
          <Navbar />
        </Suspense>

        <div className="flex pt-15"> 
          {/*  Pushes content down below fixed navbar */}
          <Suspense fallback={<div className="w-64 bg-gray-900 animate-pulse" />}>
            <Sidebar />
          </Suspense>

          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner className="py-20" />}>
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
});

Layout.displayName = 'Layout';

export default Layout;
