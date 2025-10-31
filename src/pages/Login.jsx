// pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/';
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <div className="form-group">
                    <label>DNI:</label>
                    <input type="number" placeholder="Ingresa tu DNI" />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" placeholder="Ingresa tu contraseña" />
                </div>
                <button type="submit" className="login-button">Ingresar</button>
            </form>
        </div>
    );
}

export default LoginPage;
