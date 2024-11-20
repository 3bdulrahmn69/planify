import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './Context/FakeAuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
const Board = lazy(() => import('./pages/Board/Board'));

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
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="login" element={<LoginPage />} />

    {/* Protected Routes */}
    <Route
      path="app/*"
      element={
        <ProtectedRoutes>
          <DashboardProvider>
            <DndProvider backend={HTML5Backend}>
              <AppProtectedRoutes />
            </DndProvider>
          </DashboardProvider>
        </ProtectedRoutes>
      }
    />

    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppProtectedRoutes = () => (
  <Routes>
    <Route path="" element={<Dashboard />} />
    <Route path="board" element={<Board />} />
  </Routes>
);

export default App;
