import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // 👈 For popup modal
  const [newFood, setNewFood] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      alert("Access denied! Admins only.");
      navigate("/");
      return;
    }

    fetchFoods();
    fetchOrders();
  }, [user]);

  const fetchFoods = async () => {
    try {
      const res = await axios.get("https://my-fsd-be-1-1.onrender.com/api/foods");
      setFoods(res.data.data);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://my-fsd-be-1-1.onrender.com/api/order/getorder", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(res.data.orderData);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };



  const handleAddFood = async () => {
    const { name, description, price, image, category } = newFood;
    if (!name || !description || !price || !image || !category) {
      alert("Please fill in all required fields!");
      return;
    }
    try {
      await axios.post("https://my-fsd-be-1-1.onrender.com/api/foods/create", newFood, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("✅ Food added successfully!");
      setNewFood({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "",
      });
      fetchFoods();
    } catch (err) {
      alert("Error adding food!");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food?")) {
      await axios.delete(`https://my-fsd-be-1-1.onrender.com/api/foods/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchFoods();
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `https://my-fsd-be-1-1.onrender.com/api/order/status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // 👇 When user clicks name, show popup
  const handleOpenPopup = (order) => {
    setSelectedOrder(order);
  };

  // 👇 Close popup
  const handleClosePopup = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🛠️ Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Add New Food Section */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-10">
        <h2 className="text-xl font-bold mb-4">➕ Add New Food</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newFood.description}
            onChange={(e) =>
              setNewFood({ ...newFood, description: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newFood.price}
            onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newFood.stock}
            onChange={(e) => setNewFood({ ...newFood, stock: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Image filename"
            value={newFood.image}
            onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={newFood.category}
            onChange={(e) =>
              setNewFood({ ...newFood, category: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={handleAddFood}
          className="mt-4 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white px-6 py-2 rounded "
        >
          Add Food
        </button>
      </div>

      {/* Food List */}
      <div className="bg-white p-6 shadow-md rounded-lg mb-10">
        <h2 className="text-xl font-bold mb-4">🍔 Food List</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              {/* <th className="p-2">Stock</th> */}
              <th className="p-2">Category</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id} className="border-b">
                <td className="p-2">{food.name}</td>
                <td className="p-2">${food.price}</td>
                {/* <td className="p-2">{food.stock}</td> */}
                <td className="p-2">{food.category}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders Section */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">📦 Orders</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">User</th>
              <th className="p-2">Total Price</th>
              <th className="p-2">Created</th>
              <th className="p-2">Delivered</th>
              <th className="p-2">Cancelled</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b">
                <td
                  className="p-2 text-blue-600 underline cursor-pointer"
                  onClick={() => handleOpenPopup(order)}
                >
                  {order.user?.name}
                </td>
                <td className="p-2">${order.totalPrice}</td>
                <td className="p-2">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleString()
                    : "-"}
                </td>
                <td className="p-2">
                  {order.cancelledAt
                    ? new Date(order.cancelledAt).toLocaleString()
                    : "-"}
                </td>
                <td
                  className={`p-2 font-semibold ${order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                    }`}
                >
                  {order.status}
                  {order.status === "Cancelled" && order.cancelledBy && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({order.cancelledBy})
                    </span>
                  )}
                </td>

                <td className="p-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🪟 Popup Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              🧾 Order Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Order ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Name:</strong> {selectedOrder.user?.name}
              </p>
              <p>
                <strong>Mobile No:</strong>{selectedOrder.mobile}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Total Price:</strong> ${selectedOrder.totalPrice}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {selectedOrder.paymentMethod === "online"
                  ? "Online Payment"
                  : "Cash on Delivery"}
              </p>
              {selectedOrder.paymentMethod === "online" &&
                selectedOrder.paymentId && (
                  <p>
                    <strong>Payment ID:</strong> {selectedOrder.paymentId}
                  </p>
                )}
              <p>
                <strong>Created Time:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Delivered Time:</strong>{" "}
                {selectedOrder.deliveredAt
                  ? new Date(selectedOrder.deliveredAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Cancelled Time:</strong>{" "}
                {selectedOrder.cancelledAt
                  ? new Date(selectedOrder.cancelledAt).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${selectedOrder.status === "Delivered"
                    ? "text-green-600"
                    : selectedOrder.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                    }`}
                >
                  {selectedOrder.status}
                </span>
                {selectedOrder.status === "Cancelled" && selectedOrder.cancelledBy && (
                  <span className="text-gray-600 text-sm ml-1">
                    ({selectedOrder.cancelledBy})
                  </span>
                )}
              </p>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
