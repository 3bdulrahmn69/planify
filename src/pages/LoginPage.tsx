import { useState } from 'react';

const LoginPage = () => {
  const [name, setName] = useState('Guest');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        {error && !name && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Name:
              <input
                type="text"
                id="name"
                className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </label>
          </div>
          <div>
            <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white py-2 rounded hover:bg-gradient-to-l transition duration-300">
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
