import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    db, googleProvider, signInWithEmailAndPassword,
    signInWithPopup, auth, fetchSignInMethodsForEmail,
    EmailAuthProvider, linkWithCredential
} from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        setError("");
        e.preventDefault();

        try {

            // Verificar si el usuario es administrador en Firestore
            const adminRef = doc(db, "Usuarios", "administrador");
            const adminSnap = await getDoc(adminRef);

            if (adminSnap.exists() &&
                adminSnap.data().email === email &&
                adminSnap.data().password === password &&
                adminSnap.data().role === "admin"
            ) {
                navigate("/electrozona/admin");
                //es una especie de clave
                localStorage.setItem("electrozona", "365")
            } else {
                setError("No tienes permisos para acceder.");
            }
        } catch (err) {
            setError("Error en inicio de sesión: " + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            // Verificar si el usuario ya existe en Firestore
            const adminRef = doc(db, "Usuarios", "administrador");
            const adminSnap = await getDoc(adminRef);

            if (!adminSnap.exists()) {
                // Guardar el usuario en Firestore si no existe
                await setDoc(adminRef, { email: user.email, role: "admin" });
                console.log("Usuario administrador registrado en Firestore");
            }

            navigate("/electrozona/admin");
        } catch (err) {
            setError("Error en inicio de sesión: " + err.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h3 className="text-center">Iniciar Sesión</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" onClick={(e) => { handleLogin(e) }}>Iniciar Sesión</button>
                        </form>
                        <hr />
                        <button className="btn btn-danger w-100" onClick={handleGoogleLogin}>
                            Iniciar sesión con Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
