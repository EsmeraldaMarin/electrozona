import React, { useEffect, useRef, useState } from 'react';
import Cart from '../cart/Cart';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Navbar.scss"

const NavbarAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const credencial = localStorage.getItem('electrozona')


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const fetchCategories = async () => {
        try {
            const categoryCollection = collection(db, "Categorias");
            const q = query(categoryCollection, orderBy("nombre")); // Ordenar por nombre

            const querySnapshot = await getDocs(q);
            const categoryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                nombre: doc.data().nombre,
            }));
            setCategories(categoryList);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };


    useEffect(() => {
        fetchCategories();
    }, []);

    const capitalize = (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };


    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" >
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasNavbar"
                    aria-controls="offcanvasNavbar"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-brand m-0">
                    <Link to="/">
                        <img
                            style={{ width: '50px', height: '50px' }}
                            src={process.env.PUBLIC_URL + '/img/logo_electro.png'}
                            alt="logo electrozona"
                        />
                    </Link>
                </div>
                <div
                    className="offcanvas offcanvas-start"
                    tabIndex="-1"
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    style={{ backgroundColor: "#000" }}
                >
                    <div className="offcanvas-header">
                        <h5
                            className="offcanvas-title"
                            id="offcanvasNavbarLabel"
                            style={{ color: "#fff" }}
                        >
                            ElectroZona
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                            style={{ backgroundColor: "#fff" }}
                        ></button>
                    </div>
                    <div className="offcanvas-body">

                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 text-start ps-3">


                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item me-3">
                                <Link
                                    className="nav-link active"
                                    to="/admin"
                                >
                                    Mis Productos
                                </Link>
                            </li>
                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item me-3">
                                <Link
                                    className="nav-link active"
                                    to="/admin/banners"
                                >
                                    Mis Banners
                                </Link>
                            </li>
                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item me-3">
                                <Link
                                    className="nav-link active"
                                    to="/admin/estadisticas"
                                >
                                    Estadísticas
                                </Link>
                            </li>
                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item">
                                <Link
                                    className="nav-link active"
                                    to="/"
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li className="nav-item dropdown desktop" ref={dropdownRef}>
                                <a className="nav-link dropdown-toggle"
                                    href="#" role="button"
                                    onClick={toggleDropdown}
                                    aria-expanded={isOpen}>
                                    Categorías
                                </a>
                                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                                    {categories.map((categoria) =>
                                    (
                                        <li
                                            data-bs-dismiss="offcanvas"
                                            className="nav-item" key={categoria.id}>
                                            <Link
                                                className="dropdown-item"
                                                to={`/category/${categoria.id}`}
                                            >
                                                {capitalize(categoria.nombre)}
                                            </Link>
                                        </li>
                                    )
                                    )}
                                </ul>
                            </li>
                            {categories.map((categoria) =>
                            (
                                <li
                                    data-bs-dismiss="offcanvas"
                                    className="nav-item mobile" key={categoria.id}>
                                    <Link
                                        className="nav-link"
                                        to={`/category/${categoria.id}`}
                                    >
                                        {capitalize(categoria.nombre)}
                                    </Link>
                                </li>
                            )
                            )}

                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item logout" >
                                <Link
                                    className="nav-link"
                                    to={`/login`}
                                    onClick={() => localStorage.removeItem("electrozona")}
                                >
                                    Cerrar Sesión <i className="ms-1 bi bi-box-arrow-right"></i>
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
