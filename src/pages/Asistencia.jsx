import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import "../Styles/Asistencia.css";

const Asistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAsistencias([
                { materia: "Álgebra I", fecha: "01/11/2024", Porcentaje: "90", profesor: "Dr. López" },
                { materia: "Geometría", fecha: "02/11/2024", Porcentaje: "15", profesor: "Mg. Torres" },
                { materia: "Pedagogía", fecha: "03/11/2024", Porcentaje: "99", profesor: "Lic. Díaz" },
                { materia: "Matemática Discreta", fecha: "04/11/2024", Porcentaje: "10", profesor: "Dra. García" },
                { materia: "Programación", fecha: "05/11/2024", Porcentaje: "60", profesor: "Ing. Martínez" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const columnas = [
        { 
            key: "materia", 
            header: "Materia", 
            width: "250px",
            render: (fila) => <strong>{fila.materia}</strong>
        },
        { 
            key: "fecha", 
            header: "Fecha", 
            align: "center",
            render: (fila) => (
                <span style={{ fontWeight: '500' }}>{fila.fecha}</span>
            )
        },
        { 
            key: "Porcentaje", 
            header: "Porcentaje", 
            align: "center",
            render: (fila) => (
                <span className={`porcentaje-asistencia ${getClasePorcentaje(fila.Porcentaje)}`}>
                    {fila.Porcentaje}%
                </span>
            )
        },
        { 
            key: "profesor", 
            header: "Profesor",
            render: (fila) => (
                <span style={{ color: '#6c757d' }}>{fila.profesor}</span>
            )
        }
    ];

    // Función para determinar la clase CSS según el porcentaje
    const getClasePorcentaje = (porcentaje) => {
        const num = parseInt(porcentaje);
        if (num >= 80) return 'alto';
        if (num >= 60) return 'medio';
        if (num >= 40) return 'bajo';
        return 'critico';
    };

    return (
        <div className="asistencias-container">
            <header className="asistencias-header">
                <h1 className="asistencias-title">Registro de Asistencias</h1>
                <div className="info-badge">
                    <span className="badge-text">Período Actual</span>
                </div>
            </header>

            <section className="tabla-section">
                <div className="section-card">
                    <h2>Detalle de Asistencias por Materia</h2>
                    <TablaReutilizable
                        datos={asistencias}
                        columnas={columnas}
                        loading={loading}
                        vacioMensaje="No hay registros de asistencia disponibles"
                    />
                </div>
            </section>
        </div>
    );
};

export default Asistencias;