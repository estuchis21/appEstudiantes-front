import { useEffect, useState } from "react";
import "../Styles/Matriculacion.css";
import {
  getAsignaturasPendientes,
  getCarrerasDelAlumno,
  registerMatriculation,
  deleteMatriculation
} from "../services/matriculationService";

const MatriculacionPage = () => {
  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [permiso, setPermiso] = useState(null);
  const [asignaturasPendientes, setAsignaturasPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" | "error"

  // Obtener usuario logueado y sus carreras
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const careerData = JSON.parse(localStorage.getItem("careerData"));
    
    if (!userData || !userData.Permiso) {
      setMensaje("No se encontró información válida del usuario. Por favor inicia sesión.");
      setTipoMensaje("error");
      return;
    }

    console.log("🔍 Usuario logueado:", userData);
    console.log("🔍 Carrera del usuario:", careerData);
    
    setPermiso(userData.Permiso);

    // Si hay carreraData, establecerla como seleccionada
    if (careerData && careerData.Codigo) {
      setCarreraSeleccionada(careerData.Codigo.toString());
    }

    // Cargar carreras del alumno
    setCargando(true);
    getCarrerasDelAlumno(userData.Permiso)
      .then((data) => {
        console.log("📦 Carreras recibidas:", data);
        setCarreras(data);
        
        // Si no hay carrera seleccionada y hay carreras, seleccionar la primera
        if (!careerData && data.length > 0) {
          setCarreraSeleccionada(data[0].Codigo.toString());
        }
      })
      .catch((err) => {
        console.error("❌ Error cargando carreras:", err);
        setMensaje("Error cargando carreras: " + (err.message || "Error desconocido"));
        setTipoMensaje("error");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Consultar asignaturas pendientes
  const handleConsultar = async (e) => {
    if (e) e.preventDefault();

    if (!carreraSeleccionada) {
      setMensaje("Por favor, seleccioná una carrera.");
      setTipoMensaje("error");
      return;
    }

    if (!permiso) {
      setMensaje("No se puede consultar asignaturas sin usuario logueado.");
      setTipoMensaje("error");
      return;
    }

    setCargando(true);
    setMensaje("");
    setTipoMensaje("");
    
    try {
      console.log("📡 Consultando asignaturas con:", { 
        permiso, 
        carrera: carreraSeleccionada 
      });
      
      const response = await getAsignaturasPendientes(permiso, carreraSeleccionada);
      console.log("📦 Asignaturas recibidas:", response);
      
      // Si el backend devuelve un mensaje en lugar de array
      if (response.mensaje) {
        setMensaje(response.mensaje);
        setTipoMensaje("info");
        setAsignaturasPendientes([]);
      } else {
        setAsignaturasPendientes(response);
        setMensaje(`✅ Se encontraron ${response.length} asignaturas pendientes`);
        setTipoMensaje("exito");
      }
    } catch (err) {
      console.error("❌ Error al consultar las asignaturas:", err);
      setMensaje("Error al consultar las asignaturas: " + (err.message || "Error desconocido"));
      setTipoMensaje("error");
      setAsignaturasPendientes([]);
    } finally {
      setCargando(false);
    }
  };

  // Matricular asignatura
  const handleMatricular = async (asignatura) => {
    if (!asignatura.Codigo) {
      setMensaje("No se puede matricular. La asignatura no tiene código definido.");
      setTipoMensaje("error");
      return;
    }

    const payload = {
      Alumno: permiso,
      Materia: asignatura.Codigo,
      Division: asignatura.Division || 1, // Valor por defecto
      Libre: false,
      Profesor: asignatura.Profesor || 447 // Valor por defecto
    };

    setCargando(true);
    setMensaje("");
    setTipoMensaje("");
    
    try {
      console.log("🎯 Intentando matricular:", payload);
      
      const response = await registerMatriculation(payload);
      console.log("✅ Respuesta del servidor:", response);
      
      if (response.mensaje) {
        setMensaje(response.mensaje);
        setTipoMensaje("exito");
        
        // Si la matriculación fue exitosa, actualizar la lista
        if (response.mensaje.includes("exitosa") || !response.mensaje.includes("Error")) {
          // Recargar las asignaturas pendientes
          const nuevasAsignaturas = await getAsignaturasPendientes(permiso, carreraSeleccionada);
          setAsignaturasPendientes(nuevasAsignaturas.mensaje ? [] : nuevasAsignaturas);
        }
      } else {
        throw new Error("No se recibió confirmación del servidor");
      }
      
    } catch (err) {
      console.error("❌ Error al matricular:", err);
      setMensaje(err.message || "Error al realizar la matriculación");
      setTipoMensaje("error");
    } finally {
      setCargando(false);
    }
  };

  // Desmatricular asignatura
  const handleDesmatricular = async (asignatura) => {
    if (!asignatura.Codigo) {
      setMensaje("No se puede desmatricular. La asignatura no tiene código definido.");
      setTipoMensaje("error");
      return;
    }

    setCargando(true);
    setMensaje("");
    setTipoMensaje("");
    
    try {
      console.log("🎯 Intentando desmatricular:", { 
        Alumno: permiso, 
        Materia: asignatura.Codigo, 
        Division: asignatura.Division || 1 
      });
      
      const response = await deleteMatriculation(
        permiso, 
        asignatura.Codigo, 
        asignatura.Division || 1
      );
      
      console.log("✅ Respuesta del servidor:", response);
      
      if (response.mensaje) {
        setMensaje(response.mensaje);
        setTipoMensaje("exito");
        
        // Recargar las asignaturas pendientes
        const nuevasAsignaturas = await getAsignaturasPendientes(permiso, carreraSeleccionada);
        setAsignaturasPendientes(nuevasAsignaturas.mensaje ? [] : nuevasAsignaturas);
      }
      
    } catch (err) {
      console.error("❌ Error al desmatricular:", err);
      setMensaje(err.message || "Error al desmatricular");
      setTipoMensaje("error");
    } finally {
      setCargando(false);
    }
  };

  if (!permiso) {
    return (
      <div className="matriculacion-container">
        <div className="mensaje error">
          <h2>No hay usuario logueado</h2>
          <p>Por favor, inicia sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="matriculacion-container">
      <div className="matriculacion-header">
        <h1>🎓 Sistema de Matriculación</h1>
        <p>Gestioná tu inscripción a las materias de la carrera</p>
      </div>

      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      <div className="matriculacion-form-container">
        <h2>📘 Consultar Asignaturas Pendientes</h2>
        
        <form onSubmit={handleConsultar} className="matriculacion-form">
          <div className="form-group">
            <label htmlFor="carrera-select">Seleccioná tu carrera:</label>
            <select
              id="carrera-select"
              value={carreraSeleccionada}
              onChange={(e) => setCarreraSeleccionada(e.target.value)}
              required
              disabled={cargando}
            >
              <option value="">-- Seleccionar Carrera --</option>
              {carreras.map((carrera) => (
                <option key={carrera.Codigo} value={carrera.Codigo}>
                  {carrera.Nombre}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="consultar-btn"
            disabled={cargando || !carreraSeleccionada}
          >
            {cargando ? "⏳ Buscando..." : "🔍 Consultar Asignaturas"}
          </button>
        </form>
      </div>

      {asignaturasPendientes.length > 0 && (
        <div className="asignaturas-section">
          <h2>📚 Asignaturas Pendientes ({asignaturasPendientes.length})</h2>
          
          <div className="asignaturas-grid">
            {asignaturasPendientes.map((asignatura) => (
              <div key={asignatura.Codigo} className="asignatura-card">
                <div className="asignatura-header">
                  <h3>{asignatura.Asignatura || asignatura.Nombre}</h3>
                  <span className={`badge ${asignatura.Matriculado === "Sí" ? "matriculado" : "pendiente"}`}>
                    {asignatura.Matriculado === "Sí" ? "✅ Matriculado" : "❌ Pendiente"}
                  </span>
                </div>
                
                <div className="asignatura-info">
                  <p><strong>Código:</strong> {asignatura.Codigo}</p>
                  <p><strong>Curso:</strong> {asignatura.Curso}° año</p>
                  {asignatura.Division && <p><strong>División:</strong> {asignatura.Division}</p>}
                  {asignatura.Profesor && <p><strong>Profesor:</strong> {asignatura.Profesor}</p>}
                </div>
                
                <div className="asignatura-actions">
                  {asignatura.Matriculado === "No" ? (
                    <button
                      onClick={() => handleMatricular(asignatura)}
                      className="btn-matricular"
                      disabled={cargando}
                    >
                      {cargando ? "Matriculando..." : "📝 Matricular"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDesmatricular(asignatura)}
                      className="btn-desmatricular"
                      disabled={cargando}
                    >
                      {cargando ? "Desmatriculando..." : "🗑️ Desmatricular"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cargando && asignaturasPendientes.length === 0 && (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Buscando asignaturas pendientes...</p>
        </div>
      )}
    </div>
  );
};

export default MatriculacionPage;