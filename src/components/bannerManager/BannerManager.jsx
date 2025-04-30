import React, { useState, useEffect, useRef } from 'react';
import './BannerManager.scss';
import Carrousel from '../carrousel/Carrousel';
import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import axios from 'axios';

const BannerManager = () => {
    const [oculto, setOculto] = useState(false);
    const [cargandoImagen, setCargandoImagen] = useState(false);
    const [cargandoNuevoOrden, setCargandoNuevoOrden] = useState(false);
    const [banners, setBanners] = useState([]);
    const fileInputRef = useRef(null);

    const fetchBanners = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Banner"));
            const bannersFromBD = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            const bannersSorted = bannersFromBD.sort((a, b) => Number(a.orden) - Number(b.orden));
            setBanners(bannersSorted);
        } catch (error) {
            console.error("Error al obtener banners:", error);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

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

            // Asignar un orden automático
            const newBanner = {
                url: imageUrl,
                orden: banners.length + 1
            };

            await addDoc(collection(db, "Banner"), newBanner);
            fetchBanners(); // Refrescar lista

        } catch (error) {
            console.error("Error al subir la imagen: ", error);
        } finally {
            setCargandoImagen(false);
            if (fileInputRef.current) fileInputRef.current.value = null;
        }
    };

    const handleDeleteImage = async (id) => {
        const confirm = window.confirm("¿Estás seguro de eliminar esta imagen del banner?");
        if (!confirm) return;

        try {
            await deleteDoc(doc(db, "Banner", id));
            fetchBanners();
        } catch (error) {
            console.error("Error al eliminar imagen: ", error);
        }
    };


    const intercambiarOrden = async (bannerActual, direccion) => {
        setCargandoNuevoOrden(true)
        const ordenActual = bannerActual.orden;
        const ordenDestino = ordenActual + (direccion === "derecha" ? 1 : -1);

        if (ordenDestino < 1) {
            setCargandoNuevoOrden(false);
            return
        };

        try {
            const q = query(collection(db, "Banner"), where("orden", "==", ordenDestino));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docDestino = querySnapshot.docs[0];

                const refActual = doc(db, "Banner", bannerActual.id);
                const refDestino = doc(db, "Banner", docDestino.id);

                await Promise.all([
                    updateDoc(refActual, { orden: ordenDestino }),
                    updateDoc(refDestino, { orden: ordenActual })
                ]);

                await fetchBanners(); // ✅ ACTUALIZÁ LA UI
            }
        } catch (error) {
            console.error("Error al intercambiar orden:", error);
        } finally {
            setCargandoNuevoOrden(false);
        }
    };


    return (
        <div className="banner_manager">
            {!oculto ? (
                <div className="ocultar_previsualizacion">
                    <div className="overlay" onClick={() => setOculto(true)}>
                        <span>Ocultar previsualización</span>
                    </div>
                    <Carrousel />
                </div>
            ) : (
                <button className="mostrar_btn" onClick={() => setOculto(false)}>
                    Mostrar previsualización
                </button>
            )}

            <div className='mt-5 banner_details'>
                <h3 className='text-start'>Agregar nuevo banner</h3>
                <div className="input-group mt-3 input-new-banner">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="form-control "
                        onChange={handleImageUpload}
                        disabled={cargandoImagen}
                    />
                    {cargandoImagen && <span className="py-2 px-3 bg-secondary text-white">Subiendo...</span>}
                </div>

                <h4 className="mt-5 text-start">Banners actuales</h4>
                <div className="imagenes-ctn d-flex flex-wrap gap-3 mt-3">
                    {banners.map((banner, index) => (
                        <div key={banner.id} className="banner-item card p-2" >
                            <div className='d-flex mb-2 justify-content-between align-items-center'>
                                <p className='py-1 px-3 rounded m-0' style={{ backgroundColor: "#000", color: "#fff" }}>{banner.orden}</p>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteImage(banner.id)}>
                                    <i className='bi bi-trash'></i>
                                </button>
                            </div>
                            <img src={banner.url} alt={`banner-${index}`} className="banner-img" style={{ minHeight: '170px', maxHeight: '170px' }} />
                            <div className='d-flex gap-2'>
                                <button
                                    value={banner.orden}
                                    onClick={() => intercambiarOrden(banner, "izquierda")}
                                    className="form-control my-2"
                                    disabled={cargandoNuevoOrden}
                                >{`<`}</button>
                                <button
                                    value={banner.orden}
                                    onClick={() => intercambiarOrden(banner, "derecha")}
                                    className="form-control my-2"
                                    disabled={cargandoNuevoOrden}
                                >{`>`}</button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BannerManager;
