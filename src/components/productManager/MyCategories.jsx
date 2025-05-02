import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, setDoc, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import './MyCategories.scss';
import axios from 'axios';


const MyCategories = () => {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', imagen: null });
    const [allCategorias, setAllCategorias] = useState([]);
    const [cargandoCategoria, setCargandoCategoria] = useState(false)
    const [cargandoImagen, setCargandoImagen] = useState(false);
    const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);
    const [categoriaEditada, setCategoriaEditada] = useState({ nombre: '', nuevaImagen: null });
    const [actualizandoCategoria, setActualizandoCategoria] = useState(false);

    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => {
        setNuevaCategoria({});
        setModalAbierto(false);
    };
    const fetchAllCategorias = async () => {
        try {
            const categoryCollection = collection(db, "Categorias");
            const q = query(categoryCollection, orderBy("nombre")); // Ordenar por nombre

            const querySnapshot = await getDocs(q);
            const categoryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setAllCategorias(categoryList);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    const handleAccept = async () => {
        setCargandoCategoria(true);
        const nombre = nuevaCategoria.nombre?.trim();
        const archivo = nuevaCategoria.imagen;

        if (!nombre || nombre === '') {
            alert("El nombre no puede estar vacío");
            setCargandoCategoria(false);
            return;
        }

        if (!archivo) {
            alert("Debe seleccionar una imagen");
            setCargandoCategoria(false);
            return;
        }

        try {
            const urlImagen = await handleImageUpload(archivo);

            await setDoc(doc(db, 'Categorias', nombre), { nombre, imagen: urlImagen });

            fetchAllCategorias();
            setNuevaCategoria({ nombre: '', imagen: null })
        } catch (error) {
            console.error("Error al agregar categoría:", error);
            alert("Hubo un error al guardar la categoría.");
        } finally {
            setCargandoCategoria(false);
        }
    };

    const handleImageUpload = async (file) => {
        setCargandoImagen(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "electrozona");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/doxk1g21n/image/upload",
                formData
            );

            // axios ya devuelve la data directamente
            return response.data.secure_url;

        } catch (error) {
            console.error("Error al subir la imagen: ", error);
            throw new Error("Fallo la subida de la imagen");
        } finally {
            setCargandoImagen(false);
        }
    };

    const handleEditClick = (cat) => {
        setEditandoCategoriaId(cat.id);
        setCategoriaEditada({ nombre: cat.nombre, nuevaImagen: null });
    };

    const handleCancelarEdicion = () => {
        setEditandoCategoriaId(null);
        setCategoriaEditada({ nombre: '', nuevaImagen: null });
    };
    const handleGuardarEdicion = async (cat) => {
        try {
            setActualizandoCategoria(true)
            let nuevaURL = cat.imagen;

            if (categoriaEditada.nuevaImagen) {
                nuevaURL = await handleImageUpload(categoriaEditada.nuevaImagen);
            }

            const categoriaRef = doc(db, 'Categorias', cat.id);
            await updateDoc(categoriaRef, {
                nombre: categoriaEditada.nombre,
                imagen: nuevaURL
            });

            setEditandoCategoriaId(null);
            setCategoriaEditada({ nombre: '', nuevaImagen: null });
            fetchAllCategorias();
        } catch (error) {
            console.error("Error al actualizar categoría:", error);
            alert("No se pudo guardar la edición.");
        } finally {
            setActualizandoCategoria(false)
        }
    };

    useEffect(() => {

        fetchAllCategorias();
    }, []);

    return (
        <div>
            <button className="btn-add me-1" onClick={abrirModal}>
                Agregar Categoría <i className="ms-2 bi bi-tags"></i>
            </button>

            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="btn-close-modal" onClick={cerrarModal}>×</button>

                        <div className='add-category d-flex flex-column'>
                            <h5 className='text-start me-4 mb-3'>Agregar Categoría:</h5>
                            <div className='d-flex inputs-ctn mb-3 gap-3'>
                                <input
                                    type="text"
                                    className='m-0'
                                    value={nuevaCategoria.nombre}
                                    onChange={(e) => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })}
                                    placeholder="Nombre de la categoría"
                                    disabled={cargandoImagen}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className='m-0'
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file.type.startsWith('image/')) {
                                            alert("Solo se permiten archivos de imagen.");
                                            return;
                                        }
                                        setNuevaCategoria({ ...nuevaCategoria, imagen: file });
                                    }}
                                    disabled={cargandoImagen}
                                />

                            </div>
                            <div className="modal-buttons ms-2">
                                <button disabled={cargandoCategoria || cargandoImagen} className='btn rounded-0 btn-success' onClick={handleAccept}>Agregar</button>
                                <button disabled={cargandoCategoria || cargandoImagen} className='btn rounded-0 btn-secondary' onClick={cerrarModal}>Cancelar</button>
                            </div>
                        </div>
                        <div className='mt-5'>
                            <h5 className='text-start me-4'>Mis Categorías</h5>
                            <div className='categories-ctn'>
                                {allCategorias.map(cat => (
                                    <div key={cat.id} className='categoria d-flex align-items-center justify-content-between'>
                                        {editandoCategoriaId === cat.id ? (
                                            <>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nuevaImagen: e.target.files[0] })}
                                                    className='form-control me-2'
                                                    disabled={actualizandoCategoria}
                                                />
                                                <input
                                                    type="text"
                                                    value={categoriaEditada.nombre}
                                                    onChange={(e) => setCategoriaEditada({ ...categoriaEditada, nombre: e.target.value })}
                                                    className='form-control me-2'
                                                    disabled={actualizandoCategoria}
                                                />
                                                <button className='btn btn-success me-2' disabled={actualizandoCategoria} onClick={() => handleGuardarEdicion(cat)}>Guardar</button>
                                                <button className='btn btn-secondary' disabled={actualizandoCategoria} onClick={handleCancelarEdicion}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <div className='d-flex align-items-center'>
                                                    <img src={cat.imagen} alt={cat.nombre} width="60" className='me-3' />
                                                    {cat.nombre}
                                                </div>
                                                <div>
                                                    <button className='btn btn-primary ms-2 rounded-0' onClick={() => handleEditClick(cat)}>
                                                        <i className='bi bi-pencil'></i>
                                                    </button>
                                                    <button className='btn btn-danger ms-2 rounded-0' onClick={() => alert("Funcionalidad en desarrollo")}>
                                                        <i className='bi bi-trash'></i>
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCategories;
