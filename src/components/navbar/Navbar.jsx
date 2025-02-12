import React, { useEffect, useState } from 'react';
import Cart from '../cart/Cart';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Navbar.scss"

const Navbar = () => {
    const [categories, setCategories] = useState([]);

    // Función para cargar las categorías
    const fetchCategories = async () => {
        try {
            const categoryCollection = collection(db, "Categorias");
            const querySnapshot = await getDocs(categoryCollection);
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
                    <Link to="/electrozona">
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
                                className="nav-item">
                                <Link
                                    className="nav-link active"
                                    to="/electrozona"
                                >
                                    Inicio
                                </Link>
                            </li>
                            {categories.map((categoria) =>
                            (
                                <li
                                    data-bs-dismiss="offcanvas"
                                    className="nav-item" key={categoria.id}>
                                    <Link
                                        className="nav-link"
                                        to={`/electrozona/category/${categoria.id}`}
                                    >
                                        {capitalize(categoria.nombre)}
                                    </Link>
                                </li>
                            )
                            )}
                            <li
                                data-bs-dismiss="offcanvas"
                                className="nav-item login" >
                                <Link
                                    className="nav-lin"
                                    to={`/electrozona/login`}
                                >
                                    Iniciar Sesión <i className="ms-2 bi bi-box-arrow-in-left"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Cart />

            </div>
        </nav>
    );
};

export default Navbar;
