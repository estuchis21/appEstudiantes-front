import React, { useState, useEffect } from "react";

const HomeUser = () => {
    const [usuario, setUsuario] = useState({});
    const [proximosFinales, setProximosFinales] = useState([]);

    // Datos de ejemplo - luego los reemplazas con tu API
    useEffect(() => {
        // Simular datos del usuario
        setUsuario({
            nombre: "Usuario Ejemplo",
            carrera: "Desarrollo de Software",
            email: "CorreoDelUser@instituto20.edu.ar"
        });

        // Simular próximos finales
        setProximosFinales([
            { materia: "Programacion orientada a objetos", fecha: "15/12/2024", horario: "09:00", aula: "A-201" },
            { materia: "Ingles Tecnico XVII", fecha: "18/12/2024", horario: "14:00", aula: "B-105" }
        ]);
    }, []);

    const noticias = [
        {
            titulo: "Período de Inscripción a Finales",
            contenido: "El período de inscripción a exámenes finales del segundo cuatrimestre será del 01/12 al 10/12.",
            fecha: "25/11/2024",
            importante: true
        },
        {
            titulo: "Reunión de Estudiantes",
            contenido: "Se convoca a reunión general de estudiantes el día 05/12 a las 18:00 en el Salón de Actos.",
            fecha: "20/11/2024",
            importante: false
        },
        {
            titulo: "Biblioteca Ampliada",
            contenido: "La biblioteca extenderá su horario de atención hasta las 22:00 durante el período de exámenes.",
            fecha: "15/11/2024",
            importante: false
        }
    ];

    return (
        <div className="home-user-container">
            {/* Header de Bienvenida */}
            <div className="home-user-header">
                <h1>Bienvenido, {usuario.nombre}</h1>
                <p className="user-email">{usuario.email}</p>
                <div className="user-info-container">
                    <div className="user-info-card">
                        <strong>Carrera:</strong> {usuario.carrera}
                    </div>
                </div>
            </div>

            <div className="home-user-grid">
                {/* Columna Izquierda */}
                <div className="home-user-column">
                    {/* Próximos Finales */}
                    <div className="home-user-card">
                        <h2>📝 Próximos Finales</h2>
                        {proximosFinales.map((final, index) => (
                            <div key={index} className="final-item">
                                <strong>{final.materia}</strong>
                                <p className="final-info">
                                    📅 {final.fecha} - 🕒 {final.horario}
                                </p>
                                <p className="final-aula">Aula: {final.aula}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna Derecha */}
                <div className="home-user-column">
                    {/* Noticias y Avisos */}
                    <div className="home-user-card">
                        <h2>📢 Noticias y Avisos</h2>
                        {noticias.map((noticia, index) => (
                            <div 
                                key={index} 
                                className={`noticia-item ${noticia.importante ? 'noticia-importante' : ''}`}
                            >
                                <div className="noticia-header">
                                    <strong>{noticia.titulo}</strong>
                                    <span className="noticia-fecha">{noticia.fecha}</span>
                                </div>
                                <p className="noticia-contenido">{noticia.contenido}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeUser;