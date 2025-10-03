import React, { useState, useEffect } from "react";
import { getNotifications } from "../services/notificationsService";

const HomeUser = () => {
  const [usuario, setUsuario] = useState({});
  const [proximosFinales, setProximosFinales] = useState([]);
  const [noticias, setNoticias] = useState([]);

    useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
        const permiso = usuarioGuardado.Permiso;
        console.log("Permiso del usuario:", permiso);

        // Obtener notificaciones
        const fetchNotifications = async () => {
        try {
            const notificaciones = await getNotifications(permiso);
            setNoticias(notificaciones);
            console.log("Notificaciones obtenidas:", notificaciones);
        } catch (err) {
            console.error("Error al obtener notificaciones:", err);
        }
        };

        fetchNotifications(); 
    }

    // Datos de ejemplo para próximos finales
    setProximosFinales([
        { materia: "Programacion orientada a objetos", fecha: "15/12/2024", horario: "09:00", aula: "A-201" },
        { materia: "Ingles Tecnico XVII", fecha: "18/12/2024", horario: "14:00", aula: "B-105" }
    ]);
    }, []);


  return (
    <div className="home-user-container">
      <div className="home-user-header">
        <h1>Bienvenido, {usuario.Nombre}</h1>
        <p className="user-email">{usuario.Correo}</p>
        <div className="user-info-container">
          <div className="user-info-card">
            <strong>Carrera:</strong> {usuario.Carrera || "No disponible"}
          </div>
        </div>
      </div>

      <div className="home-user-grid">
        <div className="home-user-column">
          <div className="home-user-card">
            <h2>📝 Próximos Finales</h2>
            {proximosFinales.map((final, index) => (
              <div key={index} className="final-item">
                <strong>{final.materia}</strong>
                <p className="final-info">📅 {final.fecha} - 🕒 {final.horario}</p>
                <p className="final-aula">Aula: {final.aula}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="home-user-column">
          <div className="home-user-card">
            <h2>📢 Noticias y Avisos</h2>
            {noticias.length > 0 ? (
              noticias.map((noticia, index) => (
                <div key={index} className={`noticia-item ${noticia.importante ? "noticia-importante" : ""}`}>
                  <div className="noticia-header">
                    <strong>{noticia.titulo}</strong>
                    <span className="noticia-fecha">{noticia.fecha}</span>
                  </div>
                  <p className="noticia-contenido">{noticia.contenido}</p>
                </div>
              ))
            ) : (
              <p>No hay notificaciones.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
