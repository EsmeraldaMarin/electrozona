import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Categories from '../filter/Categories';
import SkeletonLoader from '../loader/SkeletonLoader';

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const productsPerPage = 10;

    // Función para cargar productos
    const fetchProducts = async (isNextPage = false) => {
        setLoading(true);

        try {
            const productCollection = collection(db, "Productos");
            let productQuery;

            // Si hay categoría seleccionada, aplicamos el filtro
            if (selectedCategory) {
                productQuery = query(
                    productCollection,
                    where("categoria", "==", selectedCategory),
                    orderBy("precio"), // Ordenamos por precio
                    limit(productsPerPage)
                );
            } else {
                productQuery = query(
                    productCollection,
                    orderBy("precio"),
                    limit(productsPerPage)
                );
            }
            if (isNextPage && lastVisible) {
                productQuery = query(productQuery, startAfter(lastVisible));
            }

            const querySnapshot = await getDocs(productQuery);

            if (!querySnapshot.empty) {
                const newProducts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts((prev) => (isNextPage ? [...prev, ...newProducts] : newProducts));
                setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
                setHasMore(newProducts.length === productsPerPage);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }

        setLoading(false);
    };

    // Función para cargar las categorías
    const fetchCategories = async () => {
        try {
            const categoryCollection = collection(db, "Categorias");
            const querySnapshot = await getDocs(categoryCollection);
            const categoryList = querySnapshot.docs.map(doc => doc.data().nombre); // Suponiendo que el campo de nombre de categoría es "name"
            setCategories(categoryList);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    // Función para manejar cambios en el filtro por categoría
    const handleCategoryChange = (e) => {
        if (e.target.classList.contains('categoriaActiva')) {
            // si entra aca es porque se hizo click en la categoria activa
            // esto se hace para quitar el filtro de categoria
            setSelectedCategory('');
            return
        }
        setSelectedCategory(e.target.textContent);
    };

    // Cargar productos y categorías al montar el componente
    useEffect(() => {

        fetchProducts();
        fetchCategories();
    }, [selectedCategory]); // Dependemos de la categoría seleccionada para recargar los productos

    return (
        <div className="product-container">
            {categories && <Categories categorias={categories} selectedCategory={selectedCategory} handleCategoryChange={handleCategoryChange}></Categories>}

            <div className="product-list d-flex flex-wrap justify-content-between px-2">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <div className="pagination d-flex justify-content-center">
                {hasMore && !loading && (
                    <button onClick={() => fetchProducts(true)}>Cargar más</button>
                )}
                {loading && <div className="skeleton-grid">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                    ))}
                </div>}
                {!hasMore && <p>No hay más productos.</p>}
            </div>
        </div>
    );
};

export default ProductContainer;
