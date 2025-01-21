import React, { useState, useEffect } from 'react';
import FilterAndSort from '../filter/FilterAndSort';
import ProductCard from './ProductCard';
import { collection, query, orderBy, limit, startAfter, getDocs, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [lastVisible, setLastVisible] = useState(null); // Referencia al último producto visible
    const [hasMore, setHasMore] = useState(true); // Controla si hay más productos para cargar
    const [loading, setLoading] = useState(false);

    const productsPerPage = 10; // Número de productos por página

    // Función para cargar productos
    const fetchProducts = async (isNextPage = false) => {
        setLoading(true);

        try {
            // Crear la consulta
            const productCollection = collection(db, "Productos");
            let productQuery;

            if (isNextPage && lastVisible) {
                productQuery = query(
                    productCollection,
                    orderBy("codigo"), // Cambia el campo de ordenamiento si es necesario
                    startAfter(lastVisible),
                    limit(productsPerPage)
                );
            } else {
                productQuery = query(
                    productCollection,
                    orderBy("codigo"),
                    limit(productsPerPage)
                );
            }

            const querySnapshot = await getDocs(productQuery);

            if (!querySnapshot.empty) {
                const newProducts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setProducts((prev) => (isNextPage ? [...prev, ...newProducts] : newProducts));
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]); // Actualizar la referencia del último producto visible
                setHasMore(newProducts.length === productsPerPage); // Verificar si hay más productos
            } else {
                setHasMore(false); // No hay más productos para cargar
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }

        setLoading(false);
    };

    // Cargar la primera página al montar el componente
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="">
            <FilterAndSort></FilterAndSort>
            <div className="contenedor d-flex flex-wrap justify-content-evenly">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}></ProductCard>
                ))}
            </div>
            <div className="pagination d-flex justify-content-center mt-3">
                {hasMore && !loading && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => fetchProducts(true)}
                    >
                        Cargar más
                    </button>
                )}
                {loading && <p>Cargando...</p>}
                {!hasMore && <p>No hay más productos.</p>}
            </div>
        </div>
    );
};

export default ProductContainer;
