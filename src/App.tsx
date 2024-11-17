import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

/* Components */
import GoToTop from './components/GoToTop';
import SpinnerFullPage from './components/SpinnerFullPage';

/* Pages - Lazy Loaded */
const HomePage = lazy(() => import('./pages/home/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <SuspenseWrapper>
        <GoToTop />
        <AppRoutes />
      </SuspenseWrapper>
    </BrowserRouter>
  );
}

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<SpinnerFullPage />}>{children}</Suspense>;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
