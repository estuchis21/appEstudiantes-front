import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";

const Asistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAsistencias([
                { materia: "Álgebra I", fecha: "01/11/2024", estado: "Presente", profesor: "Dr. López" },
                { materia: "Geometría", fecha: "02/11/2024", estado: "Ausente", profesor: "Mg. Torres" },
                { materia: "Pedagogía", fecha: "03/11/2024", estado: "Presente", profesor: "Lic. Díaz" },
                { materia: "Matemática Discreta", fecha: "04/11/2024", estado: "Presente", profesor: "Dra. García" },
                { materia: "Programación", fecha: "05/11/2024", estado: "Justificado", profesor: "Ing. Martínez" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Calcular estadísticas
    const totalAsistencias = asistencias.length;
    const presentes = asistencias.filter(a => a.estado === "Presente").length;
    const ausentes = asistencias.filter(a => a.estado === "Ausente").length;
    const porcentajeAsistencia = totalAsistencias > 0 ? Math.round((presentes / totalAsistencias) * 100) : 0;

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
            key: "estado", 
            header: "Estado", 
            align: "center",
            render: (fila) => (
                <span className={`estado-asistencia ${fila.estado.toLowerCase()}`}>
                    {fila.estado}
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

    return (
        <div className="asistencias-container">
            {/* Header con diseño mejorado */}
            <div className="asistencias-header">
                <h1 className="asistencias-title">Registro de Asistencias</h1>
                <p className="asistencias-subtitle">Seguimiento detallado de tu asistencia académica</p>
            </div>

            {/* Estadísticas rápidas */}
            <div className="asistencias-stats">
                <div className="stat-card">
                    <div className="stat-number">{totalAsistencias}</div>
                    <div className="stat-label">Total Registros</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{presentes}</div>
                    <div className="stat-label">Presentes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{ausentes}</div>
                    <div className="stat-label">Ausentes</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{porcentajeAsistencia}%</div>
                    <div className="stat-label">Asistencia</div>
                </div>
            </div>

            {/* Tabla de asistencias */}
            <TablaReutilizable
                datos={asistencias}
                columnas={columnas}
                loading={loading}
                vacioMensaje="No hay registros de asistencia disponibles"
                titulo="Detalle de Asistencias por Materia"
            />
        </div>
    );
};

export default Asistencias;