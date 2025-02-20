import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductSection = ({ categories, filtrarProductosPorCategoria }) => {
    const scrollRefs = useRef({});

    const scrollLeft = (categoria) => {
        if (scrollRefs.current[categoria]) {
            scrollRefs.current[categoria].scrollLeft -= 240;
        }
    };

    const scrollRight = (categoria) => {
        if (scrollRefs.current[categoria]) {
            scrollRefs.current[categoria].scrollLeft += 240;
        }
    };

    return (
        <>
            {categories.length > 0 && categories.map((categoria) => {
                // Asegurar que cada categoría tiene su referencia en el objeto
                if (!scrollRefs.current[categoria.nombre]) {
                    scrollRefs.current[categoria.nombre] = null;
                }

                return (
                    <div key={categoria.nombre} className='section-ctn'>
                        <Link to={'/electrozona/category/' + categoria.nombre} className='categoria-banner'>{categoria.nombre}</Link>
                        <div className='d-flex justify-content-between align-items-center line-ver-mas'>
                            <Link to={'/electrozona/category/' + categoria.nombre} className='vertodos'>Ver todos</Link>
                            <div className='line'></div>
                            <div className='d-flex div-botones-direcciones'>
                                <div className='d-flex justify-content-center align-items-center' 
                                     onClick={() => scrollLeft(categoria.nombre)} 
                                     style={{ cursor: 'pointer' }}>
                                    {`<`}
                                </div>
                                <div className='ms-3 d-flex justify-content-center align-items-center' 
                                     onClick={() => scrollRight(categoria.nombre)} 
                                     style={{ cursor: 'pointer' }}>
                                    {`>`}
                                </div>
                            </div>
                        </div>

                        <div 
                            className="product-list hidden-scrollbar" 
                            ref={(el) => (scrollRefs.current[categoria.nombre] = el)}
                            style={{ overflowX: 'auto', scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}
                        >
                            {filtrarProductosPorCategoria(categoria.nombre).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ProductSection;