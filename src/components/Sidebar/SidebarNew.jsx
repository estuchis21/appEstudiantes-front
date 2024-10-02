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
    const [isCollapsed, setIsCollapsed] = useState(false); // Nuevo estado para controlar el colapso
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('documento'); // Elimina el token de localStorage
        setLoginSuccessful(false); // Actualiza el estado de login
        navigate('/'); // Redirige al usuario al inicio
    };

    const nombre = localStorage.getItem('nombre');

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
            <CDBSidebar textColor="#fff" backgroundColor="rgb(10 21 81)" collapsed={isCollapsed}>
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={() => setIsCollapsed(!isCollapsed)}></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        Instituto20
                    </a>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        <NavLink exact to="/inicio" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="columns">Inicio</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/tables" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="table">Inscripcion Materias</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/profile" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
                        </NavLink>
                        <NavLink exact to="/analytics" activeClassName="activeClicked">
                            <CDBSidebarMenuItem icon="chart-line">Analytics</CDBSidebarMenuItem>
                        </NavLink>
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                <CDBSidebarFooter className="text-center">
                    {/* Dropdown con Perfil y Logout */}
                    <div className="dropdown m-4">
                        <a className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-person-circle"></i>
                            {/* Cambia la visibilidad del nombre según el estado del sidebar */}
                            <span className={`ms-2 ${isCollapsed ? 'd-none' : 'd-inline'}`}>{nombre}</span>
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
                                    <span className={`ms-2 ${isCollapsed ? 'd-none' : 'd-inline'}`}>Cerrar Sesión</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default SidebarMenu;
