import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from 'react-icons/fi'
import { CartContext } from '../Context/CartContext';


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const {cartItems} = useContext(CartContext);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-green-400 shadow-md text-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-extrabold text-blue-600 tracking-wide"
        >
          Amma Foods 
        </Link>

        <div className="flex space-x-6 items-center text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition duration-300">
            Home
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="hover:text-blue-600 transition duration-300"
            >
              Admin Panel
            </Link>
          )}
          <Link to="/orderhistory">My Order</Link>
          
           {/* <a href="#Menu" className='hover:text-blue-600 transition duration-300'>Menu</a> */}
          {/* <a href="#MobileApp" className='hover:text-blue-600 transition duration-300'>MobileApp</a> */}
          {/* <a href="#Footer" className='hover:text-blue-600 transition duration-300'>Footer</a> */}

          {user && !isAdmin && (
            <Link to="/cart" className="relative hover:text-blue-600 flex items-center">
              <FiShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
                  {cartItems.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/singin"
                className="hover:text-blue-600 transition duration-300"
              >
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;