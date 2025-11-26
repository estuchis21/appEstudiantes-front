import React from 'react';
import './LogoutPopup.css';

const LogoutPopup = ({ onConfirm, onCancel }) => {
    return (
        <>
            <div className="popup-overlay" onClick={onCancel}></div>
            <div className="popup-container">
                <p className="popup-message">¿Estás seguro que deseas cerrar sesión?</p>
                <div className="popup-buttons">
                    <button 
                        className="confirm-button"
                        onClick={onConfirm}
                    >
                        Sí, deseo salir
                    </button>
                    <button 
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </>
    );
};

export default LogoutPopup;