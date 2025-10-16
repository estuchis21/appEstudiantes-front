import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import "../Styles/Matriculacion.css";

const Matriculacion = () => {
    const [materiasDisponibles, setMateriasDisponibles] = useState([]);
    const [materiasInscriptas, setMateriasInscriptas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setMateriasDisponibles([
                { 
                    id: 1, 
                    materia: "Matemática II", 
                    profesor: "Dr. García", 
                    horario: "Lunes y Miércoles 09:00-11:00",
                    aula: "A-201",
                    cupos: 15,
                    disponible: true
                },
                { 
                    id: 2, 
                    materia: "Física I", 
                    profesor: "Mg. López", 
                    horario: "Martes y Jueves 14:00-16:00",
                    aula: "B-105",
                    cupos: 12,
                    disponible: true
                },
                { 
                    id: 3, 
                    materia: "Programación", 
                    profesor: "Lic. Martínez", 
                    horario: "Lunes y Viernes 10:30-12:30",
                    aula: "Lab-302",
                    cupos: 0,
                    disponible: false
                },
                { 
                    id: 4, 
                    materia: "Inglés Técnico", 
                    profesor: "Dra. Rodríguez", 
                    horario: "Miércoles 16:00-18:00",
                    aula: "A-101",
                    cupos: 20,
                    disponible: true
                }
            ]);

            setMateriasInscriptas([
                { 
                    id: 5, 
                    materia: "Matemática I", 
                    profesor: "Prof. González", 
                    horario: "Lunes y Miércoles 08:00-10:00",
                    aula: "D-205"
                }
            ]);
            
            setLoading(false);
        }, 1000);
    }, []);

    const inscribirMateria = (materia) => {
        if (materia.cupos > 0 && materiasInscriptas.length < 5) {
            const nuevasDisponibles = materiasDisponibles.filter(m => m.id !== materia.id);
            setMateriasDisponibles(nuevasDisponibles);
            setMateriasInscriptas([...materiasInscriptas, materia]);
            alert(`✅ Te has matriculado correctamente en ${materia.materia}`);
        } else if (materiasInscriptas.length >= 5) {
            alert("❌ Has alcanzado el límite máximo de 5 materias por cuatrimestre");
        }
    };

    const desinscribirMateria = (materia) => {
        const nuevasInscriptas = materiasInscriptas.filter(m => m.id !== materia.id);
        setMateriasInscriptas(nuevasInscriptas);
        const materiaActualizada = { ...materia, cupos: (materia.cupos || 0) + 1 };
        setMateriasDisponibles([...materiasDisponibles, materiaActualizada]);
        alert(`❌ Te has desmatriculado de ${materia.materia}`);
    };

    const materiasFiltradas = materiasDisponibles.filter(materia =>
        materia.materia.toLowerCase().includes(filtro.toLowerCase()) ||
        materia.profesor.toLowerCase().includes(filtro.toLowerCase())
    );

    const columnasDisponibles = [
        { 
            key: "materia", 
            header: "Materia"
        },
        { 
            key: "profesor", 
            header: "Profesor" 
        },
        { 
            key: "horario", 
            header: "Horario"
        },
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    className={`btn-matricular ${!fila.disponible ? 'btn-disabled' : ''}`}
                    onClick={() => inscribirMateria(fila)}
                    disabled={!fila.disponible || materiasInscriptas.length >= 5}
                >
                    {fila.disponible ? 'Matricularse' : 'Sin cupos'}
                </button>
            )
        }
    ];

    const columnasInscriptas = [
        { 
            key: "materia", 
            header: "Materia"
        },
        { 
            key: "profesor", 
            header: "Profesor" 
        },
        { 
            key: "horario", 
            header: "Horario"
        },
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    className="btn-desmatricular"
                    onClick={() => desinscribirMateria(fila)}
                >
                    Desmatricularse
                </button>
            )
        }
    ];

    return (
        <div className="matriculacion-container">
            <header className="matriculacion-header">
                <h1 className="matriculacion-title">Matriculación</h1>
                <div className="info-badge">
                    <span className="badge-text">Período Activo</span>
                </div>
            </header>
            
            <section className="info-section">
                <div className="info-card">
                    <h3>📋 Información Importante</h3>
                    <ul className="info-list">
                        <li>Período de matriculación: 15/02/2025 - 28/02/2025</li>
                        <li>Máximo de materias por cuatrimestre: 5 materias</li>
                        <li>Verificar correlatividades antes de matricularte</li>
                    </ul>
                </div>
            </section>

            <section className="inscripciones-section">
                <div className="section-card">
                    <h2>Tus Materias Matriculadas</h2>
                    <TablaReutilizable
                        datos={materiasInscriptas}
                        columnas={columnasInscriptas}
                        loading={loading}
                        vacioMensaje="No tienes materias matriculadas para este cuatrimestre"
                    />
                </div>
            </section>

            <section className="disponibles-section">
                <div className="section-card">
                    <div className="section-header">
                        <h2>Materias Disponibles para Matriculación</h2>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Buscar materia o profesor..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    <TablaReutilizable
                        datos={materiasFiltradas}
                        columnas={columnasDisponibles}
                        loading={loading}
                        vacioMensaje="No hay materias disponibles para matriculación"
                    />
                </div>
            </section>
        </div>
    );
};

export default Matriculacion;