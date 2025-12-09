import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import CareerSelector from "../components/CareerSelector"; // ⬅⬅ AGREGADO SIN ROMPER NADA
import { getFinalExamsByStudentAndCareer } from "../services/finalsService";
import { getNotifications } from "../services/notificationsService";

const HomeUser = () => {
  const [usuario, setUsuario] = useState({});
  const [proximosFinales, setProximosFinales] = useState([]);
  const [noticias, setNoticias] = useState([]);

  const [carreras, setCarreras] = useState([]);
  const [carreraActiva, setCarreraActiva] = useState(null);

  const formatCarreraName = (nombre) => {
    if (!nombre) return "";
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((p) => (palabrasMin.includes(p) ? p : p[0].toUpperCase() + p.slice(1)))
      .join(" ");
  };

  useEffect(() => {

    const usuarioGuardado = JSON.parse(localStorage.getItem("userData"));
    let carrerasGuardadas = JSON.parse(localStorage.getItem("careerData")) || [];

    if (!Array.isArray(carrerasGuardadas)) {
      carrerasGuardadas = [carrerasGuardadas];
    }

    setUsuario(usuarioGuardado || {});
    setCarreras(carrerasGuardadas); 

    const carreraSeleccionada = carrerasGuardadas[0] || null;
    setCarreraActiva(carreraSeleccionada);

    const permiso = usuarioGuardado?.Permiso;
    const codigoCarrera = carreraSeleccionada?.Codigo;

    const fetchNotifications = async () => {
      if (!permiso) return;

      try {
        const notificaciones = await getNotifications(permiso);

        const noticiasTransformadas = notificaciones.map(n => ({
          titulo: new Date(n.Fecha).toLocaleDateString("es-ES"),
          contenido: n.Notificaciones,
          importante: true
        }));

        setNoticias(noticiasTransformadas);

      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };

    const fetchProximosFinales = async () => {
      if (!permiso || !codigoCarrera) return;

      try {
        const finales = await getFinalExamsByStudentAndCareer(permiso, codigoCarrera);

        const finalesProximos = finales
          .filter(f => f.Inscripto === 0)
          .slice(0, 3)
          .map(f => ({
            materia: f.Abreviatura,
            fecha: f.Fecha,
            horario: f.Hora,
            aula: f.Lugar,
            profesor: f.Titular
          }));

        setProximosFinales(finalesProximos);

      } catch (err) {
        console.error("Error en finales:", err);
      }
    };

    fetchNotifications();
    fetchProximosFinales();
  }, []);

  return (
    <div className="home-user-container">

      <CareerSelector />  

      <div className="home-user-header">
        <h1>Bienvenido, {usuario.Nombre}</h1>
        <p className="user-email">{usuario.Correo}</p>

        <div className="user-info-container">
          <div className="user-info-card">
            <strong>Carrera:</strong>{" "}
            {carreraActiva ? formatCarreraName(carreraActiva.Nombre) : "No asignada"}
          </div>
        </div>
      </div>

      <div className="home-user-grid">
        <div className="home-user-column">
          <div className="home-user-card">
            <h2>Próximos Finales</h2>

            {proximosFinales.length > 0 ? (
              proximosFinales.map((final, i) => (
                <div key={i} className="final-item">
                  <strong>{final.materia}</strong>
                  <p className="final-info">
                    <FaCalendarDays /> {final.fecha} — <FaClock /> {final.horario}
                  </p>
                  <p className="final-aula">Aula: {final.aula}</p>
                  {final.profesor && <p className="final-profesor">Profesor: {final.profesor}</p>}
                </div>
              ))
            ) : (
              <p>No hay finales próximos.</p>
            )}
          </div>
        </div>

        <div className="home-user-column">
          <div className="home-user-card">
            <h2>Noticias y Avisos</h2>

            {noticias.length > 0 ? (
              noticias.map((n, i) => (
                <div key={i} className={`noticia-item ${n.importante ? "noticia-importante" : ""}`}>
                  <strong>{n.titulo}</strong>
                  <p>{n.contenido}</p>
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
