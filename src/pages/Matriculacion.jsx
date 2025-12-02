import { useEffect, useState } from "react";
import "../Styles/Matriculacion.css";
import {
  getAsignaturasPendientes,
  registerMatriculation
} from "../services/matriculationService";

const MatriculacionPage = () => {
  const [permiso, setPermiso] = useState(null);
  const [carrera, setCarrera] = useState(null);
  const [asignaturasPendientes, setAsignaturasPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState(""); // "exito" | "error"

  // Cargar datos del login
  useEffect(() => {
    const datosAlumno = JSON.parse(localStorage.getItem("datosAlumno"));
    const datosCarrera = JSON.parse(localStorage.getItem("datosCarrera"));

    if (!datosAlumno || !datosCarrera) {
      alert("No hay información de sesión. Iniciá sesión nuevamente.");
      return;
    }

    setPermiso(datosAlumno.Permiso);
    setCarrera(datosCarrera.Nombre);

    // Cargar asignaturas automáticamente
    cargarAsignaturas(datosAlumno.Permiso, datosCarrera.Codigo);
  }, []);

  // Función para traer asignaturas pendientes
  const cargarAsignaturas = async (permiso, carreraCodigo) => {
    setCargando(true);

    try {
      const response = await getAsignaturasPendientes(permiso, carreraCodigo);

      const asignaturasConCodigo = response.map((a, index) => ({
        ...a,
        Codigo: a.Codigo || a.Materia || 490000 + index,
        Division: a.Division || 1,
        Profesor: a.Profesor || 447,
      }));

      setAsignaturasPendientes(asignaturasConCodigo);
    } catch (err) {
      alert("Error al consultar asignaturas: " + err);
    } finally {
      setCargando(false);
    }
  };

  // Matricular
  const handleMatricular = async (asignatura) => {
    if (!asignatura.Codigo) {
      alert("La asignatura no tiene código definido.");
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

    if (!permiso || !carrera) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>No hay usuario logueado</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>📘 Asignaturas Pendientes</h2>
      <p><strong>Carrera:</strong> {carrera}</p>

      {cargando ? (
        <p>Cargando...</p>
      ) : asignaturasPendientes.length === 0 ? (
        <p>No hay asignaturas pendientes.</p>
      ) : (
        <ul className="asignaturas-list">
          {asignaturasPendientes.map((a) => (
            <li key={a.Codigo}>
              <div>
                <strong>{a.Asignatura}</strong> — Matriculado: {a.Matriculado}
              </div>
            </li>
          ))}
        </ul>
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
