import React, { useState, useEffect } from "react";
import { getNotifications } from "../services/notificationsService";
import { getFinalExamsByStudentAndCareer } from "../services/finalsService";
import { FaCalendarDays } from "react-icons/fa6";
import { FaClock } from "react-icons/fa";

const HomeUser = () => {
  const [usuario, setUsuario] = useState({});
  const [proximosFinales, setProximosFinales] = useState([]);
  const [noticias, setNoticias] = useState([]);
  const [carreraInfo, setCarreraInfo] = useState({
    nombre: "",
    codigo: ""
  });

  // Función para darle formato al nombre de la carrera
  function formatCarreraName(nombre) {
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) =>
        palabrasMin.includes(palabra)
          ? palabra
          : palabra.charAt(0).toUpperCase() + palabra.slice(1)
      )
      .join(" ");
  }

  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    const permiso = localStorage.getItem("permiso");
    const codigoCarrera = localStorage.getItem("codigoCarrera");
    const nombreCarrera = localStorage.getItem("nombreCarrera");

    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
      
      // Establecer información de la carrera desde localStorage
      if (nombreCarrera && codigoCarrera) {
        setCarreraInfo({
          nombre: formatCarreraName(nombreCarrera),
          codigo: codigoCarrera
        });
      }

      //console.log("Permiso del usuario:", permiso);
      //console.log("Código carrera:", codigoCarrera);

      // Obtener notificaciones
      const fetchNotifications = async () => {
        try {
          const notificaciones = await getNotifications(permiso);
          //console.log("Notificaciones obtenidas:", notificaciones);
          
          // TRANSFORMAR LOS DATOS A LA ESTRUCTURA CORRECTA
          const noticiasTransformadas = notificaciones.map(noticia => ({
            titulo: new Date(noticia.Fecha).toLocaleDateString('es-ES'),
            contenido: noticia.Notificaciones,
            importante: true
          }));
          
          setNoticias(noticiasTransformadas);
          //console.log("Noticias transformadas:", noticiasTransformadas);
        } catch (err) {
          console.error("Error al obtener notificaciones:", err);
        }
      };

      // Obtener próximos finales usando el servicio
      const fetchProximosFinales = async () => {
        if (permiso && codigoCarrera) {
          try {
            const finales = await getFinalExamsByStudentAndCareer(permiso, codigoCarrera);
            //console.log("Finales obtenidos:", finales);
            
            // Filtrar solo los finales disponibles (no inscriptos) y transformarlos
            const finalesProximos = finales
              .filter(final => final.Inscripto === 0) // Solo finales disponibles
              .slice(0, 3) // Limitar a 3 finales próximos
              .map(final => ({
                materia: final.Abreviatura,
                fecha: final.Fecha,
                horario: final.Hora,
                aula: final.Lugar,
                profesor: final.Titular
              }));
            
            setProximosFinales(finalesProximos);
            //console.log("Próximos finales procesados:", finalesProximos);
          } catch (error) {
            console.error("Error al obtener los finales:", error);
            // En caso de error, mantener los datos de ejemplo
            setProximosFinales([
              { materia: "Programación orientada a objetos", fecha: "15/12/2024", horario: "09:00", aula: "A-201" },
              { materia: "Inglés Técnico XVII", fecha: "18/12/2024", horario: "14:00", aula: "B-105" }
            ]);
          }
        } else {
          // Datos de ejemplo si no hay permiso o código de carrera
          setProximosFinales([
            { materia: "Programación orientada a objetos", fecha: "15/12/2024", horario: "09:00", aula: "A-201" },
            { materia: "Inglés Técnico XVII", fecha: "18/12/2024", horario: "14:00", aula: "B-105" }
          ]);
        }
      };

      fetchNotifications();
      fetchProximosFinales();
    }
  }, []);

  return (
    <div className="home-user-container">
      <div className="home-user-header">
        <h1>Bienvenido, {usuario.Nombre}</h1>
        <p className="user-email">{usuario.Correo}</p>
        <div className="user-info-container">
          <div className="user-info-card">
            <strong>Carrera:</strong> {carreraInfo.nombre || usuario.Carrera || "No disponible"}
          </div>
        </div>
      </div>

      <div className="home-user-grid">
        <div className="home-user-column">
          <div className="home-user-card">
            <h2>Próximos Finales</h2>
            {proximosFinales.length > 0 ? (
              proximosFinales.map((final, index) => (
                <div key={index} className="final-item">
                  <strong>{final.materia}</strong>
                  <p className="final-info">
                    <FaCalendarDays /> {final.fecha} - <FaClock /> {final.horario}
                  </p>
                  <p className="final-aula">Aula: {final.aula}</p>
                  {final.profesor && (
                    <p className="final-profesor">Profesor: {final.profesor}</p>
                  )}
                </div>
              ))
            ) : (
              <p>No hay finales próximos disponibles.</p>
            )}
          </div>
        </div>

        <div className="home-user-column">
          <div className="home-user-card">
            <h2>Noticias y Avisos</h2>
            {noticias.length > 0 ? (
              noticias.map((noticia, index) => (
                <div key={index} className={`noticia-item ${noticia.importante ? "noticia-importante" : ""}`}>
                  <div className="noticia-header">
                    <strong>{noticia.titulo}</strong>
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