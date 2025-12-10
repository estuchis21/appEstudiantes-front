import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Sidebar.css";
import Popup from "./Popup";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showMoodlePopup, setShowMoodlePopup] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        toggleSidebar();
        navigate('/');
        window.location.reload(); 
    };

    const handleMoodleRedirect = () => {
        window.open('http://moodle.isfdyt20.edu.ar/login/index.php', '_blank');
        setShowMoodlePopup(false);
        toggleSidebar(); 
    };

    const menuItems = [
        { label: "Datos personales", action: () => navigate('/DatosPersonales') },
        { label: "Mis finales", action: () => navigate('/MisFinales') },
        // { label: "Asistencias", action: () => navigate('/Asistencia') },
        { label: "Cursadas", action: () => navigate('/Analitico') },
        { label: "Inscribirse a finales", action: () => navigate('/Finales') },
        { label: "Matriculacion", action: () => navigate('/Matriculacion') },
        { label: "Moodle", action: () => setShowMoodlePopup(true) },
        { label: "Cerrar Sesión", action: () => setShowLogoutPopup(true) }
    ];

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            
            <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
                <nav className="sidebar-content">
                    <ul className="sidebar-options">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button 
                                    className="sidebar-item"
                                    onClick={item.action}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {showLogoutPopup && (
                <Popup
                    mensaje="¿Estás seguro que deseas cerrar sesión?"
                    textoAceptar="Sí, deseo salir"
                    textoCancelar="Cancelar"
                    onAceptar={handleLogout}
                    onCancelar={() => setShowLogoutPopup(false)} 
                    tipo="confirmacion"
                />
            )}
            {showMoodlePopup && (
                <Popup
                    mensaje="¿Estás seguro que deseas ingresar al Moodle?"
                    textoAceptar="Sí, deseo ingresar"
                    textoCancelar="Cancelar"
                    onAceptar={handleMoodleRedirect}
                    onCancelar={() => setShowMoodlePopup(false)} 
                    tipo="confirmacion"
                />
            )}
        </>
    );
}

export default Sidebar;