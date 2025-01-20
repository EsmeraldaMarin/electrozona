import React from 'react';
import "./Categories.css"
const Categories = () => {

    const categorias = ["Celulares", "Auriculares", "Parlantes", "Teclados", "Mouses"]
    return (
        <div className="d-flex mt-3 hidden-scrollbar">
            {categorias.map((cat, index) =>
                <div key={index}
                    className='px-3 py-1 me-2 text-uppercase'
                    style={{ backgroundColor: "#ddd", fontSize:"14px"}}
                >{cat}</div>
            )}
        </div>
    );
};

export default Categories;