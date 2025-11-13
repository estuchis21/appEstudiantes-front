import React, { useState, useEffect } from "react";
import TablaReutilizable from "../components/Tabla";
import listCoursesService from "../services/listCoursesService";
import "../Styles/Analitico.css";

const Analitico = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null); // for modal

  const storedUser = JSON.parse(localStorage.getItem("userData")) || {};
  const permiso = storedUser?.usuario?.Permiso || "";
  const codigo = storedUser?.carrera?.Codigo || "";

  useEffect(() => {
    const fetchCourses = async () => {
      if (!permiso || !codigo) {
        console.warn("⚠️ Missing permiso or codigo; skipping fetch.");
        setLoading(false);
        return;
      }

      try {
        const data = await listCoursesService(permiso, codigo);

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
        console.error("Error fetching courses:", err);
        setError("No se pudo cargar la lista de materias.");
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
          onClick={() => setSelectedMateria(fila)}
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
            <p>Cargando materias...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <TablaReutilizable datos={materias} columnas={columnas} />
          )}
        </div>
      </section>

      {selectedMateria && (
        <div className="modal-overlay" onClick={() => setSelectedMateria(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMateria.Materia}</h2>
            <p>
              <strong>Profesor:</strong> {selectedMateria.Profesor}
            </p>
            <p>
              <strong>Curso:</strong> {selectedMateria.Curso}
            </p>
            <p>
              <strong>División:</strong> {selectedMateria.Division}
            </p>
            <p>
              <strong>Asistencia:</strong>{" "}
              {selectedMateria.AsistenciaPorcentaje}%
            </p>
            <p>
              <strong>Asistencia Hasta:</strong>{" "}
              {selectedMateria.AsistenciaHasta || "-"}
            </p>

            <h3>Notas</h3>
            <ul className="detalle-lista">
              <li>Parcial 1: {selectedMateria.Parcial1}</li>
              <li>Recuperatorio 1: {selectedMateria.Recuperatorio1}</li>
              <li>Parcial 2: {selectedMateria.Parcial2}</li>
              <li>Recuperatorio 2: {selectedMateria.Recuperatorio2}</li>
              <li>Práctico 1: {selectedMateria.Practico1}</li>
              <li>Práctico 2: {selectedMateria.Practico2}</li>
              <li>Práctico 3: {selectedMateria.Practico3}</li>
              <li>Práctico 4: {selectedMateria.Practico4}</li>
              <li>Práctico 5: {selectedMateria.Practico5}</li>
            </ul>

            <button
              className="cerrar-btn"
              onClick={() => setSelectedMateria(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analitico;
