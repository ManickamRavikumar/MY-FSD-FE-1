import React, { useContext } from 'react'
import { CartContext } from '../Context/CartContext';
import { useNavigate } from 'react-router-dom';



function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useContext(CartContext);
  console.log("Cart Items in Cart Page:", cartItems);


  
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div>
        <button
          onClick={() => navigate(-1)}
          className=" px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Back
        </button>
      </div>


      {/* Cart  */}

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Cart is empty</p>
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cartItems.map((item) => {
              if (!item.food) return null; // Skip invalid items
              return (
                <div
                  key={item.food._id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <img
                    src={`/assets/${item.food.image}`}
                    alt={item.food.name}
                    className="w-40 h-40 object-cover rounded-md mb-3"
                  />

                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.food.name}
                  </h2>
                  <p className="text-blue-600 font-bold">${item.food.price}</p>
                  <p className="text-gray-600 mb-3">
                    Quantity: <span className="font-medium">{item.quantity}</span>
                  </p>

                  <p className="text-gray-800 font-semibold mb-4">
                    Total Price: <span className="text-green-600">
                      ${(item.food.price * item.quantity).toFixed(2)}
                    </span>
                  </p>

                  <div className="flex items-center mt-3">
                    <button
                      onClick={() => updateQuantity(item.food._id, -1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.food._id, 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.food._id)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}

          <div className="mt-10 max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🧾 Order Summary
            </h2>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border-b p-3 font-semibold text-gray-700">Item Name</th>
                  <th className="border-b p-3 font-semibold text-gray-700 text-center">Qty</th>
                  <th className="border-b p-3 font-semibold text-gray-700 text-center">Price</th>
                  <th className="border-b p-3 font-semibold text-gray-700 text-right">Total Price</th>
                </tr>
              </thead>

              <tbody>
                {cartItems
                  .filter(item => item.food) // skip invalid items
                  .map(item => (
                    <tr key={item.food._id} className="hover:bg-gray-50">
                      <td className="border-b p-3">{item.food.name}</td>
                      <td className="border-b p-3 text-center">{item.quantity}</td>
                      <td className="border-b p-3 text-center">${item.food.price}</td>
                      <td className="border-b p-3 text-right font-medium text-green-600">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>

              <tfoot>
                <tr className="bg-gray-100">
                  <td colSpan="3" className="p-3 font-semibold text-right">
                    Total:
                  </td>
                  <td className="p-3 font-bold text-right text-green-700">
                    ${totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div className="text-center mt-6">
              <button
                onClick={() =>
                  navigate("/order", { state: { cartItems, totalPrice } })
                }
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg font-semibold transition"
              >
                ✅ Proceed Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart