import './App.css';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import WhatsAppFloat from './components/contact/WhatsAppFloat';
import ProductDetail from './components/product/ProductDetail';
import { CartProvider } from './components/cart/CartContext';
import CartContainer from './components/cart/CartContainer';
import ProductContainer from './components/product/ProductsContainer';
import Login from './components/login/Login';
import ProtectedRoute from './components/login/ProtectedRoute';

function App() {

  return (

    <div className="App d-flex flex-column justify-content-between" style={{ marginTop: "80px", minHeight: "100vh", }}>
      <CartProvider>
        <Router>
          <div></div>
          <Navbar />

          <Routes>
            <Route path="/electrozona/admin" element={<ProtectedRoute />}>
              <Route index element={<div>Admin panel component</div>} />
            </Route>
            <Route path="/electrozona" element={<Home />} />
            <Route path="/electrozona/login" element={<Login />} />
            <Route path="/electrozona/carrito" element={<CartContainer />} />
            <Route path="/electrozona/product/:id" element={<ProductDetail />} />
            <Route path="/electrozona/category/:id" element={<ProductContainer />} />

            <Route path="*" element={<Navigate to="/electrozona" replace />} />
          </Routes>

          <Footer />
          <WhatsAppFloat />
        </Router>
      </CartProvider>
    </div>
  );
}

export default App;
