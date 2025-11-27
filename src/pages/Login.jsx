// pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import loginService from '../services/loginService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Documento: '',
        Contrasena: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Enviando datos:', formData);
            const result = await loginService(formData);
            console.log('Login exitoso:', result);
            
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(result.datosAlumno));
            localStorage.setItem('careerData', JSON.stringify(result.datosCarrera));
            
            console.log('Redirigiendo a /');
            // FORZAR el reload
            window.location.href = '/';
            
        } catch (error) {
            console.log('Error completo:', error);
            console.log('Mensaje de error:', error.message);
            
            // SweetAlert directo sin condiciones primero
            Swal.fire({
                icon: 'error',
                title: 'Error de login',
                text: 'DNI o contraseña incorrectos',
                confirmButtonColor: '#3085d6'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                
                <div className="form-group">
                    <label>DNI:</label>
                    <input 
                        name="Documento"
                        type="number" 
                        placeholder="Ingresa tu DNI"
                        value={formData.Documento}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input 
                        name="Contrasena"
                        type="password" 
                        placeholder="Ingresa tu contraseña"
                        value={formData.Contrasena}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Iniciando sesión...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;