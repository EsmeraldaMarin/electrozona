import React from 'react';
import "./Categories.css"
import { Link } from 'react-router-dom';
const Categories = ({ categorias }) => {
    return (
        <div className="mt-3 mb-3 categorias-ctn">
            {categorias?.map((cat, index) =>
                <Link
                    className='categoria-card'
                    key={index}
                    to={'/category/' + cat.nombre}
                >
                    <div
                        className={`py-1 text-uppercase text-wrap d-flex flex-column justify-content-center align-items-center`}
                        style={{ fontSize: "14px", cursor: "pointer" }}
                    >
                        <img src={cat.imagen} alt={"imagen de " + cat.nombre} />
                        {cat.nombre}</div>
                </Link>
            )
            }
        </div >
    );
};

export default Categories;