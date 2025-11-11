import React, { useState, useContext } from "react";
import axios from "axios";
import { categories } from "./CategoryData";
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext)


  // Fetch foods by category
  const fetchFoods = async (category) => {
    try {
      setSelectedCategory(category);
      setError("");
      setFoods([]); // Clear previous data
      const res = await axios.get(
        `https://my-fsd-be-1-1.onrender.com/api/foods/menu/${category}`
      );
      setFoods(res.data.data);
    } catch (err) {
      setFoods([]);
      if (err.response && err.response.status === 404) {
        setError("No items found in this category.");
      } else {
        setError("Something went wrong.");
      }
    }
  };


  return (
    <div className="px-6 ">
      {/* Category Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-6 mt-4">
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => fetchFoods(cat.name)} >
            <img
              src={cat.image}
              alt={cat.name}
              className="transition delay-150 duration-300 ease-in-out hover:scale-105"
            />
            <p className="mt-2 font-bold text-center">{cat.name}</p>
          </div>
        ))}
      </div>

      <hr className="my-6" />

      {selectedCategory && (
        <h3 className="text-center text-white text-xl font-bold mb-4">
          Showing: {selectedCategory}
        </h3>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Foods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {foods.map((food) => {
          const inCart = cartItems.some(
            (item) => item.food && item.food._id === food._id
          );

          return (
            <div
              key={food._id}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105"
               onClick={()=> navigate(`/food/${food._id}`)}>
              {food.image && (
                <img
                  src={`/assets/${food.image}`}
                  alt={food.name}
                  className="rounded-md mb-3 h-40 w-full object-cover"
                />
              )}

              <h1 className="text-lg font-semibold">{food.name}</h1>
              <div className="mt-2 mb-2 flex flex-row justify-between items-center">
                <h1 className='text-green-600 font-bold text-2xl '>${food.price}</h1>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${star <= Math.round(food.rating) ? "text-yellow-400" : "text-gray-300"
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
              <p className="text-gray-600 mb-3">{food.description}</p>

              {inCart ? (
                <button
                  onClick={() => removeFromCart(food._id)}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded hover:opacity-90 transition"
                >
                  Remove from Cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(food._id)}
                  className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white py-2 rounded hover:opacity-90 transition"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Menu;
