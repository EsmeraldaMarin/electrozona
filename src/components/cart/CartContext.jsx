import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext([]);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Recuperar el carrito del localStorage cuando se monta el componente
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart]);

    // Agrega un nuevo item al cart con la cantidad correspondiente
    const addItem = (item, quantity) => {
        if (isInCart(item.id)) {
            updateQuantity(item.id, quantity);
        } else {
            item.quantity = quantity;
            const newItem = item;
            setCart(prevCart => [...prevCart, newItem]);
        }
    };

    // Actualiza en el cart la cantidad de items que el usuario está pidiendo
    const updateItemOnCart = (id, quantity) => {
        let itemOnCart = cart.filter(product => product.id === id);
        itemOnCart[0].quantity = quantity;
        const updatedCart = cart.map(product => {
            if (product.id === id) {
                return itemOnCart[0];
            }
            return product;
        });
        setCart(updatedCart);
    };

    // Elimina todas las unidades de un item del cart
    const removeItem = (id) => {
        const cartWithProdRemoved = cart.filter(item => item.id !== id);
        setCart(cartWithProdRemoved);
    };

    // Vacia todo el cart
    const cleanCart = () => {
        setCart([]);
        localStorage.removeItem('cart'); // Limpiar el carrito del localStorage
    };

    // Booleano que determina la existencia de un producto en el cart
    const isInCart = (id) => {
        return cart.some(product => product.id === id);
    };

    // Actualiza la cantidad de productos que se agregan al cart si el producto ya se encontraba ahí
    const updateQuantity = (id, quantityToAdd) => {
        const updatedCart = cart.map(product => {
            if (product.id === id) {
                const newQuantity = product.quantity + quantityToAdd;
                return { ...product, quantity: newQuantity };
            }
            return product;
        });
        setCart(updatedCart);
    };

    // Devuelve el total de productos en el cart
    const totalQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Devuelve el precio total de todos los productos del cart
    const totalAmount = () => {
        console.log(cart)
        return cart.reduce((total, item) => total + item.quantity * item.precio, 0);
    };

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, cleanCart, isInCart, totalQuantity, totalAmount, updateItemOnCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const UseCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('El hook useCart debe ser usado dentro de un CartProvider. No seas pavo');
    }
    return context;
};

export default CartContext;
