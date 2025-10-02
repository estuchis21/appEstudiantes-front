import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";

const Asistencias = () => {
    const [asistencias, setAsistencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular datos de asistencias
        setTimeout(() => {
            setAsistencias([
                { materia: "Álgebra I", fecha: "01/11/2024", estado: "Presente", profesor: "Dr. López" },
                { materia: "Geometría", fecha: "02/11/2024", estado: "Ausente", profesor: "Mg. Torres" },
                { materia: "Pedagogía", fecha: "03/11/2024", estado: "Presente", profesor: "Lic. Díaz" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const columnas = [
        { key: "materia", header: "Materia", width: "200px" },
        { key: "fecha", header: "Fecha", align: "center" },
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
        { key: "profesor", header: "Profesor" }
    ];

    return (
        <div className="asistencias-container">
            <h1 className="asistencias-title">Registro de Asistencias</h1>
            <TablaReutilizable
                datos={asistencias}
                columnas={columnas}
                loading={loading}
                vacioMensaje="No hay registros de asistencia"
            />
        </div>
    );
};

export default Asistencias;