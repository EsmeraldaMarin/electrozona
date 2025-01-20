// ProductCard.js
import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="card mb-2" style={{ width: '170px' }}>
            <img src={product.image} className="card-img-top" alt={product.name} style={{minHeight:'168px', objectFit: 'cover'}}/>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text fw-bold">${product.price}</p>
                <button type="button" className="btn btn-dark" style={{ fontSize: '10px', width:'100%' }}>AGREGAR AL CARRITO</button>
            </div>
        </div>
    );
};

export default ProductCard;