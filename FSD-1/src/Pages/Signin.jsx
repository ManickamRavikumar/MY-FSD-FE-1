import { useNavigate, Link } from 'react-router-dom'
import React, { useState } from 'react'
import axios from 'axios';

function Signin() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://my-fsd-be-1-1.onrender.com/api/auth/register");
      alert("Signin successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert("error signin user");
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSignin}
        className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Signin
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signin 