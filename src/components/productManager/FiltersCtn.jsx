import React, { useState } from "react";
import "./FiltersCtn.scss";

const FiltersCtn = ({ allCategorias, filters, setFilters }) => {

    const [desplegado, setDesplegado] = useState(false)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className={`filters ${desplegado && "activo"}`} >
            <div className="title-filter border-bottom pb-2" onClick={() => setDesplegado(!desplegado)}>
                <h6 className="text-start me-2">Filtrar Productos <i className="ms-3 bi bi-chevron-down"></i></h6>
                {/*Object.values(filters).map(filtro => {
                    console.log(filters)
                    if (typeof filtro !== "string" || !filtro || filtro === "") return
                    if (filtro === "true") return <p className="filtros-header">Activos</p>
                    if (filtro === "false") return <p className="filtros-header">Inactivos</p>

                    return <p className="filtros-header">{filtro}</p>
                })*/}
            </div>
            <div className="filters-ctn">
                <div className=" filtro-nombre">
                    <label className="form-label">Filtrar por Nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese un producto"
                        name="nombre"
                        value={filters.nombre}
                        onChange={handleChange}
                    />
                </div>

                <div className=" filtro-codigo">
                    <label className="form-label">Filtrar por Código:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese un código"
                        name="codigo"
                        value={filters.codigo}
                        onChange={handleChange}
                    />
                </div>

                <div className=" filtro-precios">
                    <label className="form-label">Filtrar por Precios:</label>
                    <div className="d-flex">
                        <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control me-2"
                                placeholder="Mínimo"
                                name="precioMin"
                                value={filters.precioMin}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">$</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Máximo"
                                name="precioMax"
                                value={filters.precioMax}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="filtrar-por-categoria">
                    <label className="form-label">Filtrar por Categoría: </label>
                    <select
                        className="form-select"
                        name="categoria"
                        value={filters.categoria}
                        onChange={handleChange}
                    >
                        <option value="">Todos</option>
                        {allCategorias?.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="filtrar-por-estado">
                    <label className="form-label">Filtrar por Estado: </label>
                    <select
                        className="form-select"
                        name="estado"
                        value={filters.estado}
                        onChange={handleChange}
                    >
                        <option value="">Todos</option>
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>

            </div >
            <button
                className="btn-limpiar-filtros"
                onClick={() => setFilters({ nombre: "", codigo: "", precioMin: "", precioMax: "", categoria: "", estado: "" })}
            >
                Limpiar Filtros
            </button>
        </div>
    );
};

export default FiltersCtn;
