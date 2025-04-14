import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../redux/actions/authActions';

const Navbar = () => {
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogoutClick = () => {
    dispatch(logout());
    setIsNavbarOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 shadow-sm">
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <h2 className="uppercase font-semibold text-lg text-gray-100">
          <Link to="/" aria-label="Task Manager Home">
            Task Manager
          </Link>
        </h2>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 uppercase font-medium items-center text-gray-100">
          {authState.isLoggedIn ? (
            <>
              <li>
                <Link
                  to="/tasks/add"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md transition"
                  aria-label="Add new task"
                >
                  <i className="fa-solid fa-plus mr-2"></i> Add Task
                </Link>
              </li>
              <li>
               
              </li>
              <li>
                <button
                  onClick={handleLogoutClick}
                  className="px-3 py-2 hover:bg-gray-600 rounded-md transition"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className="px-3 py-2 text-blue-400 hover:bg-gray-600 rounded-md transition"
                aria-label="Login"
              >
                Login
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-xl text-gray-100"
          onClick={toggleNavbar}
          aria-label={isNavbarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isNavbarOpen}
        >
          <i className={`fa-solid ${isNavbarOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed md:hidden inset-0 bg-gray-700 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isNavbarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={toggleNavbar}
              aria-label="Close menu"
              className="text-xl text-gray-100"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ul className="flex flex-col gap-4 uppercase font-medium text-center mt-8 text-gray-100">
            {authState.isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/tasks/add"
                    onClick={toggleNavbar}
                    className="inline-flex justify-center items-center py-3 px-6 bg-blue-500 text-white hover:bg-blue-600 transition"
                    aria-label="Add new task"
                  >
                    <i className="fa-solid fa-plus mr-2"></i> Add Task
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={toggleNavbar}
                    className="block py-3 px-6 hover:bg-gray-600 transition"
                    aria-label="User profile"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full py-3 px-6 hover:bg-gray-600 transition"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={toggleNavbar}
                  className="block py-3 px-6 text-blue-400 hover:bg-gray-600 transition"
                  aria-label="Login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;