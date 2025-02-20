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
import ProductManager from './components/productManager/ProductManager';
import ScrollToTop from "./components/formatters/ScrollToTop"
import ProductEdit from './components/productManager/ProductEdit';
import NavbarAdmin from './components/navbar/NavbarAdmin';

// Layout para el admin (sin Navbar ni WhatsAppFloat)
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <NavbarAdmin></NavbarAdmin>
      <Outlet /> {/* Renderiza las rutas hijas */}
    </div>
  );
};

function App() {
  return (
    <div className="App d-flex flex-column justify-content-between" style={{ marginTop: "80px", minHeight: "100vh" }}>
      <CartProvider>
        <Router>
          <ScrollToTop />

          <Routes>
            {/* Rutas ADMIN sin Navbar ni WhatsAppFloat */}
            <Route path="/electrozona/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<ProductManager />} />
                <Route path="product/:id" element={<ProductEdit />} />
              </Route>
            </Route>

            {/* Rutas normales con Navbar y WhatsAppFloat */}
            <Route path="/electrozona" element={<NavbarWrapper />} />
          </Routes>

          <Footer />
        </Router>
      </CartProvider>
    </div>
  );
}

// Componente que envuelve rutas normales con Navbar y WhatsAppFloat
const NavbarWrapper = () => (
  <>
    <Navbar />
    <WhatsAppFloat />
    <Routes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="carrito" element={<CartContainer />} />
      <Route path="product/:id" element={<ProductDetail />} />
      <Route path="category/:id" element={<ProductContainer />} />
      <Route path="*" element={<Navigate to="/electrozona" replace />} />
    </Routes>
  </>
);

export default App;
