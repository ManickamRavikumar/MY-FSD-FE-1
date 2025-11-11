import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Header from '../Components/Header';
import { Link } from 'react-router-dom';
import Menu from '../Components/Menu';
import { CartContext } from '../Context/CartContext';
import { SocketContext } from '../Context/SocketContext';



function Home() {

    const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
    const socket = useContext(SocketContext);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        // Fetch foods
        axios
            .get("https://my-fsd-be-1-1.onrender.com/api/foods")
            .then((res) => {
                console.log("Foods fetched:", res.data.data);
                setFoods(res.data.data || [])
            })
        socket.on("foodAdded", (food) => {
            console.log("🆕 Food added:", food);
            setFoods((prev) => [...prev, food]);
        });

        socket.on("foodUpdated", (updateFoods) => {
            console.log("♻️ Food updated:", updateFoods);
            setFoods((prev) =>
                prev.map((f) => (f._id === updateFoods._id ? updateFoods : f))
            );
        });

        socket.on("foodDeleted", (foodId) => {
            console.log("❌ Food deleted:", foodId);
            setFoods((prev) => prev.filter((f) => f._id !== foodId));
        });

        return () => {
            socket.off("foodAdded");
            socket.off("foodUpdated");
            socket.off("foodDeleted");
        };
    }, []);



    console.log("food data", foods);
    console.log("cartItems", cartItems);



    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-10 overflow-y-auto">
                <Header />
                <Menu />
                {foods.length === 0 ? (
                    <div className="text-center text-gray-600">
                        <p>No food items available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                        {foods.map((food) => {
                            const inCart = cartItems.some((item) => item.food && item.food._id === food._id);
                            return (
                                <div key={food._id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between transition-transform hover:scale-105">
                                    <Link to={`/food/${food._id}`}>
                                        <img src={`/assets/${food.image}`} alt={food.name} className="text-sm text-gray-500  rounded-md" />
                                    </Link>

                                    <h1 className='text-2xl  font-semibold'>{food.name}</h1>
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
                                    <h2>{food.description}</h2>
                                    {inCart ? (
                                        <button
                                            onClick={() => removeFromCart(food._id)}
                                            className="mt-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded hover:opacity-90 transition  py-2 rounded"
                                        >
                                            Remove from Cart
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(food._id)}
                                            className="mt-4 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white py-2 rounded transition"
                                        >
                                            Add to Cart
                                        </button>
                                    )}

                                </div>

                            )
                        })}
                    </div>
                )}

            </div>

        </>

    )
}

export default Home