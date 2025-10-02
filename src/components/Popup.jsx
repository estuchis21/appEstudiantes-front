//Este popup puede ser reutilizado en los componentess que se necesiten
//Hay un ejemplo de como usarlo en Sidebar.jsx
import React from 'react';
import './Popup.css'; 

const Popup = ({ 
  mensaje = "¿Estás seguro?",
  textoAceptar = "Aceptar", 
  textoCancelar = "Cancelar",
  onAceptar, 
  onCancelar,
  mostrarCancelar = true,
  tipo = "confirmacion" // 'confirmacion', 'info', 'advertencia', 'error'
}) => {
    return (
        <>
            <div className="popup-overlay" onClick={onCancelar}></div>
            <div className={`popup-container popup-${tipo}`}>
                <p className="popup-message">{mensaje}</p>
                <div className="popup-buttons">
                    <button 
                        className={`popup-button popup-button-aceptar popup-button-${tipo}`}
                        onClick={onAceptar}
                    >
                        {textoAceptar}
                    </button>
                    
                    {mostrarCancelar && (
                        <button 
                            className="popup-button popup-button-cancelar"
                            onClick={onCancelar}
                        >
                            {textoCancelar}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Popup;