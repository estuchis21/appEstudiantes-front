import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import "../Styles/Analitico.css";

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
            <header className="analitico-header">
                <h1 className="analitico-title">Analítico de Cursadas</h1>
                <div className="info-badge">
                    <span className="badge-text">Historial Completo</span>
                </div>
            </header>
            

            <section className="tabla-section">
                <div className="section-card">
                    <h2>Historial Académico</h2>
                    <TablaReutilizable
                        datos={materias}
                        columnas={columnas}
                    />
                </div>
            </section>
        </div>
    );
};

export default Analitico;