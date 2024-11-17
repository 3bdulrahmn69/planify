import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/FakeAuthContext';
import { useEffect } from 'react';

function ProtectedRoutes({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
}

export default ProtectedRoutes;
