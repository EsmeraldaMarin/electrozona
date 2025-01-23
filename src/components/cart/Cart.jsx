import React from 'react';
import { UseCart } from './CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { totalQuantity } = UseCart(); // Obtén la función para obtener el total de ítems
    const totalItems = totalQuantity(); // Obtén el número total de ítems

    return (
        <Link to='/electrozona/carrito' className="d-flex justify-content-center align-items-center" style={{ color: "#fff", width: '50px', height: '50px' }}>
            <i className="bi bi-cart me-1" style={{ fontSize: '1.5em' }}></i>
            <div className="cant_productos fw-bold"
                style={{
                    backgroundColor: '#bbb',
                    color: "#000",
                    borderRadius: "50px",
                    fontSize: "12px",
                    padding: "2px 7px"
                }}>
                {totalItems} {/* Muestra el número total de ítems */}
            </div>
        </Link>
    );
}

export default Cart;
