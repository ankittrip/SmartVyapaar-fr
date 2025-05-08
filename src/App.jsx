import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import ManufacturerDetail from './pages/ManufacturerDetail';
import AdminPanel from './pages/AdminPanel';
import { fetchManufacturers } from './services/api';

const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';


function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}


const LoadingSpinner = () => (
  <div className="flex justify-center items-center mt-4">
    <div className="w-12 h-12 border-4 border-t-4 border-yellow-300 rounded-full animate-spin"></div>
  </div>
);


const ErrorMessage = ({ message }) => (
  <div className="text-red-500 text-center mt-2">
    <p>{message}</p>
  </div>
);


function Home() {
  const [manufacturers, setManufacturers] = useState([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManufacturers()
      .then((data) => {
        if (data && data.manufacturers) {
          setManufacturers(data.manufacturers);
          setFilteredManufacturers(data.manufacturers); 
        } else {
          setError('Unexpected response format.');
        }
      })
      .catch(() => setError('Error fetching manufacturers.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = manufacturers.filter((manufacturer) =>
      manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manufacturer.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredManufacturers(filtered);
  }, [searchTerm, manufacturers]);

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 px-6 min-h-[80vh] rounded-xl shadow-2xl">
      <h1 className="text-4xl font-bold text-center mb-10">Manufacturers List</h1>
      <h3 className="text-2xl font-semibold text-center mb-8">Search Manufacturers</h3>

      
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 px-4 py-2 rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
        />
      </div>

     
      {loading && <LoadingSpinner />}

     
      {error && <ErrorMessage message={error} />}

      
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          {filteredManufacturers.length > 0 ? (
            filteredManufacturers.map((manufacturer) => (
              <div
                key={manufacturer._id}
                className="bg-white text-gray-900 rounded-xl shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:scale-105"
              >
                <Link
                  to={`/manufacturer/${manufacturer._id}`}
                  className="text-2xl font-semibold text-blue-700 hover:text-yellow-500 transition"
                >
                  {manufacturer.name}
                </Link>
                <p className="mt-2 text-sm text-gray-600">{manufacturer.category}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-white">No manufacturers available.</p>
          )}
        </div>
      )}
    </div>
  );
}


function About() {
  return (
    <div className="bg-gradient-to-br from-green-500 via-yellow-400 to-blue-400 text-white py-12 px-6 rounded-2xl shadow-2xl">
      <h1 className="text-4xl font-bold mb-6 text-center">About SmartVyapaar</h1>
      <p className="text-lg text-center max-w-3xl mx-auto">
        SmartVyapaar is a B2B platform that bridges the gap between manufacturers and buyers by simplifying product sourcing, communication, and collaboration across industries.
      </p>
    </div>
  );
}


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldShowNavbar = location.pathname !== '/login';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {shouldShowNavbar && (
        <nav className="bg-gray-900 p-4 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <ul className="flex space-x-6">
              <li>
                <Link className="text-white text-lg hover:text-yellow-400 transition duration-200" to="/">Home</Link>
              </li>
              <li>
                <Link className="text-white text-lg hover:text-yellow-400 transition duration-200" to="/about">About</Link>
              </li>
            </ul>
            <ul className="flex space-x-6 items-center">
              {!isLoggedIn() ? (
                <li>
                  <Link 
                    className="text-white text-lg hover:text-yellow-400 transition duration-200"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link 
                      className="text-white text-lg hover:text-yellow-400 transition duration-200"
                      to="/admin"
                    >
                      Admin Panel
                    </Link>
                  </li>
                  <li>
                    <button
                      className="text-white text-lg hover:text-yellow-400 transition duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      )}

      <main className="p-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
          <Route path="/manufacturer/:id" element={<PrivateRoute><ManufacturerDetail /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        </Routes>
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-10 text-center shadow-inner">
        <p>&copy; {new Date().getFullYear()} SmartVyapaar. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
