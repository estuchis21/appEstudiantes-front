import React, { useState } from "react";
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SidebarMenu = ({ setLoginSuccessful }) => {
    const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar el colapso
    const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar el dropdown
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('documento'); // Elimina el token de localStorage
        setLoginSuccessful(false); // Actualiza el estado de login
        navigate('/'); // Redirige al usuario al inicio
        window.location.reload(); // Recargamos la página
    };

    const nombre = localStorage.getItem('nombre');

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen); 
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <CDBSidebar
                textColor="#fff"
                backgroundColor="rgb(10 21 81)"
                collapsed={isCollapsed}
                style={{
                    position: 'fixed', 
                    top: 0,
                    bottom: 0,
                    left: 0,
                    height: '100vh', 
                    zIndex: 1000, 
                    transition: 'width 0.3s ease', 
                }}
            >
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={() => setIsCollapsed(!isCollapsed)}></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        Instituto N°20
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content" style={{ height: '100%', overflowY: 'auto' }}>
                    <CDBSidebarMenu>
                        <NavLink exact to="/inicio" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="bi bi-house">Inicio</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/cursadas" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="bi bi-book">
                                Cursadas
                            </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/situacionAcademica" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="bi bi-journal-text">
                                Situación Académica
                            </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/matriculacion" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="bi bi-pen">
                                Matriculación
                            </CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/finales" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="bi bi-mortarboard">Finales</CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter className="text-center" style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                    
                    <div className="dropdown m-4">
                        <a
                            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                            id="dropdownUser"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{ cursor: 'pointer' }}
                            onClick={toggleDropdown} // Cambia el estado del dropdown al hacer click
                        >
                            <i className="bi bi-person-circle"></i>
                            
                            <span className={`cursor-pointer ms-2 ${isCollapsed || dropdownOpen ? 'd-none' : 'd-inline'}`}>{nombre}</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser">
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    <i className="bi bi-person"></i>
                                    <span className="ms-2">Perfil</span>
                                </Link>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span className="ms-2">Cerrar Sesion</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>

          
            <div
                style={{
                    marginLeft: isCollapsed ? '80px' : '250px', 
                    width: '100%',
                    padding: '20px',
                    transition: 'margin-left 0.3s ease', 
                    overflowY: 'auto',
                }}
            >
                
            </div>
        </div>
    );
};

export default SidebarMenu;
