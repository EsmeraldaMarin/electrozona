// ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/electrozona/product/${product.id}`);
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };
    return (
        <div className="card mb-2" style={{ width: '170px' }} onClick={handleClick}>
            <img src={product.imagen[0]} className="card-img-top" alt={product.nombre} style={{minHeight:'168px', objectFit: 'cover'}}/>
            <div className="card-body">
                <h5 className="card-title fs-6 fw-bolder" style={{fontFamily:"Kanit, sans-serif"}}>{product.nombre}</h5>
                <p className="card-text fw-bold">{formatPrice(product.precio)}</p>
                <button type="button" className="btn btn-dark" style={{ fontSize: '10px', width:'100%' }}>AGREGAR AL CARRITO</button>
            </div>
        </div>
    );
};

export default ProductCard;