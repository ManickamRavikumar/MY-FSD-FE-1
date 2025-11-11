import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
// import { SocketContext } from "../Context/SocketContext";

function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(state?.order || null);
  // const socket = useContext(SocketContext);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paid = query.get("paid");

    // If redirected from Stripe and order doesn't exist in state
    if (paid && !order) {
      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      if (pendingOrder && user) {
        axios
          .post("https://my-fsd-be-1-1.onrender.com/api/order/createorder", pendingOrder, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .then((res) => {
            setOrder(res.data.order);
            localStorage.removeItem("pendingOrder");
          })
          .catch((err) => {
            console.error("Error creating order after Stripe payment:", err);
          });
      }
    }
  }, [order, user]);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-red-600">⚠️ No Order Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been confirmed and will be delivered soon.
        </p>

        <div className="bg-gray-100 rounded-md p-4 text-left mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h2>
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between text-gray-700 mb-1">
              <span>
                {item.food?.name} × {item.quantity}
              </span>
              <span>${(item.food?.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <p className="font-bold text-right text-green-700 mt-2">
            Total: ${order.totalPrice?.toFixed(2)}
          </p>
        </div>

        <p className="text-gray-700 mb-1">
          <strong>Delivery Address:</strong> {order.address}
        </p>
        <p className="text-gray-700 mb-6">
          <strong>Payment:</strong> {order.paymentMethod}
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
