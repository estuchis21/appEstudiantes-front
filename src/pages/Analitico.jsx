import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../Styles/Analitico.css";
import CareerSelector from "../components/CareerSelector";
import TablaReutilizable from "../components/Tabla";
import listCoursesService from "../services/listCoursesService";

const Analitico = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const careerData = JSON.parse(localStorage.getItem("careerData")) || {};

  const permiso = userData?.Permiso || "";
  const codigo = careerData?.Codigo || "";

  const formatDate = (fechaStr) => {
    if (!fechaStr) return "-";
    const date = new Date(fechaStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("es-AR");
  };

  const formatCurso = (num) =>
    num ? `${num}°` : "-";

  const formatAprobacion = (valor) =>
    valor == 1 ? "✅" : "❌";

  const formatAsistencia = (valor) =>
    valor != null ? `${valor}%` : "-";

  useEffect(() => {
    const fetchCourses = async () => {
      if (!permiso || !codigo) {
        setError("No se encontraron los datos del usuario.");
        setLoading(false);
        return;
      }

      try {
        const data = await listCoursesService(permiso, codigo);

        const transformed = data.map((item) => ({
          materia: item.Materia,
          curso: formatCurso(item.Curso),
          profesor: item.Profesor,
          cursada: formatAprobacion(item.Cursada),
          promocion: formatAprobacion(item.Promocion),
          asistencia: formatAsistencia(item.AsistenciaPorcentaje),
          ...item,
        }));

        setMaterias(transformed);
      } catch {
        setError("Error al cargar materias.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [permiso, codigo]);

  const columnas = [
    { key: "curso", header: "Año", align: "center" },
    { key: "materia", header: "Materia" },
    { key: "profesor", header: "Profesor" },
    { key: "cursada", header: "Cursada", align: "center" },
    { key: "promocion", header: "Promoción", align: "center" },
    { key: "asistencia", header: "Asistencia", align: "center" },
  ];

  return (
    <div className="analitico-container">
      <header className="analitico-header">
        <h1 className="analitico-title">Cursadas</h1>
        <CareerSelector />
      </header>

      <section className="tabla-section">
        <div className="section-card">
          <h2>Historial Académico</h2>

          {loading && <p>Cargando materias...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <TablaReutilizable datos={materias} columnas={columnas} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Analitico;
