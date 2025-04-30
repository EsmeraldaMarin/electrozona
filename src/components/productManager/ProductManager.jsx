import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; // Asegúrate de importar correctamente tu configuración de Firebase
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import "./ProductManager.scss";
import PriceFormatter from "../formatters/PriceFormatter"
import CircleLoader from "../loader/CircleLoader";
import { Link } from "react-router-dom";
import FiltersCtn from "./FiltersCtn";
import NewCategory from "./MyCategories";

const ProductManager = () => {
    const [allProductos, setAllProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [allCategorias, setAllCategorias] = useState([]);
    const [cargandoCambioEstado, setCargandoCambioEstado] = useState(false);
    const [filters, setFilters] = useState({
        nombre: "",
        codigo: "",
        precioMin: "",
        precioMax: "",
        categoria: "",
        estado: "",
        allCategorias: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedProducts = [...productosFiltrados].sort((a, b) => {
            if (key === "precio") {
                return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
            } else {
                return direction === "asc"
                    ? a[key].toString().localeCompare(b[key].toString())
                    : b[key].toString().localeCompare(a[key].toString());
            }
        });

        setProductosFiltrados(sortedProducts);
    };
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

    const toggleProductStatus = async (productId, currentStatus) => {
        try {
            setCargandoCambioEstado(true)
            const productRef = doc(db, "Productos", productId);
            await updateDoc(productRef, { activo: !currentStatus });
            fetchAllProductos();
            setCargandoCambioEstado(false)
        } catch (error) {
            console.error("Error al cambiar el estado del producto:", error);
        }
    };

    //DELETE PRODUCT
    const handleShowModal = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            await deleteDoc(doc(db, "Productos", selectedProduct.id));
            fetchAllProductos()
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }

        handleCloseModal();
    };

    return (
        <div className="product-manager" >
            <div className="buttons-ctn">
                <NewCategory></NewCategory>
                <Link to='/admin/newProduct' className="btn-add">Agregar Producto <i className="ms-2 bi bi-plus-lg"></i></Link>
            </div>
            <h1 className="mt-4">Gestión de Productos</h1>
            <FiltersCtn allCategorias={allCategorias} filters={filters} setFilters={setFilters} />
            <div className="table-ctn" style={{ maxWidth: "100vw", overflowX: "auto" }}>

                <table className="product-table table table-striped">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("nombre")}>Nombre ⬍</th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("precio")}>Precio ⬍</th>
                            <th>Stock</th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("codigo")}>Código ⬍</th>
                            <th style={{ cursor: "pointer" }} onClick={() => handleSort("categoria")}>Categoría ⬍</th>
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
                                <td className="btn-ctn">
                                    <div className="d-flex">
                                        <Link to={`/admin/product/${product.id}`} className="btn btn-primary d-flex text-white"><span className="desktop_disabled">Editar</span> <i className="ms-1 bi bi-pencil"></i></Link>
                                        {
                                            product.activo ?
                                                <button
                                                    className="btn mx-2 text-white"
                                                    style={{ backgroundColor: "#d06100" }}
                                                    onClick={() => toggleProductStatus(product.id, product.activo)}
                                                    disabled={cargandoCambioEstado}
                                                ><span className="desktop_disabled">Desactivar</span> <i className="bi bi-arrow-down"></i> </button>
                                                :
                                                <button
                                                    className="btn btn-success mx-2 text-white"
                                                    onClick={() => toggleProductStatus(product.id, product.activo)}
                                                    disabled={cargandoCambioEstado}

                                                ><span className="desktop_disabled">Activar</span><i className="bi bi-arrow-up"></i> </button>
                                        }
                                        <button className="btn btn-danger text-white" style={{ width: "fit-content", minWidth: "fit-content" }} onClick={() => handleShowModal(product)}><i className="bi bi-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                {(productosFiltrados.length === 0 && allProductos.length !== 0) &&
                    <p className="my-5">No hay productos para mostrar</p>}
                {allProductos.length === 0 && <CircleLoader texto={"Cargando productos..."}></CircleLoader>}

            </div>
            {/* Modal de Confirmación */}
            <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar eliminación</h5>
                            <button type="button" className="close" onClick={handleCloseModal}>
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este producto?</p>
                            <p><strong>Esta acción es irreversible.</strong></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                            <button type="button" className="btn btn-danger" onClick={handleDeleteProduct}>Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductManager;
