import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { SocketContext } from "../Context/SocketContext";

function OrderHistory() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [tempRatings, setTempRatings] = useState({});
  const [tempComments, setTempComments] = useState({});
  // const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        alert("Please login to view your orders!");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "https://my-fsd-be-1-1.onrender.com/api/order/getmyorderuser",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setOrders(res.data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Error fetching your order history!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);


  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.put(
        `https://my-fsd-be-1-1.onrender.com/api/order/cancelorderuser/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      alert("Order cancelled successfully!");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: "Cancelled", cancelledAt: new Date().toISOString() }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  // ✅ Fixed Rating Handler
  const handleRateOrder = async (orderId) => {
    const rating = tempRatings[orderId];
    const comment = tempComments[orderId];

    if (!rating) return alert("Please select a star rating first!");

    console.log("Sending rating request:", { orderId, rating, comment });
    console.log("User token:", user?.token);

    try {
      const res = await axios.put(
        `https://my-fsd-be-1-1.onrender.com/api/order/rating/${orderId}`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      console.log("Rating response:", res.data);

      alert(res.data.message || "Thank you for your feedback!");

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, rating, comment } : order
        )
      );

      // Clear temp values
      setTempRatings((prev) => ({ ...prev, [orderId]: undefined }));
      setTempComments((prev) => ({ ...prev, [orderId]: "" }));
    } catch (error) {
      console.error("Axios error response:", error.response);
      alert(error.response?.data?.message || "Failed to rate order");
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading your orders...</p>;

  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const otherOrders = orders.filter((order) => order.status !== "Pending");

  const renderOrderCard = (order) => (
    <div key={order._id} className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-700">
          <strong>Order ID:</strong> {order._id}
        </p>
        <span
          className={`px-3 py-1 text-sm rounded font-semibold ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : order.status === "Cancelled"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <table className="w-full border-collapse mb-3">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border-b p-3">Item</th>
            <th className="border-b p-3 text-center">Qty</th>
            <th className="border-b p-3 text-center">Price</th>
            <th className="border-b p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={`${order._id}-${item.food?._id}`} className="hover:bg-gray-50">
              <td className="border-b p-3">{item.food?.name}</td>
              <td className="border-b p-3 text-center">{item.quantity}</td>
              <td className="border-b p-3 text-center">${item.food?.price}</td>
              <td className="border-b p-3 text-right text-green-700 font-semibold">
                ${(item.food?.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center ">
        <div>
          <p className="text-gray-600">
                <strong>Mobile:</strong> {order.mobile || "N/A"}
              </p>
          <p className="text-gray-600">
            <strong>Address:</strong> {order.address}
          </p>
          <p className="text-gray-600">
            <strong>Payment:</strong> {order.paymentMethod}
          </p>
          <p className="text-gray-500 text-sm">
            Placed on: {new Date(order.createdAt).toLocaleString()}
          </p>

          {order.status === "Delivered" && order.deliveredAt && (
            <p className="text-green-600 text-sm">
              Delivered on: {new Date(order.deliveredAt).toLocaleString()}
            </p>
          )}

          {order.status === "Cancelled" && order.cancelledAt && (
            <p className="text-red-600 text-sm">
              Cancelled on: {new Date(order.cancelledAt).toLocaleString()}
            </p>
          )}
        </div>

        <div>
          {/* ⭐ Rating Section */}
          {order.status === "Delivered" && order.rating == null && (
            <div className="mt-4 pt-3">
              <h3 className="font-semibold text-gray-700 mb-2">Rate this order</h3>

              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() =>
                      setTempRatings({ ...tempRatings, [order._id]: star })
                    }
                    className={`cursor-pointer text-2xl ${
                      (tempRatings[order._id] || 0) >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Leave a comment..."
                className="w-full border rounded p-2 text-sm mb-2"
                value={tempComments[order._id] || ""}
                onChange={(e) =>
                  setTempComments({ ...tempComments, [order._id]: e.target.value })
                }
              />

              <button
                onClick={() => handleRateOrder(order._id)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit Rating
              </button>
            </div>
          )}

          {order.status === "Delivered" && order.rating != null && (
            <div className="mt-3 text-yellow-500">
              ⭐ {order.rating} / 5
              {order.comment && <p className="text-gray-600 mt-1">"{order.comment}"</p>}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-green-700 font-bold text-lg">
            Total: ${order.totalPrice.toFixed(2)}
          </p>

          {order.status === "Pending" && (
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ← Back
      </button>

      {pendingOrders.length > 0 && (
        <div className="max-w-5xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">⏳ Pending Orders</h2>
          <div className="space-y-6">{pendingOrders.map((order) => renderOrderCard(order))}</div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">📦 My Order History</h1>

      {otherOrders.length === 0 && pendingOrders.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <div className="max-w-5xl mx-auto space-y-6">{otherOrders.map((order) => renderOrderCard(order))}</div>
      )}
    </div>
  );
}

export default OrderHistory;
