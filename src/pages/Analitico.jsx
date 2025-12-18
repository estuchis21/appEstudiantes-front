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

  /* =======================
     FORMATTERS
  ======================= */

  const formatDate = (fechaStr) => {
    if (!fechaStr) return "-";
    const date = new Date(fechaStr);
    if (isNaN(date)) return "-";
    return date.toLocaleDateString("es-AR");
  };

  const formatCurso = (num) => (num ? `${num}°` : "-");
  const formatAprobacion = (valor) => (valor == 1 ? "✅" : "❌");
  const formatAsistencia = (valor) =>
    valor != null ? `${valor}%` : "-";

  /* =======================
     SWEET ALERT
  ======================= */

  const showMateriaDetails = (materia) => {
    Swal.fire({
      title: materia.Materia,
      html: `
        <div class="swal-detalle-grid">

          <div><strong>Profesor</strong><span>${materia.Profesor || "-"}</span></div>
          <div><strong>Curso</strong><span>${materia.Curso || "-"}</span></div>
          <div><strong>División</strong><span>${materia.Division || "-"}</span></div>
          <div><strong>Asistencia</strong><span>${materia.AsistenciaPorcentaje ?? "-"}%</span></div>
          <div><strong>Hasta</strong><span>${formatDate(materia.AsistenciaHasta)}</span></div>
          <div><strong>Cursada</strong><span>${formatAprobacion(materia.Cursada)}</span></div>
          <div><strong>Promoción</strong><span>${formatAprobacion(materia.Promocion)}</span></div>

        </div>

        <hr />

        <h4 class="swal-subtitle">Notas</h4>
        <div class="swal-notas">
          <span>Parcial 1: ${materia.Parcial1 ?? "-"}</span>
          <span>Recup. 1: ${materia.Recuperatorio1 ?? "-"}</span>
          <span>Parcial 2: ${materia.Parcial2 ?? "-"}</span>
          <span>Recup. 2: ${materia.Recuperatorio2 ?? "-"}</span>
          <span>Práctico 1: ${materia.Practico1 ?? "-"}</span>
          <span>Práctico 2: ${materia.Practico2 ?? "-"}</span>
          <span>Práctico 3: ${materia.Practico3 ?? "-"}</span>
          <span>Práctico 4: ${materia.Practico4 ?? "-"}</span>
          <span>Práctico 5: ${materia.Practico5 ?? "-"}</span>
        </div>
      `,
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "swal-responsive",
        title: "swal-title",
        confirmButton: "swal-btn",
      },
      width: "600px",
    });
  };

  /* =======================
     DATA FETCH
  ======================= */

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

  /* =======================
     COLUMNAS
  ======================= */

  const columnas = [
    { key: "curso", header: "Año", align: "center" },
    { key: "materia", header: "Materia" },
    { key: "profesor", header: "Profesor" },
    { key: "cursada", header: "Cursada", align: "center" },
    { key: "promocion", header: "Promoción", align: "center" },
    { key: "asistencia", header: "Asistencia", align: "center" },
    {
      key: "acciones",
      header: "Acciones",
      align: "center",
      render: (fila) => (
        <button
          className="ver-detalle-btn"
          onClick={() => showMateriaDetails(fila)}
        >
          Ver detalle
        </button>
      ),
    },
  ];

  /* =======================
     RENDER
  ======================= */

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
