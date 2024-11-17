import { Link } from 'react-router-dom';

import notFound from '../assets/not-found.svg';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <img src={notFound} alt="Not Found" className="mt-8 w-1/2 max-w-md" />
      <p className="mt-4 text-2xl text-gray-700">Oops! Page not found.</p>
      <p className="mt-2 text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
