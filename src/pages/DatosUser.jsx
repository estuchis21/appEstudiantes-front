import React, { useState, useEffect } from "react";

const DatosPersonales = () => {
    const [datos, setDatos] = useState({});
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        
        setDatos({
            nombre: "Ana García",
            dni: "34.567.890",
            email: "ana.garcia@instituto20.edu.ar",
            telefono: "+54 11 1234-5678",
            direccion: "Calle Falsa 123, Ciudad",
            carrera: "Profesorado en Matemática",
        });
    }, []);

    return (
        <div className="datos-personales-container">
            <h1 className="datos-personales-title">Datos Personales</h1>
            <div className="datos-personales-content">
                {Object.entries(datos).map(([key, value]) => (
                    <div key={key} className="datos-item">
                        <strong className="datos-label">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </strong>
                        <span className="datos-value">{value}</span>
                    </div>
                ))}
            </div>
            <button 
                className="datos-editar-btn"
                onClick={() => setEditando(!editando)}
            >
                {editando ? 'Guardar Cambios' : 'Editar Datos'}
            </button>
        </div>
    );
};

export default DatosPersonales;