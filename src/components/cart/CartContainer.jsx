import React from 'react'
import { Link } from 'react-router-dom';
import ListItemOnCart from './ListItemOnCart';
import { UseCart } from './CartContext';

const CartContainer = () => {

    const { cart, removeItem, totalAmount, cleanCart } = UseCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };

    const handleCompra = () => {
        const telefonoVendedor = "5493571315193"; // Reemplaza con el número de teléfono del vendedor (código de país incluido).
        const message = cart
            .map(
                (item) =>
                    `> X${item.quantity} ${item.nombre}\nPrecio Unitario: ${formatPrice(item.precio)}\n*Subtotal: ${formatPrice(item.quantity * item.precio)}*\n`
            )
            .join("\n");
        const total = `\n------------------------------\n\n*Total final: ${formatPrice(totalAmount())}*`;
        const whatsappLink = `https://wa.me/${telefonoVendedor}?text=${encodeURIComponent(
            `_¡Hola, Electrozona! Quiero realizar la compra de los siguientes productos:_\n\n------------------------------\n\n${message}${total}`
        )}`;

        window.open(whatsappLink, "_blank");
    };
    return (
        <>
            <div className='cartContainer mt-4'>
                <p className='py-2 fw-bold fs-2 position-relative' style={{ backgroundColor: "#f0f0f0" }}>
                    <Link to="/electrozona/#" className='btn rounded bi bi-chevron-left fw-bolder fs-2 p-0 position-absolute top-50 translate-middle-y start-0'></Link>
                    Tu carrito
                </p>
                {cart.length !== 0 ?

                    <div>
                        <ListItemOnCart cart={cart} removeItem={removeItem} />
                        <div className='totalCtn py-2 px-3 fw-bolder d-flex justify-content-between align-items-center mt-4' style={{ backgroundColor: "#f0f0f0", color: "#000" }}>
                            <span>TOTAL </span>
                            <span className='fs-3'>{formatPrice(totalAmount())}</span>
                        </div>
                        <div className='d-flex justify-content-between px-3 pt-4'>
                            <button className='btn text-decoration-underline' style={{ color: '#CC0101', fontSize: "14px" }} onClick={cleanCart}>Vaciar carrito</button>
                            <button className='btn rounded-0' style={{ backgroundColor: "#000", color: "#fff" }} onClick={handleCompra}>INICIAR LA COMPRA <i className="bi bi-box-arrow-up-right"></i></button>
                        </div>
                    </div>
                    :
                    <div className='emptyCart'>
                        <p>No hay productos en tu carrito</p>
                        <Link to='/electrozona' className='text-decoration-underline'>Ir a Inicio</Link>
                    </div>}

            </div>
        </>
    )
}

export default CartContainer
