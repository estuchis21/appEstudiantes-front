import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import listCoursesService from "../services/listCoursesService";
import Swal from "sweetalert2";
import "../Styles/Analitico.css";

const Analitico = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ CORREGIDO: Obtener datos correctamente
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const careerData = JSON.parse(localStorage.getItem("careerData")) || {};
  
  const permiso = userData?.Permiso || "";
  const codigo = careerData?.Codigo || "";

  // Para debuggear - agrega esto temporalmente
  useEffect(() => {
    console.log("🔍 Debug - Datos del localStorage:");
    console.log("userData:", userData);
    console.log("careerData:", careerData);
    console.log("permiso:", permiso);
    console.log("codigo:", codigo);
  }, []);

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
            <strong>Asistencia:</strong> ${materia.AsistenciaPorcentaje}%
          </div>
          <div class="swal-info-item">
            <strong>Asistencia Hasta:</strong> ${materia.AsistenciaHasta || "-"}
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
      // ✅ Ahora con los datos corregidos
      if (!permiso || !codigo) {
        console.warn("⚠️ Missing permiso or codigo; skipping fetch.");
        console.log("permiso:", permiso, "codigo:", codigo);
        setError("No se encontraron los datos del usuario. Por favor, inicie sesión nuevamente.");
        setLoading(false);
        return;
      }

      try {
        console.log("📡 Llamando a listCoursesService con:", { permiso, codigo });
        const data = await listCoursesService(permiso, codigo);
        console.log("📦 Datos recibidos:", data);

        const transformed = data.map((item) => {
          const parciales = [
            item.Parcial1,
            item.Parcial2,
            item.Recuperatorio1,
            item.Recuperatorio2,
          ];
          const practicos = [
            item.Practico1,
            item.Practico2,
            item.Practico3,
            item.Practico4,
            item.Practico5,
          ];
          const totalNotas = [...parciales, ...practicos].filter(
            (n) => n > 0
          ).length;

          let estado = "Pendiente";
          if (
            totalNotas > 0 &&
            totalNotas < parciales.length + practicos.length
          )
            estado = "Cursando";
          if (
            totalNotas === parciales.length + practicos.length &&
            totalNotas > 0
          )
            estado = "Aprobada";

          return {
            materia: item.Materia,
            año: new Date().getFullYear(),
            estado,
            profesor: item.Profesor,
            ...item,
          };
        });

        setMaterias(transformed);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
        setError("No se pudo cargar la lista de materias: " + (err.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [permiso, codigo]);

  const columnas = [
    { key: "materia", header: "Materia" },
    { key: "año", header: "Año", align: "center" },
    {
      key: "estado",
      header: "Estado",
      align: "center",
      render: (fila) => (
        <span className={`estado-materia ${fila.estado.toLowerCase()}`}>
          {fila.estado}
        </span>
      ),
    },
    {
      key: "profesor",
      header: "Profesor",
      align: "center",
    },
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
        <h1 className="analitico-title">Analítico de Cursadas</h1>
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