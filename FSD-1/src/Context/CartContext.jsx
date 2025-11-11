import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "./SocketContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const socket = useContext(SocketContext);


  // Fetch Cart (only if user logged in)
    
  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        navigate("/admin");
        return;
      }
      axios.get("https://my-fsd-be-1-1.onrender.com/api/cart/viewcart", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then((res) => {
          setCartItems(res.data.data.items || [].filter(item => item.food));
          console.log("Cart fetched:", res.data.data.items);
          calculateTotal(res.data.data.items || []);
        })
        .catch((err) => console.log("Cart Error:", err))

    };
  }, [user,navigate]);
  

  


   // Add to Cart
  const addToCart = (foodId) => {
    if (!user) {
      alert("Please login to add items to cart!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    axios
      .post(
        "https://my-fsd-be-1-1.onrender.com/api/cart/add",
        { foodId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        setCartItems([...cartItems, { food: { _id: foodId } }]);
        
      })
      .catch(() => alert("Error adding to cart!"));
  };

  //  Remove from Cart
  const removeFromCart = (foodId) => {
    axios
      .delete(
        `https://my-fsd-be-1-1.onrender.com/api/cart/remove/${foodId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        setCartItems(
          cartItems.filter((item) => item.food && item.food._id !== foodId)
        );
      })
      .catch(() => alert("Error removing from cart!"));
  };

   // Update Quantity

  const updateQuantity = (foodId, change) => {
    if (cartItems.find((item) => item.food && item.food._id === foodId)?.quantity + change < 1)
      return;
    axios.put(`https://my-fsd-be-1-1.onrender.com/api/cart/update/${foodId}`,
      { change },
      { headers: { Authorization: `Bearer ${user.token}` } })
      .then(() => {
        const updatedCart = cartItems.map((item) => item.food && item.food._id === foodId ?
          { ...item, quantity: item.quantity + change } : item);
        setCartItems(updatedCart);
        calculateTotal(updatedCart);
      })
      .catch((err) =>console.log("Error updating quantity!", err));
  };
  
   const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + (item.food ?.price || 0 )* item.quantity, 0);
    setTotalPrice(total);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart , updateQuantity , calculateTotal, totalPrice}}>
      {children}
    </CartContext.Provider>
  );
};
