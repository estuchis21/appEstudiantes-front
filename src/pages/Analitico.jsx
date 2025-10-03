import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";

const Analitico = () => {
    const [materias, setMaterias] = useState([]);

    useEffect(() => {

        setMaterias([
            { materia: "Matemática I", año: "2023", nota: 8, estado: "Aprobada" },
            { materia: "Pedagogía", año: "2023", nota: 7, estado: "Aprobada" },
            { materia: "Álgebra", año: "2024", nota: 9, estado: "Aprobada" },
            { materia: "Geometría", año: "2024", nota: null, estado: "Cursando" },
        ]);
    }, []);

    const columnas = [
        { key: "materia", header: "Materia" },
        { key: "año", header: "Año", align: "center" },
        { 
            key: "nota", 
            header: "Nota", 
            align: "center",
            render: (fila) => fila.nota || "-"
        },
        { 
            key: "estado", 
            header: "Estado", 
            align: "center",
            render: (fila) => (
                <span className={`estado-materia ${fila.estado.toLowerCase()}`}>
                    {fila.estado}
                </span>
            )
        }
    ];

    return (
        <div className="analitico-container">
            <h1 className="analitico-title">Analítico de Cursadas</h1>
            <TablaReutilizable
                datos={materias}
                columnas={columnas}
                titulo="Historial Académico"
            />
        </div>
    );
};

export default Analitico;