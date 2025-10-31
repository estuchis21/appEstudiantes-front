import React from 'react';
import './CustomPopup.css';

const CustomPopup = ({ 
    title,
    message, 
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    confirmButtonStyle = "default",  // 'default', 'danger', 'success'
    showCancelButton = true
}) => {
    return (
        <>
            <div className="popup-overlay" onClick={onCancel}></div>
            <div className="popup-container">
                {title && <h3 className="popup-title">{title}</h3>}
                <p className="popup-message">{message}</p>
                <div className="popup-buttons">
                    <button 
                        className={`confirm-button ${confirmButtonStyle}`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                    {showCancelButton && (
                        <button 
                            className="cancel-button"
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomPopup;