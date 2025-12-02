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
      Division: asignatura.Division,
      Libre: false,
      Profesor: asignatura.Profesor
    };

    try {
      const response = await registerMatriculation(payload);
      alert(response.mensaje || "Matriculación realizada con éxito.");
    } catch (err) {
      alert("Error al matricular: " + err);
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
              {a.Matriculado === "No" && (
                <button
                  onClick={() => handleMatricular(a)}
                  className="matricular-btn"
                >
                  Matricular
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default MatriculacionPage;
