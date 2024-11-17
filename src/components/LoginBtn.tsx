import { Link } from 'react-router-dom';

const LoginBtn = () => {
  return (
    <Link
      to="/login"
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold shadow-lg"
      aria-label="Login to your account"
    >
      Login
    </Link>
  );
};

export default LoginBtn;
