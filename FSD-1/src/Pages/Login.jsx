import React from 'react'
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate ,Link} from "react-router-dom";

function Login() {
   const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://my-fsd-be-1-1.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("User Logged In:", res.data);

      const userData = { ...res.data, role: res.data.role };
      login(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate(userData.role?.toLowerCase() === "admin" ? "/admin" : "/");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/60 backdrop-blur-md shadow-xl rounded-xl p-10 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Welcome Back!
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline font-medium">
            Signin
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login