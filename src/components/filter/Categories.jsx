import React from 'react';
import "./Categories.css"
const Categories = ({ categorias, selectedCategory, handleCategoryChange }) => {

    return (
        <div className="d-flex mt-3 hidden-scrollbar mb-3 px-2">
            {categorias?.map((cat, index) =>
                <div key={index}
                    onClick={(e) => { handleCategoryChange(e) }}
                    className={selectedCategory === cat ? 'px-3 py-1 me-2 text-uppercase text-nowrap categoriaActiva' : 'px-3 py-1 me-2 text-uppercase text-nowrap'}
            style={{ backgroundColor: "#ddd", fontSize: "14px" }}
                >{cat}</div>
    )
}
        </div >
    );
};

export default Categories;