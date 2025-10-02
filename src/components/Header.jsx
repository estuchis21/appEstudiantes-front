import React from "react";
import "../Styles.css"
const Header = () => {
    return (
        <header className="Header-Block">
            <div className="Header-Container">
                <img className="Header-Logo"></img>
                <h1 className="Header-Title">INSTITUTO SUPERIOR de FORMACION DOCENTE y TECNICA N°20</h1>
                <button className="Button-Login">Iniciar Sesión</button>
            </div>
        </header>
    );
}
export default Header;