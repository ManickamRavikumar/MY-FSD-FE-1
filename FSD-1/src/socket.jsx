
import { io } from "socket.io-client";

// ⚙️ Change the URL to your backend port (you used port 3000 in backend)
const SOCKET_URL = "https://my-fsd-be-1-1.onrender.com";

// Create a single socket instance
const socket = io(SOCKET_URL, {
  transports: ["websocket"], // helps prevent CORS/polling issues
});

export default socket;
