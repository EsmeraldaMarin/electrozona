import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Asegúrate de importar correctamente tu configuración de Firebase
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./ProductManager.scss";
import PriceFormatter from "../formatters/PriceFormatter"
import CircleLoader from "../loader/CircleLoader";
import { Link } from "react-router-dom";

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const querySnapshot = await getDocs(collection(db, "Productos"));
            setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        const fetchCategories = async () => {
            const querySnapshot = await getDocs(collection(db, "Categorias"));
            setCategories(querySnapshot.docs.map(doc => doc.data().nombre));
        };

        fetchProducts();
        fetchCategories();
    }, []);


    return (
        <div className="product-manager" >
            <h1>Gestión de Productos</h1>
            <div className="d-flex align-items-center justify-content-end filtrar-por-categoria">
                <label>Filtrar por Categoría: </label>
                <select className="form-select" aria-label="Default select example" onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option selected value="">Todas</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="table-ctn" style={{ maxWidth: "100vw", overflowX: "auto" }}>

                <table className="product-table table table-striped">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Código</th>
                            <th>Categoría</th>
                            <th className="desktop-only">Descripción</th>
                            <th className="desktop-only">Características</th>
                            <th className="desktop-only">Activo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.filter(p => !selectedCategory || p.categoria === selectedCategory).map((product) => (
                            <tr key={product.id}>
                                <td><img 
                                src={product.imagen.length === 0? "https://res.cloudinary.com/doxk1g21n/image/upload/v1740078849/jtpmidb08nhsz1ew8ozg.png"
                                    : product.imagen[0]
                                } 
                                alt="imagen"/></td>
                                <td>{product.nombre}</td>
                                <td className="fw-bold"> <PriceFormatter valor={product.precio}></PriceFormatter></td>
                                <td>{product.cantidad}</td>
                                <td>{product.codigo}</td>
                                <td>{product.categoria}</td>
                                <td className="desktop-only">{product.descripcion.length > 35
                                    ? `${product.descripcion.slice(0, 35)}...`
                                    : product.descripcion}
                                </td>
                                <td className="desktop-only">{product.caracteristicas.length > 35
                                    ? `${product.caracteristicas.slice(0, 35)}...`
                                    : product.caracteristicas}
                                </td>
                                <td className="desktop-only">{product.activo ? "Sí" : "No"}</td>
                                <td>
                                    <Link to={`/electrozona/admin/product/${product.id}`} className="btn btn-primary d-flex text-white">Editar <i className="ms-1 bi bi-pencil"></i></Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <CircleLoader texto={"Cargando productos..."}></CircleLoader>}

            </div>
        </div >
    );
};

export default ProductManager;
