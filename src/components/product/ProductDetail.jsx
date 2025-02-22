import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { UseCart } from '../cart/CartContext';
import SkeletonLoader from '../loader/SkeletonLoader';

const ProductDetail = () => {
    const { id } = useParams(); // Obtiene el id del producto de la URL
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = UseCart();
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(id);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    const getProductById = async (productId) => {
        try {
            // Referencia al documento específico usando el ID del producto
            const docRef = doc(db, "Productos", productId);

            // Obtener el documento
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Si el documento existe, devolver los datos
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                // Si el documento no existe
                console.log("No se encontró el producto");
                return null;
            }
        } catch (e) {
            console.error("Error al obtener el producto: ", e);
            return null;
        }
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addItem(product, quantity);
        setNotification({
            img: product.imagen,
            name: product.nombre,
            quantity,
            price: product.precio * quantity,
        });

        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };


    const handleWhatsapp = () => {
        const message = `¡Hola! Estoy interesado en el producto ${product.nombre}.`;
        const whatsappUrl = `https://wa.me/543825538793?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    if (!product) return <div className='p-4 mt-1'>
        <SkeletonLoader height={"700px"}></SkeletonLoader>
    </div>;

    return (
        <div className="product-detail text-start">
            {/* Notificación */}
            {notification && (
                <Link to='/carrito/#' className="notification position-fixed top-0 end-0 m-3 mt-5 p-3 bg-light shadow rounded" style={{ zIndex: "2000" }}>
                    <p className="m-0"><strong>¡Producto agregado al carrito!</strong></p>
                    <div className='d-flex mt-3'>
                        <img src={notification.img[0]} alt="" style={{ width: "60px", height: "60px", objectFit: "contain" }} />
                        <div className='ms-2'>
                            <p className="m-0">x{notification.quantity}</p>
                            <p className="m-0">{notification.name}</p>
                            <p className="m-0 fw-bold">{formatPrice(notification.price)}</p>
                        </div>
                    </div>
                </Link>
            )}

            <div className='product-detail-principal'>

                <Link to={`/`} className='text-decoration-underline text-black'>INICIO</Link>
                <span className='mx-2'>{`/`}</span>
                <Link to={`/category/${product.categoria}`} className='text-decoration-underline text-black'>{product.categoria}</Link>

                <h2 className='fw-bold fs-4 mt-4'>{product.nombre}</h2>



                <div id="carouselExampleIndicators" className="carousel slide carousel-dark shadow my-3 " data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {/* El primer indicador debe tener la clase 'active' */}
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        {/* Aquí generamos los botones de los indicadores a partir de product.imagen */}
                        {product.imagen.map((imagen, index) => {
                            if (index === 0) return null; // El primer indicador ya está creado
                            return (
                                <button
                                    key={index} // Es importante agregar una key única para cada elemento
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide-to={index}
                                    aria-label={"Slide " + (index + 1)}
                                ></button>
                            );
                        })}
                    </div>

                    <div className="carousel-inner pt-5" style={{ maxHeight: "270px", minHeight: "270px" }}>
                        {/* Solo el primer elemento debe tener la clase 'active' */}
                        {product.imagen.map((imagen, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                <img style={{ maxHeight: "270px", minHeight: "270px", objectFit: "contain" }} src={imagen} className="d-block w-100" alt={product.nombre} />
                            </div>
                        ))}
                    </div>

                    {/* Flechas de navegación */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
                <p className='fs-4 fw-bold'>{product.descripcion}</p>
            </div>
            <div className='product-detail-data'>
                <p className='desc fs-2 fw-bold'>{product.descripcion}</p>
                <p className='fw-bold fs-1'><strong>{formatPrice(product.precio)}</strong></p>
                <div className="quantity-control d-flex align-items-center justify-content-start">
                    <button className="btn rounded-0" onClick={decreaseQuantity} style={{ backgroundColor: '#000', color: '#fff' }}>
                        -
                    </button>
                    <span className="mx-3" style={{ fontSize: '1.3rem', fontFamily: "Outfit, sans-serif" }}>
                        {quantity}
                    </span>
                    <button className="btn rounded-0" onClick={increaseQuantity} style={{ backgroundColor: '#000', color: '#fff' }}>
                        +
                    </button>
                    <button className="ms-3 btn rounded-0" style={{ width: "100%", backgroundColor: '#000', color: '#fff' }} onClick={handleAddToCart}><i className='bi bi-cart'></i> Agregar al carrito</button>
                </div>

                <p className='fs-1 fw-bold my-4' style={{ color: "#505050", lineHeight: "1em" }}>¡Contactate con nosotros para realizar la compra!</p>
                <button className="btn rounded-0 btn-success" onClick={handleWhatsapp}> <i className='bi bi-whatsapp'></i> Contactar por WhatsApp</button>

            </div>

            <div className='product-detail-more'>
                <p className='mt-3'><strong>Características del producto:</strong></p>
                <p>{product.caracteristicas}</p>

                <div className='d-flex flex-column align-items-center p-3' style={{ backgroundColor: "#e0e0e0" }}>
                    <i className='bi bi-truck' style={{ fontSize: "2em" }}></i>
                    <p className='text-uppercase fw-bold m-0'>Enviamos tu compra</p>
                    <p className='m-0'>Entregas a todo el pais</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
