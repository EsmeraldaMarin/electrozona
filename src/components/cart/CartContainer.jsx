import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ListItemOnCart from './ListItemOnCart';
import { UseCart } from './CartContext';
import { Form, Button } from 'react-bootstrap';

const CartContainer = () => {
    const { cart, removeItem, totalAmount, cleanCart } = UseCart();
    const [showCtnDomicilio, setShowCtnDomicilio] = useState(false);
    const [tipoEntrega, setTipoEntrega] = useState('retiro'); // "retiro" o "envio"
    const [domicilio, setDomicilio] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    const handleCompra = () => {
        const telefonoVendedor = "5493825538793";
        const message = cart
            .map(
                (item) =>
                    `> X${item.quantity} ${item.nombre}\nPrecio Unitario: ${formatPrice(item.precio)}\n*Subtotal: ${formatPrice(item.quantity * item.precio)}*\n`
            )
            .join("\n");

        const total = `\n------------------------------\n\n*Total final: ${formatPrice(totalAmount())}*`;
        let entregaInfo = tipoEntrega === "envio" ? `\n *Dirección de entrega:* ${domicilio}` : `\n *Retiro en el local*`;

        const whatsappLink = `https://wa.me/${telefonoVendedor}?text=${encodeURIComponent(
            `_¡Hola, Electro Zona! Quiero realizar la compra de los siguientes productos:_\n\n------------------------------\n\n${message}${total}${entregaInfo}`
        )}`;

        window.open(whatsappLink, "_blank");
    };

    const handleClickCompra = () => {
        setShowCtnDomicilio(true);
    };

    return (
        <>
            <div className='cartContainer mt-4'>
                <p className='py-2 fw-bold fs-2 position-relative' style={{ backgroundColor: "#f0f0f0" }}>
                    <Link to="/#" className='btn rounded bi bi-chevron-left fw-bolder fs-2 p-0 position-absolute top-50 translate-middle-y start-0'></Link>
                    Tu carrito
                </p>
                {cart.length !== 0 ? (
                    <div>
                        <ListItemOnCart cart={cart} removeItem={removeItem} />
                        <div className='totalCtn py-2 px-3 fw-bolder d-flex justify-content-between align-items-center mt-4' style={{ backgroundColor: "#f0f0f0", color: "#000" }}>
                            <span>TOTAL </span>
                            <span className='fs-3'>{formatPrice(totalAmount())}</span>
                        </div>
                        <div className='d-flex justify-content-between px-3 pt-4'>
                            <button className='btn text-decoration-underline' style={{ color: '#CC0101', fontSize: "14px" }} onClick={cleanCart}>Vaciar carrito</button>
                            <button className='btn rounded-0' style={{ backgroundColor: "#000", color: "#fff" }} onClick={handleClickCompra}>INICIAR LA COMPRA</button>
                        </div>
                    </div>
                ) : (
                    <div className='emptyCart'>
                        <p>No hay productos en tu carrito</p>
                        <Link to='/' className='text-decoration-underline'>Ir a Inicio</Link>
                    </div>
                )}

                {showCtnDomicilio && (
                    <div className="mt-4 p-3 modo-entrega" style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
                        <h5>Selecciona el modo de entrega</h5>
                        <Form className='py-4'>
                            <Form.Check 
                                type="radio" 
                                label="Retiro en el local" 
                                name="tipoEntrega"
                                value="retiro"
                                checked={tipoEntrega === "retiro"}
                                onChange={() => setTipoEntrega("retiro")}
                            />
                            <Form.Check 
                                type="radio" 
                                label="Envío a domicilio" 
                                name="tipoEntrega"
                                value="envio"
                                checked={tipoEntrega === "envio"}
                                onChange={() => setTipoEntrega("envio")}
                            />
                            
                            {tipoEntrega === "envio" && (
                                <Form.Group className="mt-3">
                                    <Form.Label>Ingresa tu dirección de entrega:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Ej: San Martín 320, Chilecito, La Rioja"
                                        value={domicilio}
                                        onChange={(e) => setDomicilio(e.target.value)}
                                    />
                                </Form.Group>
                                
                            )}
                            {tipoEntrega === "envio" && (
                                <p className='mt-3 text-start'> <i className='bi bi-info-circle me-2'></i>Costo de envío: luego de solicitar su compra, electrozona le confirmará el costo de envío.</p>
                            )}

                            <Button 
                                className="mt-3 w-100" 
                                style={{ backgroundColor: "#000", color: "#fff" }} 
                                onClick={handleCompra}
                                disabled={tipoEntrega === "envio" && !domicilio.trim()} // Deshabilita si no hay dirección
                            >
                                Confirmar compra  <i className="bi bi-box-arrow-up-right"></i>
                            </Button>
                        </Form>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartContainer;
