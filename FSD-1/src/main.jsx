import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { CartProvider } from './Context/CartContext.jsx'
import { SocketProvider } from './Context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider> 
    <Router>
       <CartProvider>
        <SocketProvider>
           <App />
        </SocketProvider>       
       </CartProvider>     
    </Router>
  </AuthProvider>

)
