// ProductContainer.js
import React from 'react';
import FilterAndSort from '../filter/FilterAndSort';
import ProductCard from './ProductCard';

const ProductContainer = () => {
    const productosEjemplo = [
        {
            "id": 1,
            "name": "Auriculares Bluetooth",
            "description": "Auriculares inalámbricos con sonido envolvente y cancelación de ruido.",
            "price": 15000,
            "image": "https://acdn.mitiendanube.com/stores/001/827/432/products/wireless-5-3-242936fc6531af3c0417119866905367-1024-1024.png"
        },
        {
            "id": 2,
            "name": "Cargador Rápido USB-C",
            "description": "Cargador rápido compatible con dispositivos Android y iOS.",
            "price": 2500,
            "image": "https://http2.mlstatic.com/D_NQ_NP_971539-MLA75699668616_042024-O.webp"
        },
        {
            "id": 3,
            "name": "Funda Protectora para Celular",
            "description": "Funda resistente a impactos con diseño elegante.",
            "price": 6000,
            "image": "https://acdn.mitiendanube.com/stores/078/254/products/e0c35c68-f790-47c6-96fa-f901e4a4b1bf-22e3cfbb6b4b35fdc516632777463001-1024-1024.jpeg"
        },
        {
            "id": 4,
            "name": "Celular Android",
            "description": "Smartphone con pantalla HD y batería de larga duración.",
            "price": 800000,
            "image": "https://pardohogar.vtexassets.com/arquivos/ids/185932/Celular-Samsung-Galaxy-A23-5G-128GB-50MP-Negro-1.jpg?v=638132074354770000"
        }
    ]
    return (
        <div className="" >
            <FilterAndSort></FilterAndSort>
            <div className="contenedor d-flex flex-wrap justify-content-evenly">
                {productosEjemplo.map(product =>
                    <ProductCard key={product.id} product={product}></ProductCard>
                )}
            </div>
        </div>
    );
};

export default ProductContainer;