// pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Guardar en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        // Recargar para que App.js detecte el cambio
        window.location.href = '/';
    };

    return (
        <div style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <label>DNI: </label>
                <input type="number" />
                <br />
                <label>Contraseña: </label>
                <input type="password" />
                <br />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}

export default LoginPage;