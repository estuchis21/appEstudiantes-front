import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        "Datos personales",
        "Asistencias", 
        "Analitico",
        "Inscribirse a finales",
        "Matriculacion"
    ];

    return (
        <>
            {/* Overlay para cerrar al hacer click fuera */}
            {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
            
            <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
                <button 
                    className="toggle-button"
                    onClick={toggleSidebar}
                    aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isOpen ? "✕" : "☰"}
                </button>
                
                <nav className="sidebar-content">
                    <ul className="sidebar-options">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button className="sidebar-item">
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Sidebar;