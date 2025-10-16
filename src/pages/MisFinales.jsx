import React, { useState, useEffect } from "react";
import { getFinalExamsTaken } from "../services/finalsService";
import "../Styles/Finales.css";

const MisFinales = () => {
  const [finalesRendidos, setFinalesRendidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [carrera, setCarrera] = useState(null);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = () => {
    try {
      const userDataStorage = localStorage.getItem("userData");

      if (userDataStorage) {
        const userData = JSON.parse(userDataStorage);
        setUsuario(userData.usuario);
        setCarrera(userData.carrera);
      } else {
        setError("No se encontraron datos de usuario. Por favor, inicie sesión nuevamente.");
      }
    } catch (error) {
      console.error("❌ Error cargando datos del usuario:", error);
      setError("Error al cargar los datos del usuario");
    }
  };

  useEffect(() => {
    if (usuario && carrera) {
      cargarFinalesRendidos();
    }
  }, [usuario, carrera]);

  const cargarFinalesRendidos = async () => {
    try {
      setCargando(true);
      setError("");

      const finalesRendidosData = await getFinalExamsTaken(
        usuario.Permiso,
        carrera.Codigo
      );
      setFinalesRendidos(finalesRendidosData || []);

    } catch (error) {
      console.error("❌ Error cargando finales rendidos:", error);
      setError("Error al cargar los finales rendidos: " + (error.message || "Error desconocido"));
    } finally {
      setCargando(false);
    }
  };

  // Agrupar finales por año
  const finalesPorAnio = finalesRendidos.reduce((acc, final) => {
    const año = final.Ano;
    if (!acc[año]) {
      acc[año] = [];
    }
    acc[año].push(final);
    return acc;
  }, {});

  const añosOrdenados = Object.keys(finalesPorAnio).sort((a, b) => b - a);

  const obtenerAñoMateria = (codigo) => {
    const ultimosTres = codigo % 1000;
    if (ultimosTres >= 100 && ultimosTres < 200) return "1er Año";
    if (ultimosTres >= 200 && ultimosTres < 300) return "2do Año";
    if (ultimosTres >= 300 && ultimosTres < 400) return "3er Año";
    if (ultimosTres >= 400 && ultimosTres < 500) return "4to Año";

    return "Otro";
  };

  if (cargando) {
    return (
      <div className="inscripcion-container">
        <div className="cargando">Cargando finales rendidos...</div>
      </div>
    );
  }

  if (error && !usuario) {
    return (
      <div className="inscripcion-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!usuario || !carrera) {
    return (
      <div className="inscripcion-container">
        <div className="error">
          No se pudieron cargar los datos del usuario. Por favor, inicie sesión nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="inscripcion-container">
      <div className="inscripcion-header">
        <h1>Mis Finales Rendidos</h1>
        <div className="info-badge">
          <span className="badge-text">
            {carrera.Nombre}
          </span>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>Información del Estudiante</h3>
          <div className="info-list">
            <li><strong>Nombre:</strong> {usuario.Nombre}</li>
            <li><strong>Carrera:</strong> {carrera.Nombre}</li>
            <li><strong>Año de ingreso:</strong> {carrera.Ingreso}</li>
            <li><strong>Total de finales rendidos:</strong> {finalesRendidos.length}</li>
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{finalesRendidos.length}</span>
            <span className="stat-label">Total Finales</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {finalesRendidos.filter(f => f.Nota >= 4).length}
            </span>
            <span className="stat-label">Aprobados</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {finalesRendidos.filter(f => f.Nota >= 8).length}
            </span>
            <span className="stat-label">Nota ≥ 8</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {(finalesRendidos.reduce((sum, f) => sum + parseFloat(f.Nota), 0) / finalesRendidos.length).toFixed(1)}
            </span>
            <span className="stat-label">Promedio</span>
          </div>
        </div>
      </div>

      {/* Finales agrupados por año */}
      {añosOrdenados.map(año => (
        <div key={año} className="inscripciones-section">
          <div className="section-card">
            <h2>📅 Año {año}</h2>
            <div className="mesas-grid">
              {finalesPorAnio[año].map((final) => (
                <div key={final.Codigo} className="mesa-card">
                  <div className="mesa-header">
                    <h3>{final.Materia}</h3>
                    <span className={`nota ${final.Nota >= 4 ? 'nota-aprobada' : 'nota-desaprobada'}`}>
                      {final.Nota}
                    </span>
                  </div>
                  
                  <div className="mesa-info">
                    <div className="info-item">
                      <strong>Año cursada:</strong>
                      <span>{obtenerAñoMateria(final.Codigo)}</span>
                    </div>
                    <div className="info-item">
                      <strong>Código:</strong>
                      <span>{final.Codigo}</span>
                    </div>
                    <div className="info-item">
                      <strong>Estado:</strong>
                      <span className={`estado ${final.Nota >= 4 ? 'estado-aprobado' : 'estado-desaprobado'}`}>
                        {final.Nota >= 4 ? "✅ Aprobado" : "❌ Desaprobado"}
                      </span>
                    </div>
                    <div className="info-item">
                      <strong>Modalidad:</strong>
                      <span>{final.Libre === "1" ? "Libre" : "Regular"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {finalesRendidos.length === 0 && !cargando && (
        <div className="inscripciones-section">
          <div className="section-card">
            <div className="no-results">
              <h3>No hay finales rendidos</h3>
              <p>Aquí aparecerán los finales que hayas rendido una vez que los curses y des los exámenes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisFinales;