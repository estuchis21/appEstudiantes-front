import { useEffect, useState } from "react";
import {
  getAsignaturasPendientes,
  getCarrerasDelAlumno,
  registerMatriculation
} from "../services/matriculationService";

const MatriculacionPage = () => {
  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [permiso, setPermiso] = useState(null);
  const [asignaturasPendientes, setAsignaturasPendientes] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener usuario logueado y sus carreras
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || !usuario.Permiso) {
      alert("No se encontró información válida del usuario. Por favor logueate.");
      return;
    }

    setPermiso(usuario.Permiso);

    getCarrerasDelAlumno(usuario.Permiso)
      .then((data) => setCarreras(data))
      .catch((err) => alert("Error cargando carreras: " + err));
  }, []);

  // Consultar asignaturas pendientes
  const handleConsultar = async (e) => {
    if (e) e.preventDefault();

    if (!carreraSeleccionada) {
      alert("Por favor, seleccioná una carrera.");
      return;
    }

    if (!permiso) {
      alert("No se puede consultar asignaturas sin usuario logueado.");
      return;
    }

    setCargando(true);
    try {
      const response = await getAsignaturasPendientes(permiso, carreraSeleccionada);

      // Asegurarnos de que cada asignatura tenga código, división y profesor
      const asignaturasConCodigo = response.map((a, index) => ({
        ...a,
        Codigo: a.Codigo || a.Materia || 490000 + index,
        Division: a.Division || 1,
        Profesor: a.Profesor || 447
      }));

      setAsignaturasPendientes(asignaturasConCodigo);
      alert("Asignaturas cargadas correctamente.");
    } catch (err) {
      alert("Error al consultar las asignaturas: " + err);
    } finally {
      setCargando(false);
    }
  };

  // Matricular asignatura
  const handleMatricular = async (asignatura) => {
    if (!asignatura.Codigo) {
      alert("No se puede matricular. La asignatura no tiene código definido:\n" + JSON.stringify(asignatura, null, 2));
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

  if (!permiso) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>No hay usuario logueado</h2>
        <p>Por favor, inicia sesión para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <h2>📘 Consultar Asignaturas Pendientes</h2>

      <form onSubmit={handleConsultar} style={{ marginBottom: "20px" }}>
        <div>
          <label>Seleccioná tu carrera:</label>
          <select
            value={carreraSeleccionada}
            onChange={(e) => setCarreraSeleccionada(e.target.value)}
            required
          >
            <option value="">-- Seleccionar --</option>
            {carreras.map((c) => (
              <option key={c.Codigo} value={c.Codigo}>
                {c.Nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? "Cargando..." : "Consultar"}
        </button>
      </form>

      <h3>Asignaturas Pendientes</h3>
      {asignaturasPendientes.length === 0 ? (
        <p>No hay asignaturas pendientes o no se consultó ninguna carrera aún.</p>
      ) : (
        <ul>
          {asignaturasPendientes.map((a) => (
            <li key={a.Codigo} style={{ marginBottom: "10px" }}>
              <strong>{a.Asignatura}</strong> — Matriculado: {a.Matriculado}
              {a.Matriculado === "No" && (
                <button
                  onClick={() => handleMatricular(a)}
                  style={{
                    marginLeft: "10px",
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
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
