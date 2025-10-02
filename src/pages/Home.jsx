import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookBookmark, FaSchoolFlag, FaUserGraduate, FaEnvelope } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import {FaMapMarkedAlt, FaPhone } from "react-icons/fa";



const Home = () => {
    const navigate = useNavigate();

    const secciones = [
        {
            titulo: <><FaBookBookmark /> Carreras</>,
            descripcion: "Descubrí nuestra amplia oferta académica y encontrá la carrera perfecta para vos",
            imagen: "/src/assets/img/carreras.jpg",
            accion: () => navigate('/carreras')
        },
        {
            titulo: <><FaSchoolFlag /> Institución</>,
            descripcion: "Conocé nuestra historia, misión, visión y valores institucionales",
            imagen: "/src/assets/img/institucion.jpg",
            accion: () => navigate('/institucion')
        },
        {
            titulo: <><FaUserGraduate /> Estudiantes</>,
            descripcion: "Información importante para estudiantes actuales y futuros",
            imagen: "/src/assets/img/estudiantes.jpg",
            accion: () => navigate('/estudiantes')
        },
        {
            titulo: <><FaEnvelope /> Contáctenos</>,
            descripcion: "Comunicate con nosotros, estamos para ayudarte",
            imagen: "/src/assets/img/contacto.jpg",
            accion: () => navigate('/contacto')
        }
    ];
    const features = [
        {
            icon: "🎓",
            titulo: "Educación de Calidad",
            descripcion: "Más de 50 años formando profesionales"
        },
        {
            icon: "👨‍🏫",
            titulo: "Docentes Capacitados",
            descripcion: "Cuerpo docente altamente calificado"
        },
        {
            icon: "🏫",
            titulo: "Infraestructura Moderna",
            descripcion: "Instalaciones equipadas para tu aprendizaje"
        },
        {
            icon: "🤝",
            titulo: "Inserción Laboral",
            descripcion: "Convenios con empresas e instituciones"
        }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        INSTITUTO SUPERIOR de FORMACIÓN DOCENTE y TÉCNICA N°20
                    </h1>
                    <p className="hero-subtitle">
                        Continuar creando condiciones de posibilidad para construir lo común, reconociéndonos en un mismo proyecto formativo.
                        Formando profesionales desde 1968.
                    </p>
                    <button 
                        className="cta-button"
                        onClick={() => navigate('/carreras')}
                    >
                        Ver Carreras Disponibles
                    </button>
                </div>
                <div className="hero-image">
                    <img 
                        src="/src/assets/img/Instituto.jpg" 
                        alt="Instituto N°20" 
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">¿Por qué elegirnos?</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.titulo}</h3>
                            <p className="feature-desc">{feature.descripcion}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Secciones Principales */}
            <section className="secciones-section">
                <h2 className="section-title">Explorá Nuestra Institución</h2>
                <div className="secciones-grid">
                    {secciones.map((seccion, index) => (
                        <div 
                            key={index} 
                            className="seccion-card"
                            onClick={seccion.accion}
                        >
                            <div className="seccion-content">
                                <h3 className="seccion-title">{seccion.titulo}</h3>
                                <p className="seccion-desc">{seccion.descripcion}</p>
                                <button className="seccion-button">
                                    Ver más ›
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>¿Listo para comenzar tu futuro?</h2>
                    <p>Inscribite ahora y formá parte de nuestra comunidad educativa</p>
                    <div className="cta-buttons">
                        <button 
                            className="cta-primary"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            className="cta-secondary"
                            onClick={() => navigate('/contacto')}
                        >
                            Más Información
                        </button>
                    </div>
                </div>
            </section>

            {/* Información de Contacto Rápida */}
            <section className="contacto-rapido">
                <div className="contacto-item">
                    <span className="contacto-icon"><FaPhone /></span>
                    <div>
                        <h4>Teléfono</h4>
                        <p>(0236) 4443371</p>
                    </div>
                </div>
                <div className="contacto-item">
                    <span className="contacto-icon"><SiGmail /></span>
                    <div>
                        <h4>Email</h4>
                        <p>i20estudiantes@gmail.com</p>
                    </div>
                </div>
                <div className="contacto-item">
                    <span className="contacto-icon"><FaMapMarkedAlt /></span>
                    <div>
                        <h4>Dirección</h4>
                        <p>Almafuerte 300, Junín</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;