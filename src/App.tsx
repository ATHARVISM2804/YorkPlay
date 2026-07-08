import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Nav from './components/layout/Nav';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import Preloader from './components/layout/Preloader';
import ScrollToTop from './components/layout/ScrollToTop';
import Cursor from './components/ui/Cursor';
import { useLenis } from './hooks/useLenis';

// Code-split pages for performance
const Hook = lazy(() => import('./pages/Hook'));
const RipReel = lazy(() => import('./pages/RipReel'));
const ScriptPage = lazy(() => import('./pages/Script'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));

function AppContent() {
  const location = useLocation();

  // Initialize Lenis smooth scroll
  useLenis();

  // The admin dashboard is an owner-only back office — no marketing chrome
  // (nav, background audio, or footer). It gets its own logo-only shell.
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Nav />}
      <PageTransition>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--color-ink)',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  border: '1.5px solid var(--color-line)',
                  borderTopColor: 'var(--color-gold)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Hook />} />
            <Route path="/rip-reel" element={<RipReel />} />
            <Route path="/script" element={<ScriptPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </PageTransition>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Monitor custom event for toggling focus mode
  useEffect(() => {
    const handleToggle = () => {
      setFocusMode(prev => !prev);
    };

    window.addEventListener('toggle-focus-mode', handleToggle);
    return () => {
      window.removeEventListener('toggle-focus-mode', handleToggle);
    };
  }, []);

  // Track cursor coordinates for the spotlight effect when focus mode is active
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    if (focusMode) {
      window.addEventListener('mousemove', onMouseMove);
      document.body.classList.add('focus-mode-active');
    } else {
      document.body.classList.remove('focus-mode-active');
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.classList.remove('focus-mode-active');
    };
  }, [focusMode]);

  return (
    <BrowserRouter>
      {/* Film grain overlay */}
      <div className="film-grain" aria-hidden="true" />

      {/* Cinematic spotlight mask overlay */}
      <div className="focus-spotlight" aria-hidden="true" />

      {/* Custom cursor */}
      <Cursor />

      {/* Preloader — skipped on the owner-only admin route */}
      {!preloaderDone && !window.location.pathname.startsWith('/admin') && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      {/* App content */}
      <AppContent />

      {/* Global animation keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </BrowserRouter>
  );
}
