import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import CareerSelector from "../components/CareerSelector";
import { getFinalExamsTaken } from "../services/finalsService";
import "../Styles/MisFinales.css";

const MisFinales = () => {
  const [finalesRendidos, setFinalesRendidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [carrerasGuardadas, setCarrerasGuardadas] = useState([]);
  const [carreraActiva, setCarreraActiva] = useState(null);

  /** Cargar usuario y carreras guardadas */
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      const careerData = JSON.parse(localStorage.getItem("careerData")) || [];
      const careersArray = Array.isArray(careerData) ? careerData : [careerData];

      if (!user) return setError("No se encontró usuario");
      if (!careersArray.length) return setError("No hay carreras asociadas");

      setUsuario(user);
      setCarrerasGuardadas(careersArray);
      setCarreraActiva(careersArray[0]);
    } catch {
      setError("Error al leer datos guardados");
      setCargando(false);
    }
  }, []);

  /** Detectar cambio externo de carrera */
  useEffect(() => {
    const syncCareer = () => {
      const nueva = JSON.parse(localStorage.getItem("careerData"));
      if (nueva && nueva?.Codigo !== carreraActiva?.Codigo) {
        setCarreraActiva(nueva);
      }
    };
  }, [carreraActiva]);

  /** Cargar finales */
  useEffect(() => {
    if (!usuario || !carreraActiva) return;

    const cargarFinales = async () => {
      try {
        setCargando(true);
        const res = await getFinalExamsTaken(usuario.Permiso, carreraActiva.Codigo);
        const data = Array.isArray(res) ? res : res?.data ?? [];
        setFinalesRendidos(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error cargando finales: " + err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarFinales();
  }, [usuario, carreraActiva]);

  if (cargando) return <div className="inscripcion-container"><div className="cargando">Cargando finales...</div></div>;
  if (error) return <div className="inscripcion-container"><div className="error">{error}</div></div>;

  /** 📌 Agrupación por año */
  const finalesPorAnio = finalesRendidos.reduce((acc, f) => {
    (acc[f.Ano] = acc[f.Ano] || []).push(f);
    return acc;
  }, {});
  const añosOrdenados = Object.keys(finalesPorAnio).sort((a, b) => b - a);

  /** Determinar año por código de materia */
  const obtenerAñoMateria = (codigo) => {
    const x = codigo % 1000;
    if (x >= 100 && x < 200) return "1er Año";
    if (x >= 200 && x < 300) return "2do Año";
    if (x >= 300 && x < 400) return "3er Año";
    if (x >= 400 && x < 500) return "4to Año";
    return "Otro";
  };

  return (
    <div className="inscripcion-container">

      <div className="inscripcion-header">
        <h1>Mis Finales Rendidos</h1>
      </div>

      {/* SELECTOR DE CARRERA ARRIBA (FUNCIONAL Y SIN TOCAR ESTILOS) */}
      {carrerasGuardadas.length > 1 && (
        <div className="career-switcher">
          <label><strong>Carrera:</strong></label>
          <select
            value={carreraActiva?.Codigo}
            onChange={(e)=>{
              const nuevaCarrera = carrerasGuardadas.find(c => c.Codigo === Number(e.target.value));
              setCarreraActiva(nuevaCarrera);
              localStorage.setItem("careerData", JSON.stringify(nuevaCarrera));
            }}
          >
            {carrerasGuardadas.map(c => (
              <option key={c.Codigo} value={c.Codigo}>
                {c.Nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Se mantiene tu CareerSelector intacto */}
      {carrerasGuardadas.length > 1 && <CareerSelector/>}

      <div className="info-section">
        <div className="info-card">
          <h3>Información del Estudiante</h3>
          <ul className="info-list">
            <li><strong>Nombre:</strong> {usuario?.Nombre}</li>
            <li><strong>Carrera:</strong> {carreraActiva?.Nombre}</li>
            <li><strong>Año ingreso:</strong> {carreraActiva?.Ingreso}</li>
            <li><strong>Total rendidos:</strong> {finalesRendidos.length}</li>
          </ul>
        </div>
      </div>

      {finalesRendidos.length > 0 && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{finalesRendidos.length}</span>
              <span className="stat-label">Total finales</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {(finalesRendidos.reduce((s,f)=>s+parseFloat(f.Nota||0),0)/finalesRendidos.length).toFixed(1)}
              </span>
              <span className="stat-label">Promedio</span>
            </div>
          </div>
        </div>
      )}

      {añosOrdenados.map(año => (
        <div key={año} className="inscripciones-section">
          <div className="section-card">
            <h2><FaCalendarAlt/> Año {año}</h2>
            <div className="mesas-grid">
              {finalesPorAnio[año].map(final => (
                <div key={final.Codigo} className="mesa-card">
                  <div className="mesa-header"><h3>{final.Materia}</h3></div>
                  <div className="mesa-info">
                    <div className="info-item"><strong>Año cursada:</strong> {obtenerAñoMateria(final.Codigo)}</div>
                    <span className={`nota ${final.Nota>=4 ? "nota-aprobada":"nota-desaprobada"}`}>{final.Nota}</span>
                    <div className="info-item"><strong>Estado:</strong>
                      <span className={`estado ${final.Nota>=4?"estado-aprobado":"estado-desaprobado"}`}>
                        {final.Nota>=4 ? "Aprobado" : "Desaprobado"}
                      </span>
                    </div>
                    <div className="info-item"><strong>Modalidad:</strong> {final.Libre==="1"?"Libre":"Regular"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {finalesRendidos.length===0 && (
        <div className="inscripciones-section">
          <div className="section-card no-results">
            <h3>No hay finales rendidos</h3>
            <p>Cuando rindas aparecerán aquí</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default MisFinales;
