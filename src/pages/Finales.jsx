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
  const permiso = localStorage.getItem("permiso");
  const codigo = localStorage.getItem("codigoCarrera");
  const nombreCarrera = formatCarreraName(localStorage.getItem("nombreCarrera"));

  const isMobile = useMediaQuery({ maxWidth: 768 });

  function formatCarreraName(nombre) {
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

  // =====================
  // CARGA CON LOCALSTORAGE
  // =====================
  useEffect(() => {
    const saved = localStorage.getItem("finalsData");

    if (saved) {
      setFinals(JSON.parse(saved));
    } else {
      const fetchFinalExams = async () => {
        try {
          const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
          setFinals(result);
          localStorage.setItem("finalsData", JSON.stringify(result));
        } catch (error) {
          console.error("Error al obtener los exámenes:", error);
        }
      };
      fetchFinalExams();
    }
  }, [permiso, codigo]);

  // ==================================
  //  INSCRIPCIÓN Y GUARDADO PERSISTENTE
  // ==================================
  const updateLocal = (newState) =>
    localStorage.setItem("finalsData", JSON.stringify(newState));

  const handleRegister = async (final) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar inscripción?",
      text: `Te inscribirás en ${final.Abreviatura}`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#667eea",
    });

    if (!confirm.isConfirmed) return;

    try {
      await registerStudentToFinal(final.Numero, permiso, final.Curso, final.Libre);

      const updated = finals.map((f) =>
        f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
      );

      setFinals(updated);
      updateLocal(updated);

      Swal.fire("¡Listo!", "Inscripción realizada con éxito", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo inscribir.", "error");
    }
  };

  // ==================================
  //  DESINSCRIPCIÓN Y PERSISTENCIA
  // ==================================
  const handleDeregister = async (final) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar inscripción?",
      text: `Te darás de baja del final de ${final.Abreviatura}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteFinalInscription(final.Numero, permiso);

      const updated = finals.map((f) =>
        f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
      );

      setFinals(updated);
      updateLocal(updated);

      Swal.fire("¡Baja realizada!", "Te desinscribiste correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo cancelar la inscripción", "error");
    }
  };

  const materiasDisponibles = finals.filter((f) => f.Inscripto === 0);
  const materiasInscriptas = finals.filter((f) => f.Inscripto === 1);

  return (
    <div className="final-exams-container">
      <div className="final-exams-header">
        <h1>{isMobile ? getAbreviatura() : nombreCarrera}</h1>
        <div className="user-info-container">
          <div className="user-info-card">
            <span>📚 Exámenes Finales</span>
          </div>
        </div>
      </div>

      <div className="final-exams-grid">
        
        {/* ======================= */}
        {/*       INSCRIPTAS        */}
        {/* ======================= */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBookBookmark /> Inscriptas ({materiasInscriptas.length})</h2>

            {materiasInscriptas.length ? materiasInscriptas.map((final) => (
              <div key={final.Numero} className="final-item inscripta">
                <h3 className="final-subject">{final.Abreviatura}</h3>

                <div className="final-info-grid">
                  <span><FaCalendarAlt /> {final.Fecha}</span>
                  <span><FaClock /> {final.Hora}</span>
                  <span><FaMapMarkerAlt /> {final.Lugar}</span>
                  <span><FaUserGraduate /> {final.Titular}</span>
                </div>

                <button className="action-button regular" onClick={() => handleDeregister(final)}>
                  Desinscribirse
                </button>
              </div>
            )) : <p className="empty-state">No hay materias inscriptas</p>}
          </div>
        </div>

        {/* ======================= */}
        {/*      DISPONIBLES        */}
        {/* ======================= */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBook /> Disponibles ({materiasDisponibles.length})</h2>

            {materiasDisponibles.length ? materiasDisponibles.map((final) => (
              <div key={final.Numero}
                className={`final-item disponible ${
                  final.Asistencia === "0" || final.PerdioTurno === "1" ? "disabled" : ""
                }`}
              >
                <h3 className="final-subject">{final.Abreviatura}</h3>
                {final.Libre === "1" && <span className="libre-badge">Libre</span>}

                <div className="final-info-grid">
                  <span><FaCalendarAlt /> {final.Fecha}</span>
                  <span><FaClock /> {final.Hora}</span>
                  <span><FaMapMarkerAlt /> {final.Lugar}</span>
                  <span><FaUserGraduate /> {final.Titular}</span>
                </div>

                <button
                  disabled={final.Asistencia === "0" || final.PerdioTurno === "1"}
                  onClick={() => handleRegister(final)}
                  className={`action-button ${final.Libre === "1" ? "libre" : "regular"}`}
                >
                  {final.Libre === "1" ? "Inscribirse (Libre)" : "Inscribirse"}
                </button>

                {(final.Asistencia === "0" || final.PerdioTurno === "1") &&
                  <small className="disabled-reason">
                    {final.Asistencia === "0"
                      ? "No tiene asistencia suficiente"
                      : "Perdió el turno anterior"}
                  </small>}
              </div>
            )) : <p className="empty-state">No hay materias disponibles</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinalExams;
