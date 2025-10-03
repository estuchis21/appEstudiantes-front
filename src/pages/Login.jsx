// pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginService from "../services/loginService";

const LoginPage = () => {
    const navigate = useNavigate();
    const [Documento, setDocumento] = useState("");
    const [Contrasena, setContrasena] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // Llamada al servicio de login
        const response = await loginService({
            Documento: String(Documento).trim(),
            Contrasena: Contrasena.trim(),
        });

        // Tomamos el primer elemento del array datosAlumno
        const usuario = response.datosAlumno?.[0];
        // Redirigir al home
        navigate("/");
        } catch (err) {
        console.error(err);
        }
    };


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <div className="form-group">
                    <label>DNI:</label>
                    <input
                        type="text"
                        id="documento"
                        className="login-input"
                        value={Documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        required
                        autoComplete="DNI"
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        id="contrasena"
                        className="login-input"
                        value={Contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        required
                        autoComplete="current-password"
                    />
                </div>
                <button type="submit" className="login-button">Ingresar</button>
            </form>
        </div>
    );
}

export default LoginPage;