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

  // Función para formatear fechas a dd/mm/yy
  const formatDate = (fechaStr) => {
    if (!fechaStr) return "-";
    const date = new Date(fechaStr);
    if (isNaN(date)) return "-";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Función para convertir número de año en texto
  const formatCurso = (num) => {
    switch (num) {
      case 1: return "1ro";
      case 2: return "2do";
      case 3: return "3ro";
      case 4: return "4to";
      case 5: return "5to";
      default: return num || "-";
    }
  };

  const formatAsistencia = (valor) => {
    return valor != null ? `${valor}%` : "-";
  }

  // Función para mostrar check si está aprobado
  const formatAprobacion = (valor) => valor == 1 ? "✅" : "❌";

  const showMateriaDetails = (materia) => {
    const notasContent = `
      <div class="swal-notas-container">
        <div class="swal-info-grid">
          <div class="swal-info-item">
            <strong>Profesor:</strong> ${materia.Profesor}
          </div>
          <div class="swal-info-item">
            <strong>Curso:</strong> ${materia.Curso}
          </div>
          <div class="swal-info-item">
            <strong>División:</strong> ${materia.Division}
          </div>
          <div class="swal-info-item">
            <strong>Asistencia:</strong> ${materia.AsistenciaPorcentaje || "-"}%
          </div>
          <div class="swal-info-item">
            <strong>Asistencia Hasta:</strong> ${formatDate(materia.AsistenciaHasta)}
          </div>
          <div class="swal-info-item">
            <strong>Cursada:</strong> ${formatAprobacion(materia.Cursada)}
          </div>
          <div class="swal-info-item">
            <strong>Promoción:</strong> ${formatAprobacion(materia.Promocion)}
          </div>
        </div>

        <div class="swal-notas-section">
          <h4>Notas</h4>
          <div class="swal-notas-grid">
            <div class="swal-nota-item">
              <span>Parcial 1</span>
              <span class="swal-nota-valor">${materia.Parcial1 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Recuperatorio 1</span>
              <span class="swal-nota-valor">${materia.Recuperatorio1 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Parcial 2</span>
              <span class="swal-nota-valor">${materia.Parcial2 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Recuperatorio 2</span>
              <span class="swal-nota-valor">${materia.Recuperatorio2 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Práctico 1</span>
              <span class="swal-nota-valor">${materia.Practico1 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Práctico 2</span>
              <span class="swal-nota-valor">${materia.Practico2 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Práctico 3</span>
              <span class="swal-nota-valor">${materia.Practico3 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Práctico 4</span>
              <span class="swal-nota-valor">${materia.Practico4 || "-"}</span>
            </div>
            <div class="swal-nota-item">
              <span>Práctico 5</span>
              <span class="swal-nota-valor">${materia.Practico5 || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      title: materia.Materia,
      html: notasContent,
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm'
      },
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
    });
  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!permiso || !codigo) {
        setError("No se encontraron los datos del usuario. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        const data = await listCoursesService(permiso, codigo);

        if (data.mensaje) {
          setError(data.mensaje);
          setLoading(false);
          return;
        }

        const transformed = data.map((item) => ({
          materia: item.Materia,
          curso: formatCurso(item.Curso),
          profesor: item.Profesor,
          cursada: formatAprobacion(item.Cursada),
          promocion: formatAprobacion(item.Promocion),
          asistencia: formatAsistencia(item.AsistenciaPorcentaje),
          asistenciaHasta: formatDate(item.AsistenciaHasta),
          ...item,
        }));

        setMaterias(transformed);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("No se pudo cargar la lista de materias: " + (err.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [permiso, codigo]);

  const columnas = [
    { key: "materia", header: "Materia" },
    { key: "curso", header: "Año", align: "center" },
    { key: "profesor", header: "Profesor", align: "center" },
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

  return (
    <div className="analitico-container">
      <header className="analitico-header">
        <h1 className="analitico-title">Cursadas</h1>
        <CareerSelector />
        <div className="info-badge">
          <span className="badge-text">Historial Completo</span>
        </div>
      </header>

      <section className="tabla-section">
        <div className="section-card">
          <h2>Historial Académico</h2>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Cargando materias...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-text">{error}</p>
              <button
                className="retry-btn"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : (
            <TablaReutilizable datos={materias} columnas={columnas} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Analitico;
