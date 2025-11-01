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
import { FaBook } from "react-icons/fa6";
import { FaBookBookmark } from "react-icons/fa6";
import Swal from "sweetalert2";
import "../styles/Finales.css";


const FinalExams = () => {
  const [finals, setFinals] = useState([]);
  const permiso = localStorage.getItem("permiso");
  const codigo = localStorage.getItem("codigoCarrera");
  const nombreCarrera = formatCarreraName(
    localStorage.getItem("nombreCarrera")
  );

  const isMobile = useMediaQuery({ maxWidth: 768 });

  function formatCarreraName(nombre) {
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) =>
        palabrasMin.includes(palabra)
          ? palabra
          : palabra.charAt(0).toUpperCase() + palabra.slice(1)
      )
      .join(" ");
  }

  const getAbreviatura = () => {
    return "Tec. Sup. en Análisis, Desarrollo y Prog. de Aplicaciones";
  };

  useEffect(() => {
    const fetchFinalExams = async () => {
      try {
        const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
        setFinals(result);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
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
      await registerStudentToFinal(final.Numero, permiso, final.Curso, final.Libre);
      Swal.fire("¡Inscripción exitosa!", "Te has inscrito al final correctamente.", "success");
      setFinals((prev) =>
        prev.map((f) => (f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f))
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo realizar la inscripción.", "error");
      console.error(error);
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
      Swal.fire("Desinscripción exitosa", "Has sido dado de baja del examen.", "success");
      setFinals((prev) =>
        prev.map((f) => (f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f))
      );
    } catch (error) {
      Swal.fire("Error", "No se pudo cancelar la inscripción.", "error");
      console.error(error);
    }
  };

  const materiasDisponibles = finals.filter((final) => final.Inscripto === 0);
  const materiasInscriptas = finals.filter((final) => final.Inscripto === 1);

  return (
    <div className="final-exams-container">
      <div className="final-exams-header">
        <h1>{isMobile ? getAbreviatura(nombreCarrera) : nombreCarrera}</h1>
        <div className="user-info-container">
          <div className="user-info-card">
            <span>📚 Exámenes Finales</span>
          </div>
        </div>
      </div>

      <div className="final-exams-grid">
        {/* Materias Inscriptas */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBookBookmark /> Materias Inscriptas ({materiasInscriptas.length})</h2>
            {materiasInscriptas.length > 0 ? (
              materiasInscriptas.map((final) => (
                <div key={final.Numero} className="final-item inscripta">
                  <div className="final-header">
                    <h3 className="final-subject">{final.Abreviatura}</h3>
                  </div>
                  <div className="final-info-grid">
                    <div className="final-info-row">
                      <span className="final-info-item"><FaCalendarAlt /> {final.Fecha}</span>
                      <span className="final-info-item"><FaClock /> {final.Hora}</span>
                    </div>
                    <div className="final-info-row">
                      <span className="final-info-item"><FaMapMarkerAlt /> {final.Lugar}</span>
                      <span className="final-info-item"><FaUserGraduate /> {final.Titular}</span>
                    </div>
                  </div>
                  <div className="final-actions">
                    <button
                      className="action-button regular"
                      onClick={() => handleDeregister(final)}
                    >
                      Desinscribirse
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No hay materias inscriptas</p>
              </div>
            )}
          </div>
        </div>

        {/* Materias Disponibles */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBook /> Materias Disponibles ({materiasDisponibles.length})</h2>
            {materiasDisponibles.length > 0 ? (
              materiasDisponibles.map((final) => (
                <div
                  key={final.Numero}
                  className={`final-item disponible ${
                    final.Asistencia === "0" || final.PerdioTurno === "1" ? "disabled" : ""
                  }`}
                >
                  <div className="final-header">
                    <h3 className="final-subject">{final.Abreviatura}</h3>
                    {final.Libre === "1" && <span className="libre-badge">Libre</span>}
                  </div>
                  <div className="final-info-grid">
                    <div className="final-info-row">
                      <span className="final-info-item"><FaCalendarAlt /> {final.Fecha}</span>
                      <span className="final-info-item"><FaClock /> {final.Hora}</span>
                    </div>
                    <div className="final-info-row">
                      <span className="final-info-item"><FaMapMarkerAlt /> {final.Lugar}</span>
                      <span className="final-info-item"><FaUserGraduate /> {final.Titular}</span>
                    </div>
                  </div>
                  <div className="final-actions">
                    <button
                      className={`action-button ${
                        final.Libre === "1" ? "libre" : "regular"
                      } ${
                        final.Asistencia === "0" || final.PerdioTurno === "1"
                          ? "disabled"
                          : ""
                      }`}
                      disabled={final.Asistencia === "0" || final.PerdioTurno === "1"}
                      onClick={() => handleRegister(final)}
                    >
                      {final.Libre === "1" ? "Inscribirse (Libre)" : "Inscribirse"}
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
            ) : (
              <div className="empty-state">
                <p>No hay materias disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalExams;
