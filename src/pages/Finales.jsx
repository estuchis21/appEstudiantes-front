import { useState, useEffect } from "react";
import {
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal,
  deleteFinalInscription,
} from "../services/finalsService";
import { useMediaQuery } from "react-responsive";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { FaBook, FaBookBookmark } from "react-icons/fa6";
import Swal from "sweetalert2";
import "../styles/Finales.css";

const FinalExams = () => {
  const [finals, setFinals] = useState([]);
  const [loading, setLoading] = useState(true);

  //  CORREGIDO: Obtener datos como en HomeUser.jsx
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const careerData = JSON.parse(localStorage.getItem("careerData")) || {};
  
  //  Datos directos como en HomeUser
  const permiso = userData?.Permiso || userData?.permiso || "";
  const codigo = careerData?.Codigo || careerData?.codigo || "";
  const nombreCarrera = formatCarreraName(careerData?.Nombre || careerData?.nombre || "");

  // Para debug - agrega esto
  useEffect(() => {
    console.log("🔍 FinalExams - Debug datos:");
    console.log("userData:", userData);
    console.log("careerData:", careerData);
    console.log("permiso:", permiso);
    console.log("codigo:", codigo);
  }, []);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  function formatCarreraName(nombre) {
    if (!nombre) return "";
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((p) =>
        palabrasMin.includes(p)
          ? p
          : p.charAt(0).toUpperCase() + p.slice(1)
      )
      .join(" ");
  }

  const getAbreviatura = () =>
    "Tec. Sup. en Análisis, Desarrollo y Prog. de Aplicaciones";

  useEffect(() => {
    const fetchFinalExams = async () => {
      // Verificar que tenemos datos válidos
      if (!permiso || !codigo) {
        console.warn("⚠️ Faltan datos en FinalExams:", { permiso, codigo });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 FinalExams llamando servicio con:", { permiso, codigo });
        const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
        console.log("📦 FinalExams - Finales recibidos:", result);
        setFinals(result || []);
      } catch (error) {
        console.error("❌ Error en FinalExams:", error);
        Swal.fire("Error", "No se pudieron cargar los finales", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchFinalExams();
  }, [permiso, codigo]);

  const handleRegister = async (final) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar inscripción?",
      text: `Estas por inscribirte en el final de ${final.Abreviatura}`,
      showCancelButton: true,
      confirmButtonText: "Sí, inscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#667eea",
    });

    if (!confirm.isConfirmed) return;

    try {
      console.log("🎯 Inscribiendo a mesa:", final.Numero);
      await registerStudentToFinal(
        final.Numero,
        permiso,
        final.Curso,
        final.Libre
      );

      Swal.fire("¡Inscripción exitosa!", "Te has inscripto correctamente.", "success");

      // Actualizar estado local
      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
        )
      );
    } catch (error) {
      console.error("❌ Error en inscripción:", error);
      Swal.fire("Error", error.message || "No se pudo realizar la inscripción.", "error");
    }
  };

  const handleDeregister = async (final) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar inscripción?",
      text: `¿Deseas desinscribirte del final de ${final.Abreviatura}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desinscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteFinalInscription(final.Numero, permiso);

      Swal.fire("Desinscripción exitosa", "Has sido dado de baja.", "success");

      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
        )
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo cancelar la inscripción.", "error");
    }
  };

  const materiasDisponibles = finals.filter((f) => Number(f.Inscripto) === 0);
  const materiasInscriptas = finals.filter((f) => Number(f.Inscripto) === 1);

  console.log("📊 FinalExams - Estado:", {
    loading,
    totalFinales: finals.length,
    disponibles: materiasDisponibles.length,
    inscriptas: materiasInscriptas.length
  });

  if (loading) {
    return (
      <div className="final-exams-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando finales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="final-exams-container">
      <div className="final-exams-header">
        <h1>{isMobile ? getAbreviatura() : nombreCarrera}</h1>

        <div className="user-info-container">
          <div className="user-info-card">
            <span>Exámenes Finales</span>
          </div>
        </div>
      </div>

      <div className="final-exams-grid">
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">
              <FaBookBookmark /> Materias Inscriptas ({materiasInscriptas.length})
            </h2>

            {materiasInscriptas.length === 0 ? (
              <div className="empty-state">
                <p>No hay materias inscriptas</p>
              </div>
            ) : (
              materiasInscriptas.map((final) => (
                <div key={final.Numero} className="final-item inscripta">
                  <div className="final-header">
                    <h3 className="final-subject">{final.Abreviatura}</h3>
                  </div>

                  <div className="final-info-grid">
                    <div className="final-info-row">
                      <span className="final-info-item">
                        <FaCalendarAlt /> {final.Fecha}
                      </span>
                      <span className="final-info-item">
                        <FaClock /> {final.Hora}
                      </span>
                    </div>

                    <div className="final-info-row">
                      <span className="final-info-item">
                        <FaMapMarkerAlt /> {final.Lugar}
                      </span>
                      <span className="final-info-item">
                        <FaUserGraduate /> {final.Titular}
                      </span>
                    </div>
                  </div>

                  <button
                    className="action-button regular"
                    onClick={() => handleDeregister(final)}
                  >
                    Desinscribirse
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">
              <FaBook /> Materias Disponibles ({materiasDisponibles.length})
            </h2>

            {materiasDisponibles.length === 0 ? (
              <div className="empty-state">
                <p>No hay materias disponibles</p>
              </div>
            ) : (
              materiasDisponibles.map((final) => (
                <div
                  key={final.Numero}
                  className={`final-item disponible ${
                    final.Asistencia === "0" || final.PerdioTurno === "1"
                      ? "disabled"
                      : ""
                  }`}
                >
                  <div className="final-header">
                    <h3 className="final-subject">{final.Abreviatura}</h3>
                    {final.Libre === "1" && (
                      <span className="libre-badge">Libre</span>
                    )}
                  </div>

                  <div className="final-info-grid">
                    <div className="final-info-row">
                      <span className="final-info-item">
                        <FaCalendarAlt /> {final.Fecha}
                      </span>
                      <span className="final-info-item">
                        <FaClock /> {final.Hora}
                      </span>
                    </div>

                    <div className="final-info-row">
                      <span className="final-info-item">
                        <FaMapMarkerAlt /> {final.Lugar}
                      </span>
                      <span className="final-info-item">
                        <FaUserGraduate /> {final.Titular}
                      </span>
                    </div>
                  </div>

                  <div className="final-actions">
                    <button
                      className={`action-button ${
                        final.Libre === "1" ? "libre" : "regular"
                      }`}
                      disabled={
                        final.Asistencia === "0" || final.PerdioTurno === "1"
                      }
                      onClick={() => handleRegister(final)}
                    >
                      {final.Libre === "1"
                        ? "Inscribirse (Libre)"
                        : "Inscribirse"}
                    </button>

                    {(final.Asistencia === "0" || final.PerdioTurno === "1") && (
                      <small className="disabled-reason">
                        {final.Asistencia === "0"
                          ? "No tiene asistencia suficiente"
                          : "Perdió el turno anterior"}
                      </small>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalExams;