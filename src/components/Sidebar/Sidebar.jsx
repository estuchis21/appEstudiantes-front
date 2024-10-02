import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa react-router-dom para redirecciones
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Importa el JS de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Iconos de Bootstrap

const SidebarMenu = ({ setLoginSuccessful }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('documento'); // Elimina el token de localStorage
    setLoginSuccessful(false); // Actualiza el estado de login
    navigate('/'); // Redirige al usuario al inicio
  };

  const nombre = localStorage.getItem('nombre');

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark min-vh-100">
      {/* Enlace al inicio con el logo */}
      <Link to="/" className="navbar-brand d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <img src="..\src\assets\img\instituto20.png" alt="" width="70" height="auto" className="img-fluid mx-2" />
      </Link>
      <hr />
      
      {/* Enlaces de navegación en Sidebar */}
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/home" className="nav-link text-white">
            <i className="bi bi-house-door"></i>
            <span className="ms-2">Inicio</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/DiaryBook" className="nav-link text-white">
            <i className="bi bi-book"></i>
            <span className="ms-2 d-none d-sm-inline">Cursada</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/AccountPlan" className="nav-link text-white">
            <i className="bi bi-file-earmark">IM</i>
            <span className="ms-2 d-none d-sm-inline">Inscripcion Materias</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/ListUsers" className="nav-link text-white">
            <i className="bi bi-people"></i>
            <span className="ms-2 d-none d-sm-inline">Usuarios</span>
          </Link>
        </li>
      </ul>
      <hr />
      
      {/* Dropdown con Perfil y Logout */}
      <div className="dropdown">
        <a className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="bi bi-person-circle"></i>
          <span className="ms-2">{nombre}</span>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser">
          <li>
            <Link className="dropdown-item" to="/profile">
              <i className="bi bi-person"></i> 
              <span className="ms-2 d-none d-sm-inline">Perfil</span>
            </Link>
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              <span className="ms-2 d-none d-sm-inline">Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SidebarMenu;
