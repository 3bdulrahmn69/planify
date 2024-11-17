import { useAuth } from '../Context/FakeAuthContext';
import { RiLogoutBoxLine } from 'react-icons/ri';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface LogoutBtnProps {
  variant?: ButtonVariant;
}

const LogoutBtn: React.FC<LogoutBtnProps> = ({ variant = 'primary' }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Define styles for each variant
  const buttonStyles = {
    primary: 'bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400',
    outline:
      'border border-red-500 text-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white',
    text: 'text-red-500 px-3 py-1 hover:bg-red-100 rounded',
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-sm flex items-center gap-2 ${buttonStyles[variant]}`}
    >
      <RiLogoutBoxLine /> Logout
    </button>
  );
};

export default LogoutBtn;
