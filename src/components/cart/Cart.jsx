import React from 'react';
const Cart = () => {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ color: "#fff", width: '50px', height: '50px'}}>
            <i className="bi bi-cart me-1" style={{ fontSize: '1.5em' }}></i>
            <div className="cant_productos fw-bold"
                style={{
                    backgroundColor: '#bbb',
                    color: "#000",
                    borderRadius: "50px",
                    width: "30px",
                    height: "20px",
                    fontSize: "12px"
                }}>0</div>
        </div>
    )
}
export default Cart;