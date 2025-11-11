import React, { useState } from "react";
import axios from "axios";
import { categories } from "./CategoryData";

function CategoryGrid() {
  const [foods, setFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState("");

  const fetchFoods = async (category) => {
    try {
      setSelectedCategory(category);
      setError("");
      setFoods([]); // Clear previous data
      const res = await axios.get(`https://my-fsd-be-1-1.onrender.com/api/foods/menu/${category}`);
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
    <div>
      <div className='flex mt-4 flex-row gap-4 cursor-pointer' >
        {categories.map((cat) => (
          <div key={cat.name} onClick={() => fetchFoods(cat.name)} >
            <img src={cat.image} alt={cat.name} className='transition delay-150 duration-300 ease-in-out' />
            <p className='mt-2 font-bold text-center'>{cat.name}</p>
          </div>
        ))}
      </div>

      <hr />

      {selectedCategory && <h3>Showing: {selectedCategory}</h3>}

      {error && <p>{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {foods.map((food) => (
          <div key={food._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105">
          <h4>{food.name}</h4>
          {food.image && <img src={food.image} alt={food.name} className="text-sm text-gray-500  rounded-md" />}
          <p>Price: ${food.price}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryGrid