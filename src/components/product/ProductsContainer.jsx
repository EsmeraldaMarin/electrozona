import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { collection, query, orderBy, limit, startAfter, getDocs, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Categories from '../filter/Categories';
import SkeletonLoader from '../loader/SkeletonLoader';
import { Link, useParams } from 'react-router-dom';
import "./Product.scss"
import ProductSection from './ProductsSection';

const ProductContainer = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const categoria = id;
    const productsPerPage = 20;

    // Función para cargar productos
    const fetchProducts = async (isNextPage = false) => {
        setLoading(true);
        try {
            const productCollection = collection(db, "Productos");
            let productQuery;

            if (categoria) {
                productQuery = query(
                    productCollection,
                    where("categoria", "==", categoria),
                    orderBy("precio"), // Ordenamos por precio
                    //limit(productsPerPage)
                );
            }
            else {
                productQuery = query(
                    productCollection,
                    orderBy("precio"),
                    //limit(productsPerPage)
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
            const categoryList = querySnapshot.docs.map(doc => doc.data()); // Suponiendo que el campo de nombre de categoría es "name"
            setCategories(categoryList);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    const filtrarProductosPorCategoria = (categoria) => {
        return products.filter(p => p.categoria === categoria);
    }
    // Cargar productos y categorías al montar el componente
    useEffect(() => {

        fetchProducts();
        fetchCategories();
    }, [id]); // Dependemos de la categoría seleccionada para recargar los productos

    return (
        <div className="product-container">
            {(categories && !categoria) ?
                <Categories categorias={categories}></Categories> :
                <div className='my-4 px-3 d-flex justify-content-between align-items-center header-by-category'>
                    <Link to={"/electrozona"} className='btn btn-secondary text-light text-start d-inline-block '>Inicio</Link>
                    <h4 className='m-0'>{categoria}</h4>
                </div>
            }

            {(categories.length > 0 && !categoria) &&
                <ProductSection categories={categories} filtrarProductosPorCategoria={filtrarProductosPorCategoria}></ProductSection>
            }

            {categoria &&
                <div className='product-list-by-category'>
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}</div>}

            <div className="pagination d-flex justify-content-center">
                {hasMore && !loading && (
                    <button onClick={() => fetchProducts(true)} className=' btn btn-secondary'>Cargar más</button>
                )}
                {loading && <div className="skeleton-grid px-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <SkeletonLoader key={index} height={"300px"} />
                    ))}
                </div>}
            </div>
        </div>
    );
};

export default ProductContainer;
