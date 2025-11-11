import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../Context/CartContext";
// import { SocketContext } from "../Context/SocketContext";

function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  // const socket = useContext(SocketContext);

  useEffect(() => {
    axios
      .get(`https://my-fsd-be-1-1.onrender.com/api/foods/${id}`)
      .then((res) => {
        setFood(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching food:", err);
        setLoading(false);
        navigate("/");
      });
  }, [id, navigate]);






  if (loading)
    return <div className="text-center p-10 text-gray-600">Loading...</div>;

  if (!food)
    return (
      <div className="text-center p-10 text-red-500">Food item not found.</div>
    );

  const inCart = cartItems.some((item) => item.food && item.food._id === food._id);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Back
        </button>

        <img
          src={`/assets/${food.image}`}
          alt={food.name}
          className="w-full h-80 object-cover rounded-md mb-4"
        />

        <h1 className="text-3xl font-bold mb-2">{food.name}</h1>

        <div className="mt-2 mb-2 flex flex-row justify-between items-center">
          <h1 className="text-green-600 font-bold text-2xl ">
            ${food.price}
          </h1>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-lg ${
                  star <= Math.round(food.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({food.rating.toFixed(1)})
            </span>
          </div>
        </div>

        <p className="text-gray-700 text-lg mb-2">{food.description}</p>

        <div className="mt-6">
          {inCart ? (
            <button
              onClick={() => removeFromCart(food._id)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
            >
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={() => addToCart(food._id)}
              className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white py-2 rounded transition"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* 💬 Customer Comments (Display Only) */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            💬 Customer Comments
          </h2>

          {food.comments && food.comments.length > 0 ? (
            <div className="space-y-3">
              {food.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border p-3 rounded-md shadow-sm"
                >
                  <p className="font-semibold text-gray-800">
                    {comment.user}
                  </p>
                  <p className="text-gray-700 text-sm mt-1">
                    {comment.text}
                  </p>
                  {comment.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
