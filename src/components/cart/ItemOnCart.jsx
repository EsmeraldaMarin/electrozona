import { Link } from 'react-router-dom';
import { UseCart } from './CartContext'
import ItemCountSimple from './ItemCountSimple';

const itemOnCart = ({ item, removeItem }) => {

    const price = item.precio * item.quantity;

    const { updateItemOnCart } = UseCart();

    const updateItemOnCartFunction = (id, quantity) => updateItemOnCart(id, quantity);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };


    return (
        <div className='itemOnCartDetail d-flex p-3 justify-content-start'>
            <button onClick={() => removeItem(item.id)} className="bi bi-trash px-1"/>

            <img className='me-3 border' src={item.imagen[0]} alt={item.nombre} style={{ width: "90px", height: "90px", objectFit: "contain" }} />
            <div className='d-flex flex-column justify-content-between align-items-start' style={{ width: "100%" }}>
                <Link className='text-decoration-none' to={`/electrozona/product/${item.id}`} >
                    <p className='m-0 text-start text-black' style={{ fontSize: "16px" }}>{item.nombre}</p>
                </Link>
                <div className='d-flex justify-content-between' style={{width:"100%"}}>
                    <ItemCountSimple stock={item.cantidad} initial={item.quantity} onAdd={updateItemOnCartFunction} item={item} />
                    <span className='fw-bolder fs-5 '>{formatPrice(price)}</span>
                </div>
            </div>
        </div>
    )
}

export default itemOnCart
