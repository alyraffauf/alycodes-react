import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { initMobileViewport } from "./utils/mobileViewportHandler";
import useScrollRestoration from "./hooks/useScrollRestoration";

// Lazy load components for code splitting
const Home = lazy(() => import("./components/Home"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const BlogList = lazy(() => import("./components/BlogList"));
const Footer = lazy(() => import("./components/Footer"));

// Style imports
import "./App.css";
import "./styles/mobile.css";

// Loading component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div
    className="loading-container"
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "var(--bg-primary, #0a0a0a)",
      color: "var(--text-primary, #00ff00)",
      fontFamily: "monospace",
    }}
  >
    <div className="loading-spinner">
      <span className="loading-text">Loading...</span>
      <div className="spinner-dots">
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </div>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="error-container"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "var(--bg-primary, #0a0a0a)",
            color: "var(--text-error, #ff4444)",
            fontFamily: "monospace",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1>System Error</h1>
          <p>Something went wrong. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid var(--text-error, #ff4444)",
              color: "var(--text-error, #ff4444)",
              cursor: "pointer",
              fontFamily: "monospace",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  useEffect(() => {
    initMobileViewport();

    const fontLinks = document.querySelectorAll(
      'link[rel="preload"][as="font"]',
    );
    if (fontLinks.length === 0) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = "https://fonts.googleapis.com";
      document.head.appendChild(link);
    }
  }, []);

  const HomePage: React.FC = React.memo(() => {
    const { restoreScrollPosition } = useScrollRestoration("home");

    useEffect(() => {
      restoreScrollPosition();
    }, [restoreScrollPosition]);

    return (
      <div className="App">
        <main>
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          </ErrorBoundary>
        </main>

        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  });

  HomePage.displayName = "HomePage";

  return (
    <ErrorBoundary>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />

        {/* Blog list page route */}
        <Route
          path="/blog"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <BlogList />
            </Suspense>
          }
        />

        {/* Individual blog post routes */}
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <BlogPost />
            </Suspense>
          }
        />

        {/* 404 route */}
        <Route
          path="*"
          element={
            <div
              className="error-container"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "var(--bg-primary, #0a0a0a)",
                color: "var(--text-primary, #00ff00)",
                fontFamily: "monospace",
                textAlign: "center",
              }}
            >
              <h1>404 - Page Not Found</h1>
              <p>The requested resource could not be found.</p>
              <a
                href="/"
                style={{
                  marginTop: "1rem",
                  color: "var(--text-cyber, #00ffff)",
                  textDecoration: "underline",
                }}
              >
                Return to Home
              </a>
            </div>
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default React.memo(App);
