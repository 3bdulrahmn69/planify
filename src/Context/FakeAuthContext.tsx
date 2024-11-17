import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';

interface User {
  name: string;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

type AuthAction = { type: 'login'; payload: User } | { type: 'logout' };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Function to retrieve initial state from localStorage
const getInitialState = (): AuthState => {
  const user = localStorage.getItem('user');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return user && isAuthenticated
    ? { user: JSON.parse(user), isAuthenticated }
    : initialState;
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'logout':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error(`Unhandled action type}`);
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    getInitialState() // Initialize state from localStorage
  );

  const FAKE_USER: User = {
    name: 'guest',
    avatar: 'https://i.pravatar.cc/100',
  };

  useEffect(() => {
    // Store user and isAuthenticated in localStorage when they change
    if (isAuthenticated && user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, [user, isAuthenticated]);

  function login(name: string) {
    dispatch({ type: 'login', payload: { name, avatar: FAKE_USER.avatar } });
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string) => void;
  logout: () => void;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
