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
import '../Styles/Finales.css';

const FinalExams = () => {
  const [finals, setFinals] = useState([]);
  const permiso = localStorage.getItem("permiso");
  const codigo = localStorage.getItem("codigoCarrera");
  const nombreCarrera = formatCarreraName(
    localStorage.getItem("nombreCarrera")
  );

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Función para darle formato al nombre de la carrera
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

  // Función para mostrar abreviatura en móvil
  const getAbreviatura = () => {
    return "Tec. Sup. en Análisis, Desarrollo y Prog. de Aplicaciones";
  };

  // Cargar exámenes cuando el componente se monta
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
    try {
      await registerStudentToFinal(
        final.Numero,
        permiso,
        final.Curso,
        final.Libre
      );
      alert("Inscripción realizada con éxito");
      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
        )
      );
    } catch (error) {
      alert("Error al inscribirse al final");
      console.error(error);
    }
  };

  const handleDeregister = async (final) => {
    try {
      await deleteFinalInscription(final.Numero, permiso);
      alert("Borrado de inscripción exitoso");
      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
        )
      );
    } catch (error) {
      alert("Error al borrarse del final");
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
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">
              <span><FaBookBookmark /></span> Materias Inscriptas ({materiasInscriptas.length})
            </h2>
            {materiasInscriptas.length > 0 ? (
              materiasInscriptas.map((final) => (
                <FinalItem 
                  key={final.Numero} 
                  final={final} 
                  type="inscripta"
                  onAction={handleDeregister}
                  actionText="Desinscribirse"
                />
              ))
            ) : (
              <EmptyState message="No hay materias inscriptas" />
            )}
          </div>
        </div>

        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">
              <span><FaBook /></span> Materias Disponibles ({materiasDisponibles.length})
            </h2>
            {materiasDisponibles.length > 0 ? (
              materiasDisponibles.map((final) => (
                <FinalItem 
                  key={final.Numero} 
                  final={final} 
                  type="disponible"
                  onAction={handleRegister}
                  actionText={final.Libre === "1" ? "Inscribirse (Libre)" : "Inscribirse"}
                />
              ))
            ) : (
              <EmptyState message="No hay materias disponibles" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para ítem de final
const FinalItem = ({ final, type, onAction, actionText }) => {
  const isDisabled = final.Asistencia === "0" || final.PerdioTurno === "1";
  const isLibre = final.Libre === "1";

  return (
    <div 
      className={`final-item ${type}`}
      style={{
        borderLeftColor: isLibre ? "#ffc107" : "#667eea",
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <div className="final-header">
        <strong className="final-subject">{final.Abreviatura}</strong>
        {isLibre && (
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
          className={`action-button ${isLibre ? 'libre' : 'regular'} ${isDisabled ? 'disabled' : ''}`}
          onClick={() => onAction(final)}
          disabled={isDisabled}
        >
          {actionText}
        </button>
        
        {isDisabled && (
          <div className="disabled-reason">
            {final.Asistencia === "0"
              ? "No tiene asistencia suficiente"
              : "Perdió el turno anterior"}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para estado vacío
const EmptyState = ({ message }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);

export default FinalExams;