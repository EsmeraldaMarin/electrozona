import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './MyCategories.scss';

const MyCategories = () => {
    const [modalAbierto, setModalAbierto] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [allCategorias, setAllCategorias] = useState([]);
    const [cargandoCategoria, setCargandoCategoria] = useState(false)


    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => {
        setNuevaCategoria('');
        setModalAbierto(false);
    };
    const fetchAllCategorias = async () => {
        const querySnapshot = await getDocs(collection(db, "Categorias"));
        setAllCategorias(querySnapshot.docs.map(doc => doc.data()));
    };

    const manejarAceptar = async () => {
        setCargandoCategoria(true)
        const nombre = nuevaCategoria.trim();
        if (nombre === '') {
            alert("El nombre no puede estar vacío");
            return;
        }

        try {
            await addDoc(collection(db, 'Categorias'), { nombre });
            cerrarModal();
            fetchAllCategorias();

        } catch (error) {
            console.error("Error al agregar categoría:", error);
            alert("Hubo un error al guardar la categoría.");
        }
        finally {
            setCargandoCategoria(false)
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

                        <div className='add-category d-flex align-items-center'>
                            <h5 className='text-start me-4'>Agregar Categoría:</h5>
                            <input
                                type="text"
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                placeholder="Nombre de la categoría"
                            />
                            <div className="modal-buttons ms-2">
                                <button disabled={cargandoCategoria} className='btn rounded-0 btn-success' onClick={manejarAceptar}>Aceptar</button>
                                <button disabled={cargandoCategoria} className='btn rounded-0 btn-secondary' onClick={cerrarModal}>Cancelar</button>
                            </div>
                        </div>
                        <div className='my-categories mt-5'>
                            <h5 className='text-start me-4'>Mis Categorías</h5>
                            <div className='d-flex flex-wrap gap-2'>
                                {allCategorias.map(category =>
                                    <div key={category.id} className='categoria'>
                                        {category.nombre}
                                        <button className='btn btn-danger ms-2 rounded-0' onClick={() => { alert("Funcionalidad en desarrollo") }}><i className='bi bi-trash'></i></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCategories;
