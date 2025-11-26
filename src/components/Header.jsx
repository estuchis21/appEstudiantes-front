import React from "react";
import "../Styles.css"
import { useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, toggleSidebar }) => {
    const navigate = useNavigate();

    return (
        <header className="Header-Block">
            <div className="Header-Container">
                <img 
                    src="/src/assets/img/instituto20.jpg" 
                    alt="Logo Instituto" 
                    className="Header-Logo"
                    onClick={() => navigate('/')}
                />
                {isLoggedIn ? (
                    <button 
                        className="Button-Menu" 
                        onClick={toggleSidebar}
                        aria-label="Abrir menú"
                    >
                        ☰
                    </button>
                ) : (
                    <button 
                        className="Button-Login" 
                        onClick={() => navigate('/Login')}
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </header>
    );
}
export default Header;