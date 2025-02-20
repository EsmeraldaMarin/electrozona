import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import SkeletonLoader from "../loader/SkeletonLoader";
import { Link } from "react-router-dom";
import axios from 'axios';

const ProductEdit = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [editingField, setEditingField] = useState(null);
    const [updatedValues, setUpdatedValues] = useState({});
    const [cargando, setCargando] = useState(false)
    const fileInputRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [imageIndex, setImageIndex] = useState(null);

    const getProductById = async (productId) => {
        try {
            const docRef = doc(db, "Productos", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                console.log("No se encontró el producto");
                return null;
            }
        } catch (e) {
            console.error("Error al obtener el producto: ", e);
            return null;
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const handleModifyClick = (field) => {
        setEditingField(field); // Habilita solo un campo a la vez
        setUpdatedValues({ ...updatedValues, [field]: product[field] }); // Mantiene el valor actual
    };

    const handleInputChange = (field, value) => {
        if (editingField !== field) setEditingField(field);
        setUpdatedValues({ ...updatedValues, [field]: value });
    };

    const handleSave = async (field) => {
        if (!updatedValues[field]) return;

        try {
            setCargando(true)
            const docRef = doc(db, "Productos", id);
            await updateDoc(docRef, { [field]: updatedValues[field] });

            // Actualizar el estado local con el nuevo valor
            setProduct({ ...product, [field]: updatedValues[field] });

            // Deshabilitar el campo nuevamente
            setEditingField(null);
            setCargando(false)
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    const handleImageUpload = async () => {
        const file = updatedValues["imagen"];
        if (!file) return;

        setCargando(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "electrozona");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/doxk1g21n/image/upload",
                formData
            );
            const imageUrl = response.data.secure_url;

            const docRef = doc(db, "Productos", id);
            await updateDoc(docRef, { imagen: [...(product.imagen || []), imageUrl] });

            setProduct((prev) => ({ ...prev, imagen: [...prev.imagen, imageUrl] }));
            setEditingField(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Error al subir la imagen: ", error);
        } finally {
            setCargando(false);
        }
    };

    const handleOpenModal = (imagen, index) => {
        setImageToDelete(imagen);
        setImageIndex(index);
        setShowModal(true);
    };


    const handleDeleteImage = async () => {
        if (imageIndex === null) return;
        setCargando(true)
        try {
            const updatedImages = product.imagen.filter((_, i) => i !== imageIndex);
            const docRef = doc(db, "Productos", id);
            await updateDoc(docRef, { imagen: updatedImages });

            setProduct((prev) => ({ ...prev, imagen: updatedImages }));
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
        } finally {
            setShowModal(false); // Cierra el modal después de eliminar
            setCargando(false)
        }
    };


    if (!product)
        return (
            <div className="p-4 mt-1">
                <SkeletonLoader height={"700px"} />
            </div>
        );

    return (
        <div className="d-flex flex-column product-edit align-items-start">
            <Link to={'/electrozona/admin'} className="btn-volver btn btn-secondary text-white">{`<`} Volver</Link>
            <div className="product-detail admin text-start">
                {/* <Link to="/electrozona/admin" className="btn btn-secondary">Volver</Link>*/}
                <div className="product-detail-principal mb-3">
                    <p className="p-0">Nombre del producto</p>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={editingField === "nombre" ? updatedValues.nombre : product.nombre}
                            disabled={editingField !== "nombre"}
                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                        />
                        {editingField === "nombre" && <button className="btn btn-outline-secondary" onClick={() => setEditingField(null)}><i className="bi bi-x-lg"></i></button>}

                        {editingField === "nombre" ? (
                            <button className="btn btn-success" disabled={cargando} onClick={() => handleSave("nombre")}>
                                {cargando ? "Guardando..." : "Guardar"}
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => handleModifyClick("nombre")}>
                                Modificar
                            </button>
                        )}
                    </div>

                    <p className='p-0'>Imágenes</p>
                    <div className="imagenes-ctn">
                        {product?.imagen?.map((imagen, index) => (
                            <div key={index} className="p-2 d-flex flex-column align-items-end" style={{ boxShadow: "0 0 10px #ddd" }}>
                                <button
                                    type="button"
                                    className="btn-close mb-2"
                                    aria-label="Close"
                                    onClick={() => handleOpenModal(imagen, index)}
                                ></button>
                                <img
                                    src={imagen}
                                    alt={product.nombre}
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
                            onChange={(e) => {
                                setEditingField("imagen");
                                handleInputChange("imagen", e.target.files[0])
                            }
                            } />
                        {editingField === "imagen" && <button className="btn btn-outline-secondary" onClick={(e) => { setEditingField(null) }}><i className="bi bi-x-lg"></i></button>}

                        {editingField === "imagen" ?
                            <button
                                className="btn btn-outline-success"
                                disabled={cargando}
                                onClick={(e) => {
                                    handleImageUpload()
                                    e.target.value = ""
                                }}>{cargando ? "Subiendo..." : "Subir Imagen"}</button>
                            :
                            <button className="btn btn-secondary"></button>
                        }
                    </div>
                </div>
                <div className='product-detail-data'>
                    <p className="p-0">Descripción</p>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={editingField === "descripcion" ? updatedValues.descripcion : product.descripcion}
                            disabled={editingField !== "descripcion"}
                            onChange={(e) => handleInputChange("descripcion", e.target.value)}
                        />
                        {editingField === "descripcion" && <button className="btn btn-outline-secondary" onClick={() => setEditingField(null)}><i className="bi bi-x-lg"></i></button>}

                        {editingField === "descripcion" ? (
                            <button className="btn btn-success" disabled={cargando} onClick={() => handleSave("descripcion")}>
                                {cargando ? "Guardando..." : "Guardar"}
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => handleModifyClick("descripcion")}>
                                Modificar
                            </button>
                        )}
                    </div>

                    <div className="contenedor-precio-stock">
                        <div className="">
                            <p className="p-0">Precio</p>
                            <div className="input-group mb-3">
                                <span className="input-group-text">$</span>
                                <input
                                    type="text"
                                    className="form-control fs-5"
                                    value={editingField === "precio" ? updatedValues.precio : product.precio}
                                    disabled={editingField !== "precio"}
                                    onChange={(e) => handleInputChange("precio", e.target.value)}
                                />
                                {editingField === "precio" && <button className="btn btn-outline-secondary" onClick={() => setEditingField(null)}><i className="bi bi-x-lg"></i></button>}

                                {editingField === "precio" ? (
                                    <button className="btn btn-success" disabled={cargando} onClick={() => handleSave("precio")}>
                                        {cargando ? "Guardando..." : "Guardar"}
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary" onClick={() => handleModifyClick("precio")}>
                                        Modificar
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="">
                            <p className="p-0">Stock</p>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control fs-5"
                                    value={editingField === "cantidad" ? updatedValues.cantidad : product.cantidad}
                                    disabled={editingField !== "cantidad"}
                                    onChange={(e) => handleInputChange("cantidad", e.target.value)}
                                />
                                {editingField === "cantidad" && <button className="btn btn-outline-secondary" onClick={() => setEditingField(null)}><i className="bi bi-x-lg"></i></button>}

                                {editingField === "cantidad" ? (
                                    <button className="btn btn-success" disabled={cargando} onClick={() => handleSave("cantidad")}>
                                        {cargando ? "Guardando..." : "Guardar"}
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary" onClick={() => handleModifyClick("cantidad")}>
                                        Modificar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <p className="p-0">Características del producto</p>
                    <div className="input-group">
                        <textarea
                            className="form-control"
                            value={editingField === "caracteristicas" ? updatedValues.caracteristicas : product.caracteristicas}
                            disabled={editingField !== "caracteristicas"}
                            onChange={(e) => handleInputChange("caracteristicas", e.target.value)}
                            style={{ height: "150px" }}
                        ></textarea>
                        {editingField === "caracteristicas" && <button className="btn btn-outline-secondary" onClick={() => setEditingField(null)}><i className="bi bi-x-lg"></i></button>}
                        {editingField === "caracteristicas" ? (
                            <button className="btn btn-success" disabled={cargando} onClick={() => handleSave("caracteristicas")}>
                                {cargando ? "Guardando..." : "Guardar"}
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={() => handleModifyClick("caracteristicas")}>
                                Modificar
                            </button>
                        )}
                    </div>
                </div>




                {/* MODAL */}
                {showModal && (
                    <>
                        <div className="modal fade show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirmar eliminación</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>¿Estás seguro de que deseas eliminar esta imagen?</p>
                                        {imageToDelete && <img src={imageToDelete} alt="Imagen a eliminar" className="img-fluid" style={{ width: "250px", objectFit: "contain" }} />}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                            Cancelar
                                        </button>
                                        <button type="button" className="btn btn-danger" disabled={cargando} onClick={handleDeleteImage}>
                                            {cargando ? "Eliminando... " : "Eliminar"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fondo opaco */}
                        <div className="modal-backdrop fade show"></div>
                    </>
                )}


            </div>
        </div>
    );
};

export default ProductEdit;
