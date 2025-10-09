import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import Popup from "../components/Popup";
import '../Styles/Finales.css';

const InscripcionFinales = () => {
    const [materiasDisponibles, setMateriasDisponibles] = useState([]);
    const [materiasInscriptas, setMateriasInscriptas] = useState([]);
    const [showInscripcionPopup, setShowInscripcionPopup] = useState(false);
    const [showDesinscripcionPopup, setShowDesinscripcionPopup] = useState(false);
    const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        setTimeout(() => {
            setMateriasDisponibles([
                { 
                    id: 1, 
                    materia: "Matemática I", 
                    profesor: "Dr. García", 
                    fecha: "15/12/2024", 
                    horario: "09:00",
                    aula: "A-201",
                    cupos: 5,
                    disponible: true
                },
                { 
                    id: 2, 
                    materia: "Álgebra", 
                    profesor: "Mg. López", 
                    fecha: "18/12/2024", 
                    horario: "14:00",
                    aula: "B-105",
                    cupos: 3,
                    disponible: true
                },
                { 
                    id: 3, 
                    materia: "Geometría", 
                    profesor: "Lic. Martínez", 
                    fecha: "20/12/2024", 
                    horario: "10:30",
                    aula: "C-302",
                    cupos: 0,
                    disponible: false
                },
                { 
                    id: 4, 
                    materia: "Pedagogía", 
                    profesor: "Dra. Rodríguez", 
                    fecha: "22/12/2024", 
                    horario: "16:00",
                    aula: "A-101",
                    cupos: 8,
                    disponible: true
                }
            ]);

            setMateriasInscriptas([
                { 
                    id: 5, 
                    materia: "Historia de la Educación", 
                    profesor: "Prof. González", 
                    fecha: "12/12/2024", 
                    horario: "11:00",
                    aula: "D-205"
                }
            ]);
            
            setLoading(false);
        }, 1000);
    }, []);

    const inscribirMateria = (materia) => {
        if (materia.cupos > 0 && materiasInscriptas.length < 3) {
            const nuevasDisponibles = materiasDisponibles.filter(m => m.id !== materia.id);
            setMateriasDisponibles(nuevasDisponibles);
            setMateriasInscriptas([...materiasInscriptas, materia]);
        }
    };

    const desinscribirMateria = (materia) => {
        const nuevasInscriptas = materiasInscriptas.filter(m => m.id !== materia.id);
        setMateriasInscriptas(nuevasInscriptas);
        const materiaActualizada = { ...materia, cupos: (materia.cupos || 0) + 1 };
        setMateriasDisponibles([...materiasDisponibles, materiaActualizada]);
    };

    const handleInscripcionClick = (materia) => {
        setMateriaSeleccionada(materia);
        setShowInscripcionPopup(true);
    };

    const handleDesinscripcionClick = (materia) => {
        setMateriaSeleccionada(materia);
        setShowDesinscripcionPopup(true);
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
            key: "fecha", 
            header: "Fecha y Hora",
            render: (fila) => `${fila.fecha} - ${fila.horario}`
        },
        {/*
        { 
            key: "cupos", 
            header: "Cupos",
            render: (fila) => (
                <span className={`cupos ${fila.cupos === 0 ? 'sin-cupos' : fila.cupos < 3 ? 'pocos-cupos' : ''}`}>
                    {fila.cupos > 0 ? fila.cupos : "0"}
                </span>
            )
        },     
        */},
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    className={`btn-inscribir ${!fila.disponible ? 'btn-disabled' : ''}`}
                    onClick={() => handleInscripcionClick(fila)}
                    disabled={!fila.disponible || materiasInscriptas.length >= 3}
                >
                    {fila.disponible ? 'Inscribirse' : 'Sin cupos'}
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
            key: "fecha", 
            header: "Fecha y Hora",
            render: (fila) => `${fila.fecha} - ${fila.horario}`
        },
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    className="btn-desinscribir"
                    onClick={() => handleDesinscripcionClick(fila)}
                >
                    Desinscribirse
                </button>
            )
        }
    ];

    return (
        <div className="inscripcion-container">
            <header className="inscripcion-header">
                <h1>Inscripción a Finales</h1>
                <div className="info-badge">
                    <span className="badge-text">Período activo</span>
                </div>
            </header>
            
            <section className="info-section">
                <div className="info-card">
                    <h3>Información Importante</h3>
                    <ul className="info-list">
                        <li>Período de inscripción: 01/12/2024 - 10/12/2024</li>
                        <li>Máximo de materias por período: 3 materias</li>
                        <li>Las inscripciones son sujetas a disponibilidad de cupos</li>
                    </ul>
                </div>
            </section>

            <section className="inscripciones-section">
                <div className="section-card">
                    <h2>Tus Inscripciones Actuales</h2>
                    <TablaReutilizable
                        datos={materiasInscriptas}
                        columnas={columnasInscriptas}
                        loading={loading}
                        vacioMensaje="No tienes materias inscriptas para finales"
                    />
                </div>
            </section>

            <section className="disponibles-section">
                <div className="section-card">
                    <div className="section-header">
                        <h2>Materias Disponibles para Finales</h2>
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
                        vacioMensaje="No hay materias disponibles para finales"
                    />
                </div>
            </section>

            {/* Popup para Inscripción */}
            {showInscripcionPopup && materiaSeleccionada && (
                <Popup
                    mensaje={`¿Deseas inscribirte a ${materiaSeleccionada.materia}?`}
                    textoAceptar="Sí, inscribirme"
                    textoCancelar="Cancelar"
                    onAceptar={() => {
                        inscribirMateria(materiaSeleccionada);
                        setShowInscripcionPopup(false);
                        setMateriaSeleccionada(null);
                    }}
                    onCancelar={() => {
                        setShowInscripcionPopup(false);
                        setMateriaSeleccionada(null);
                    }}
                    tipo="confirmacion"
                />
            )}

            {/* Popup para Desinscripción */}
            {showDesinscripcionPopup && materiaSeleccionada && (
                <Popup
                    mensaje={`¿Estás seguro que deseas desinscribirte de ${materiaSeleccionada.materia}?`}
                    textoAceptar="Sí, desinscribirme"
                    textoCancelar="Cancelar"
                    onAceptar={() => {
                        desinscribirMateria(materiaSeleccionada);
                        setShowDesinscripcionPopup(false);
                        setMateriaSeleccionada(null);
                    }}
                    onCancelar={() => {
                        setShowDesinscripcionPopup(false);
                        setMateriaSeleccionada(null);
                    }}
                    tipo="confirmacion"
                />
            )}
        </div>
    );
};

export default InscripcionFinales;