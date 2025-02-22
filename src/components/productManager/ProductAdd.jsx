import React, { useState, useEffect, useRef } from "react";
import { doc, addDoc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import axios from 'axios';

const ProductAdd = () => {
    const [newValues, setNewValues] = useState({
        nombre: "",
        cantidad: "",
        imagen: [],
        descripcion: "",
        caracteristicas: "",
        categoria: "",
        precio: "",
        codigo: "",
        activo: true
    });
    const [showModal, setShowModal] = useState(false);
    const [cargandoImagen, setCargandoImagen] = useState(false);
    const [subiendoProducto, setSubiendoProducto] = useState(false);
    const [allCategorias, setAllCategorias] = useState([]);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchAllCategorias = async () => {
            const querySnapshot = await getDocs(collection(db, "Categorias"));
            setAllCategorias(querySnapshot.docs.map(doc => doc.data().nombre));
        };
        fetchAllCategorias();
    }, []);

    const handleInputChange = (field, value) => {
        setNewValues(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveProduct = async () => {
        // Validaciones
        if (!newValues.nombre.trim()) {
            alert("El campo Nombre es obligatorio.");
            return;
        }
        if (!newValues.precio.trim() || isNaN(newValues.precio) || Number(newValues.precio) <= 0) {
            alert("El precio debe ser un número positivo válido.");
            return;
        }
        if (!newValues.categoria.trim()) {
            alert("El campo Categoría es obligatorio.");
            return;
        }
        if (!newValues.cantidad.trim() || isNaN(newValues.cantidad) || !Number.isInteger(Number(newValues.cantidad)) || Number(newValues.cantidad) < 0) {
            alert("El Stock debe ser un número entero positivo.");
            return;
        }

        setSubiendoProducto(true);

        try {
            const productRef = collection(db, "Productos");
            await addDoc(productRef, newValues);
            setShowModal(true)

            // Limpiar formulario
            setNewValues({
                nombre: "",
                cantidad: "",
                imagen: [],
                descripcion: "",
                caracteristicas: "",
                categoria: "",
                precio: "",
                codigo: "",
                activo: true
            });

        } catch (error) {
            console.error("Error al guardar el producto: ", error);
            alert("Hubo un error al guardar el producto.");
        } finally {
            setSubiendoProducto(false);
        }
    };


    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setCargandoImagen(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "electrozona");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/doxk1g21n/image/upload",
                formData
            );
            const imageUrl = response.data.secure_url;

            setNewValues(prev => ({
                ...prev,
                imagen: [...prev.imagen, imageUrl]
            }));

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error al subir la imagen: ", error);
        } finally {
            setCargandoImagen(false);
        }
    };

    const handleDeleteImage = (index) => {
        setNewValues(prev => ({
            ...prev,
            imagen: prev.imagen.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="d-flex flex-column product-add">
            <div className="buttons-ctn">
                <Link to={'/admin'} className="btn-volver btn btn-secondary text-white">{`<`} Volver</Link>
                <h3>Nuevo Producto</h3>
                {subiendoProducto ?
                    <button className="btn-add only-desktop" disabled>
                        Agregando... <i className="ms-2 bi bi-check"></i>
                    </button>
                    : <button className="btn-add only-desktop" onClick={handleSaveProduct}>
                        Agregar Producto <i className="ms-2 bi bi-check"></i>
                    </button>}

            </div>
            <div className="product-detail admin text-start">
                <div className="product-detail-principal mb-3">
                    <p className="p-0">Nombre del producto</p>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={newValues.nombre}
                            disabled={subiendoProducto}
                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                        />
                    </div>
                    <p className="p-0">Descripción breve</p>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={newValues.descripcion}
                            disabled={subiendoProducto}
                            onChange={(e) => handleInputChange("descripcion", e.target.value)}
                        />
                    </div>
                    <p className='p-0'>Imágenes</p>
                    <div className="imagenes-ctn">
                        {newValues?.imagen?.map((imagen, index) => (
                            <div key={index} className="p-2 d-flex flex-column align-items-end" style={{ boxShadow: "0 0 10px #ddd" }}>
                                <button
                                    type="button"
                                    className="btn-close mb-2"
                                    aria-label="Close"
                                    onClick={() => handleDeleteImage(index)}
                                ></button>
                                <img
                                    src={imagen}
                                    alt={newValues.nombre}
                                    style={{ maxHeight: "200px", minHeight: "200px", objectFit: "contain" }}
                                    className="d-block w-100"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="input-group mt-4">
                        <input type="file"
                            ref={fileInputRef}
                            className="form-control"
                            onChange={handleImageUpload}
                            disabled={cargandoImagen || subiendoProducto}
                        />
                        {cargandoImagen && <span className="py-2 px-3 bg-secondary text-white">Subiendo...</span>}
                    </div>
                </div>
                <div className='product-detail-data'>

                    <p className="p-0">Código</p>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={newValues.codigo}
                            disabled={subiendoProducto}
                            onChange={(e) => handleInputChange("codigo", e.target.value)}
                        />
                    </div>

                    <div className="contenedor-precio-stock">
                        <div>
                            <p className="p-0">Precio</p>
                            <div className="input-group mb-3">
                                <span className="input-group-text">$</span>
                                <input
                                    type="text"
                                    className="form-control fs-5"
                                    value={newValues.precio}
                                    disabled={subiendoProducto}
                                    onChange={(e) => handleInputChange("precio", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <p className="p-0">Stock</p>
                            <div className="input-group mb-3">
                                <input
                                    type="number"
                                    className="form-control fs-5"
                                    value={newValues.cantidad}
                                    disabled={subiendoProducto}
                                    onChange={(e) => handleInputChange("cantidad", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <p className="p-0">Categoría</p>
                    <div className="input-group">
                        <select
                            className="form-select"
                            name="categoria"
                            value={newValues.categoria}
                            disabled={subiendoProducto}
                            onChange={(e) => handleInputChange("categoria", e.target.value)}
                        >
                            <option value="">Selecciona una categoría</option>
                            {allCategorias?.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <p className="p-0 mt-4">Características del producto</p>
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            value={newValues.caracteristicas}
                            onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                            style={{ height: "150px" }}
                            disabled={subiendoProducto}
                        ></textarea>
                    </div>
                </div>
            </div>
            {subiendoProducto ?
                <button className="btn-add only-mobile" disabled>
                    Agregando... <i className="ms-2 bi bi-check"></i>
                </button>
                : <button className="btn-add only-mobile" onClick={handleSaveProduct}>
                    Agregar Producto <i className="ms-2 bi bi-check"></i>
                </button>}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header  bg-success text-white">
                                    <h5 className="modal-title">¡Producto Agregado!</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fondo opaco */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default ProductAdd;
