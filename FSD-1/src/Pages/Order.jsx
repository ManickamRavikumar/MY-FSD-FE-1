import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
// import { SocketContext } from "../Context/SocketContext";

function Order() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // const socket = useContext(SocketContext)

  // Initialize with either state or localStorage
  const [cart, setCart] = useState(state?.cartItems || []);
  const [totalPrice, setTotalPrice] = useState(state?.totalPrice || 0);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [mobile, setMobile] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(false);
 
  // Restore order details if user navigates back from payment
  useEffect(() => {
    if ((!state || !state.cartItems) && localStorage.getItem("pendingOrder")) {
      const savedOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      setCart(savedOrder.cartItems || []);
      setTotalPrice(savedOrder.totalPrice || 0);
    }
  }, [state]);

   const validateIndianMobile = (number) => /^[6-9]\d{9}$/.test(number);

  const handleMobileChange = (e) => {
    const input = e.target.value.replace(/\D/g, ""); // remove non-numeric chars
    setMobile(input);
    setIsMobileValid(validateIndianMobile(input));
  };




  const handleConfirmOrder = async () => {
    if (!address.trim() || !mobile.trim()) {
      alert("Please enter your delivery address!");
      return;
    }

    if (!user) {
      alert("Please login to place an order!");
      navigate("/login");
      return;
    }

    if (!isMobileValid) {
      alert("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }

    const formattedMobile = `+91${mobile}`;


    const orderData = {
      cartItems: cart,
      address,
      paymentMethod,
      totalPrice,
      mobile: formattedMobile,
    };

    try {
      if (paymentMethod === "cash") {
        //  Cash on Delivery
        const res = await axios.post(
          "https://my-fsd-be-1-1.onrender.com/api/order/createorder",
          orderData,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        alert("✅ Order placed successfully!");

        // Clear saved order after successful placement
        localStorage.removeItem("pendingOrder");

        navigate("/ordersuccess", { state: { order: res.data.order } });
      } else {
        // 💳 Online Payment via Stripe
        localStorage.setItem("pendingOrder", JSON.stringify(orderData));

        const res = await axios.post(
          "https://my-fsd-be-1-1.onrender.com/api/payment/create-checkout",
          { foodItems: cart },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        if (res.data.url) {
          // Redirect user to Stripe Checkout
          window.location.href = res.data.url;
        } else {
          alert("Stripe session not created!");
        }
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("Error placing order!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          🛍️ Confirm Your Order
        </h1>

        {/* Cart Summary */}
        <div className="border-b pb-4 mb-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.food?._id}
                className="flex justify-between items-center mb-2"
              >
                <p>
                  {item.food?.name} × {item.quantity}
                </p>
                <p className="font-semibold text-green-700">
                  ${(item.food?.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No items in order.</p>
          )}

          <h2 className="text-xl font-bold text-right text-green-700">
            Total: ${totalPrice.toFixed(2)}
          </h2>
        </div>
         {/* Mobile Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Mobile Number (India):
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-bold">+91</span>
            <input
              type="text"
              maxLength="10"
              value={mobile}
              onChange={handleMobileChange}
              className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter 10-digit number"
            />
            {isMobileValid ? (
              <span className="text-green-600 font-bold">✅</span>
            ) : (
              <span className="text-red-500 font-bold">❌</span>
            )}
          </div>
        </div>
       
        {/* Delivery Address */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Delivery Address:
          </label>
          <textarea
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your full delivery address..."
          ></textarea>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Payment Method:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Online Payment
            </label>
          </div>
        </div>

        <button
          onClick={handleConfirmOrder}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded text-lg font-semibold transition"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Order;
