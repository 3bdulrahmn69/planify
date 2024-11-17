import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './Context/FakeAuthContext';

/* Components */
import GoToTop from './components/GoToTop';
import SpinnerFullPage from './components/SpinnerFullPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import { DashboardProvider } from './Context/DashboardContext';

/* Pages - Lazy Loaded */
const HomePage = lazy(() => import('./pages/home/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Board/Dashboard'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SuspenseWrapper>
          <GoToTop />
          <AppRoutes />
        </SuspenseWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Suspense fallback={<SpinnerFullPage />}>{children}</Suspense>;

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />
    <Route
      path="app"
      element={
        <ProtectedRoutes>
          <DashboardProvider>
            <Dashboard />
          </DashboardProvider>
        </ProtectedRoutes>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
