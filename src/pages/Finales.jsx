import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";

const InscripcionFinales = () => {
    const [materiasDisponibles, setMateriasDisponibles] = useState([]);
    const [materiasInscriptas, setMateriasInscriptas] = useState([]);
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
        if (materia.cupos > 0) {
            const nuevasDisponibles = materiasDisponibles.filter(m => m.id !== materia.id);
            setMateriasDisponibles(nuevasDisponibles);
            setMateriasInscriptas([...materiasInscriptas, materia]);
            alert(`✅ Te has inscripto correctamente a ${materia.materia}`);
        }
    };

    const desinscribirMateria = (materia) => {
        const nuevasInscriptas = materiasInscriptas.filter(m => m.id !== materia.id);
        setMateriasInscriptas(nuevasInscriptas);
        const materiaActualizada = { ...materia, cupos: materia.cupos - 1 };
        setMateriasDisponibles([...materiasDisponibles, materiaActualizada]);
        alert(`❌ Te has desinscripto de ${materia.materia}`);
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
        { 
            key: "aula", 
            header: "Aula"
        },
        { 
            key: "cupos", 
            header: "Cupos",
            render: (fila) => fila.cupos > 0 ? fila.cupos : "Sin cupos"
        },
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    onClick={() => inscribirMateria(fila)}
                    disabled={!fila.disponible}
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
            key: "aula", 
            header: "Aula"
        },
        { 
            key: "acciones", 
            header: "Acciones",
            render: (fila) => (
                <button
                    onClick={() => desinscribirMateria(fila)}
                >
                    Desinscribirse
                </button>
            )
        }
    ];

    return (
        <div>
            <h1>Inscripción a Finales</h1>
            
            <div>
                <h3>Información Importante</h3>
                <p>• Período de inscripción: 01/12/2024 - 10/12/2024</p>
                <p>• Máximo de materias por período: 3 materias</p>
            </div>

            <section>
                <h2>Tus Inscripciones Actuales</h2>
                <TablaReutilizable
                    datos={materiasInscriptas}
                    columnas={columnasInscriptas}
                    loading={loading}
                    vacioMensaje="No tienes materias inscriptas para finales"
                />
            </section>

            <section>
                <h2>Materias Disponibles para Finales</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Buscar materia o profesor..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                </div>
                
                <TablaReutilizable
                    datos={materiasFiltradas}
                    columnas={columnasDisponibles}
                    loading={loading}
                    vacioMensaje="No hay materias disponibles para finales"
                />
            </section>

            <div>
                <div>
                    <span>{materiasInscriptas.length}</span>
                    <span>Materias Inscriptas</span>
                </div>
                <div>
                    <span>{materiasDisponibles.filter(m => m.disponible).length}</span>
                    <span>Materias Disponibles</span>
                </div>
                <div>
                    <span>3</span>
                    <span>Límite de Inscripciones</span>
                </div>
            </div>
        </div>
    );
};

export default InscripcionFinales;