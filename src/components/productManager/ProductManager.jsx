import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Asegúrate de importar correctamente tu configuración de Firebase
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import "./ProductManager.scss";
import PriceFormatter from "../formatters/PriceFormatter"
import CircleLoader from "../loader/CircleLoader";
import { Link } from "react-router-dom";
import FiltersCtn from "./FiltersCtn";

const ProductManager = () => {
    const [allProductos, setAllProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [allCategorias, setAllCategorias] = useState([]);
    const [filters, setFilters] = useState({
        nombre: "",
        codigo: "",
        precioMin: "",
        precioMax: "",
        categoria: "",
        estado: "",
        allCategorias: [],
    });

    const fetchAllProductos = async () => {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        setAllProductos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setProductosFiltrados(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    };

    const fetchAllCategorias = async () => {
        const querySnapshot = await getDocs(collection(db, "Categorias"));
        setAllCategorias(querySnapshot.docs.map(doc => doc.data().nombre));
    };

    useEffect(() => {
        fetchAllProductos();
        fetchAllCategorias();
    }, []);

    useEffect(() => {
        let resultadoDelFiltro = allProductos.filter(producto => {
            return (
                (!filters.nombre || producto.nombre.toLowerCase().includes(filters.nombre.toLowerCase())) &&
                (!filters.codigo || producto.codigo.includes(filters.codigo)) &&
                (!filters.precioMin || producto.precio >= Number(filters.precioMin)) &&
                (!filters.precioMax || producto.precio <= Number(filters.precioMax)) &&
                (!filters.categoria || producto.categoria === filters.categoria) &&
                (!filters.estado || producto.activo === (filters.estado === "true"))
            );
        });

        setProductosFiltrados(resultadoDelFiltro);
    }, [filters, allProductos]);

    return (
        <div className="product-manager" >
            <div className="buttons-ctn">
                <i></i>
                {/*<button className="btn-add">Agregar Descuento <i className="ms-2 bi bi-tags"></i></button>*/}
                <Link to='/admin/newProduct' className="btn-add">Agregar Producto <i className="ms-2 bi bi-plus-lg"></i></Link>
            </div>
            <h1>Gestión de Productos</h1>
            <FiltersCtn allCategorias={allCategorias} filters={filters} setFilters={setFilters} />
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
                        {productosFiltrados?.map((product) => (
                            <tr key={product.id}>
                                <td><img
                                    src={product.imagen.length === 0 ? "https://res.cloudinary.com/doxk1g21n/image/upload/v1740078849/jtpmidb08nhsz1ew8ozg.png"
                                        : product.imagen[0]
                                    }
                                    alt="imagen" /></td>
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
                                    <Link to={`/admin/product/${product.id}`} className="btn btn-primary d-flex text-white">Editar <i className="ms-1 bi bi-pencil"></i></Link>

                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                {(productosFiltrados.length === 0 && allProductos.length !== 0) &&
                    <p className="my-5">No hay productos para mostrar</p>}
                {allProductos.length === 0 && <CircleLoader texto={"Cargando productos..."}></CircleLoader>}

            </div>
        </div >
    );
};

export default ProductManager;
