import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig'; // Asegurate de importar tu config de Firebase
import { collection, getDocs } from 'firebase/firestore';
import "./Carrousel.scss";

const Carrousel = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Banner"));
                const bannersFromBD = querySnapshot.docs.map(doc => doc.data()); 
                const bannersSorted = bannersFromBD.sort((a,b)=> Number(a.orden) - Number(b.orden))
                setBanners(bannersSorted);
            } catch (error) {
                console.error("Error al obtener banners:", error);
            }
        };

        fetchBanners();
    }, []);

    return (
        <div id="carousel" className="carousel slide">
            <div className="carousel-indicators mb-1 ">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#carousel"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner" style={{ minHeight: '150px', maxHeight: '160px' }}>
                {console.log(banners)}
                {banners?.map((banner, index) => (
                    <div
                        key={index}
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                        data-bs-interval="3000"
                        
                    >
                        <img src={banner?.url} className="d-block w-100" 
                        /*style={{translate:`0px ${banner.offset}px`}}*/
                        style={{objectFit:"cover"}}
                        alt={`Banner ${index + 1}`} />
                    </div>
                ))}
            </div>
            <button className="carousel-control-prev not_mobile" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next not_mobile" type="button" data-bs-target="#carousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Carrousel;
