import './App.css';
import Footer from './components/footer/Footer';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import WhatsAppFloat from './components/contact/WhatsAppFloat';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Home></Home>
      <Footer></Footer>
      <WhatsAppFloat></WhatsAppFloat>
    </div>
  );
}

export default App;
