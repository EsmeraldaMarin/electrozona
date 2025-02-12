import react from "react";

const PriceFormatter = ({ valor }) => {

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(price);
    };
    return (
        <p>{formatPrice(valor)}</p>
    )
}

export default PriceFormatter;