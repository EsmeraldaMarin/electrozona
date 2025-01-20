import React, { useState } from 'react';

const FilterAndSort = ({ products, onFilterAndSort }) => {
    const [filterText, setFilterText] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');

    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
        onFilterAndSort(e.target.value, sortCriteria);
    };

    const handleSortChange = (e) => {
        setSortCriteria(e.target.value);
        onFilterAndSort(filterText, e.target.value);
    };

    return (
        <div className="container my-3">
            <div className="d-flex">
                <div className="">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por nombre"
                        value={filterText}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="ms-2">
                    <select
                        className="form-select"
                        value={sortCriteria}
                        onChange={handleSortChange}
                    >
                        <option value="">Ordenar por...</option>
                        <option value="price-asc">Precio: Menor a Mayor</option>
                        <option value="price-desc">Precio: Mayor a Menor</option>
                        <option value="name-asc">Nombre: A-Z</option>
                        <option value="name-desc">Nombre: Z-A</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterAndSort;