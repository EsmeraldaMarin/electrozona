import './App.css';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WhatsAppFloat from './components/contact/WhatsAppFloat';
import ProductDetail from './components/product/ProductDetail';

function App() {
  return (
    <div className="App d-flex flex-column justify-content-between" style={{marginTop:"80px", minHeight:"100vh", }}>

      <Router>
        <div></div>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>

        <Footer />
        <WhatsAppFloat />
      </Router>

    </div>
  );
}

export default App;
