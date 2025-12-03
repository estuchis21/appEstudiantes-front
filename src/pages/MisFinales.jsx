import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { getFinalExamsTaken } from "../services/finalsService";
import "../Styles/MisFinales.css";

const MisFinales = () => {
  const [finalesRendidos, setFinalesRendidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [carrera, setCarrera] = useState(null);

  // 🔹 Carga usuario y carrera desde LocalStorage al montar
  useEffect(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("userData"));
      const savedCarrera = JSON.parse(localStorage.getItem("careerData"));

      console.log("Usuario cargado:", savedUser);
      console.log("Carrera cargada:", savedCarrera);


      if (!savedUser || !savedCarrera) {
        setError("Debes iniciar sesión nuevamente");
        return;
      }

      setUsuario(savedUser);
      setCarrera(savedCarrera);
    } catch {
      setError("Error leyendo datos almacenados.");
    }
  }, []);

  // 🔹 Carga finales una vez que usuario y carrera existen
  useEffect(() => {
    if (!usuario || !carrera) return;

    const cargarFinales = async () => {
      try {
        setCargando(true);
        setError("");

        const res = await getFinalExamsTaken(usuario.Permiso, carrera.Codigo);
        setFinalesRendidos(res || []);
        console.log("Finales rendidos:", res);
      } catch (err) {
        setError("Error al cargar los finales: " + err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarFinales();
  }, [usuario, carrera]);

  const finalesPorAnio = finalesRendidos.reduce((acc, final) => {
    const año = final.Ano;
    acc[año] = acc[año] || [];
    acc[año].push(final);
    return acc;
  }, {});

  const añosOrdenados = Object.keys(finalesPorAnio).sort((a, b) => b - a);

  const obtenerAñoMateria = (codigo) => {
    const x = codigo % 1000;
    if (x >= 100 && x < 200) return "1er Año";
    if (x >= 200 && x < 300) return "2do Año";
    if (x >= 300 && x < 400) return "3er Año";
    if (x >= 400 && x < 500) return "4to Año";
    return "Otro";
  };

  if (cargando)
    return <div className="inscripcion-container"><div className="cargando">Cargando finales...</div></div>;

  if (error)
    return <div className="inscripcion-container"><div className="error">{error}</div></div>;

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-header">
        <h1>Mis Finales Rendidos</h1>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>Información del Estudiante</h3>
          <div className="info-list">
            <li><strong>Nombre:</strong> {usuario.Nombre}</li>
            <li><strong>Carrera:</strong> {carrera.Nombre}</li>
            <li><strong>Año Ingreso:</strong> {carrera.Ingreso}</li>
            <li><strong>Total rendidos:</strong> {finalesRendidos.length}</li>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {finalesRendidos.length > 0 && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{finalesRendidos.length}</span>
              <span className="stat-label">Total Finales</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {(finalesRendidos.reduce((s, f) => s + parseFloat(f.Nota), 0) / finalesRendidos.length).toFixed(1)}
              </span>
              <span className="stat-label">Promedio</span>
            </div>
          </div>
        </div>
      )}

      {/* Finales por Año */}
      {añosOrdenados.map(año => (
        <div key={año} className="inscripciones-section">
          <div className="section-card">
            <h2><FaCalendarAlt /> Año {año}</h2>

            <div className="mesas-grid">
              {finalesPorAnio[año].map((final) => (
                <div key={final.Codigo} className="mesa-card">

                  <div className="mesa-header">
                    <h3>{final.Materia}</h3>
                  </div>

                  <div className="mesa-info">
                    <div className="info-item">
                      <strong>Año cursada:</strong> {obtenerAñoMateria(final.Codigo)}
                    </div>

                    <span className={`nota ${final.Nota >= 4 ? "nota-aprobada" : "nota-desaprobada"}`}>
                      {final.Nota}
                    </span>

                    <div className="info-item">
                      <strong>Estado:</strong>
                      <span className={`estado ${final.Nota >= 4 ? "estado-aprobado" : "estado-desaprobado"}`}>
                        {final.Nota >= 4 ? "Aprobado" : "Desaprobado"}
                      </span>
                    </div>

                    <div className="info-item">
                      <strong>Modalidad:</strong> {final.Libre === "1" ? "Libre" : "Regular"}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {finalesRendidos.length === 0 && (
        <div className="inscripciones-section">
          <div className="section-card no-results">
            <h3>No hay finales rendidos</h3>
            <p>Cuando rindas, aparecerán aquí 🙂</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisFinales;
