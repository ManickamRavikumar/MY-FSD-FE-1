import { createContext, useEffect } from "react";
import socket from "../socket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.io server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.io server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
