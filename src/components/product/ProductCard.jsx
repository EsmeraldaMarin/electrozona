// ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${product.id}`);
        window.scrollTo(0, 0);
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };
    return (
        <div className="card mb-2 p-2" onClick={handleClick} id={product.id} style={{ maxWidth: "228px" }}>
            <img src={product.imagen[0]} className="card-img-top" alt={product.nombre} style={{ minHeight: '168px', maxHeight: '168px', objectFit: 'contain' }} />
            <div className="card-body">
                <h5 className="card-title fs-6 fw-bolder text-wrap" style={{ fontFamily: "Kanit, sans-serif" }}>{product.nombre}</h5>
                <p className="card-text fw-bold">{formatPrice(product.precio)}</p>
            </div>
            <button type="button" className="btn btn-dark" style={{ fontSize: '10px', width: '100%' }}>AGREGAR AL CARRITO</button>
        </div>
    );
};

export default ProductCard;