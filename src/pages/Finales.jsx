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
    <div className="home-user-container">
      <div className="home-user-header">
        <h1>{isMobile ? getAbreviatura(nombreCarrera) : nombreCarrera}</h1>
        <div className="user-info-container">
          <div className="user-info-card">
            <span>📚 Exámenes Finales</span>
          </div>
        </div>
      </div>

      <div className="home-user-grid">
        <div className="home-user-column">
          <div className="home-user-card">
            <h2>
              <span>✅</span> Materias Inscriptas ({materiasInscriptas.length})
            </h2>
            {materiasInscriptas.length > 0 ? (
              materiasInscriptas.map((final) => (
                <div key={final.Numero} className="final-item">
                  <strong>{final.Abreviatura}</strong>
                  <div className="final-info">
                    <span className="final-aula">
                      <FaCalendarAlt /> {final.Fecha}
                    </span>
                    <span className="final-aula">
                      <FaClock /> {final.Hora}
                    </span>
                  </div>
                  <div className="final-info">
                    <span className="final-aula">
                      <FaMapMarkerAlt /> {final.Lugar}
                    </span>
                    <span className="final-aula">
                      <FaUserGraduate /> {final.Titular}
                    </span>
                  </div>
                  <div className="mt-3">
                    <button
                      className="cta-button"
                      onClick={() => handleDeregister(final)}
                      style={{
                        backgroundColor: "#dc3545",
                        padding: "8px 20px",
                        fontSize: "0.9rem",
                      }}
                    >
                      Desinscribirse
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
                <p>No hay materias inscriptas</p>
              </div>
            )}
          </div>
        </div>

        <div className="home-user-column">
          <div className="home-user-card">
            <h2>
              <span>📖</span> Materias Disponibles ({materiasDisponibles.length}
              )
            </h2>
            {materiasDisponibles.length > 0 ? (
              materiasDisponibles.map((final) => (
                <div
                  key={final.Numero}
                  className="final-item"
                  style={{
                    borderLeftColor:
                      final.Libre === "1" ? "#ffc107" : "#667eea",
                    opacity:
                      final.Asistencia === "0" || final.PerdioTurno === "1"
                        ? 0.6
                        : 1,
                  }}
                >
                  <strong>
                    {final.Abreviatura}
                    {final.Libre === "1" && (
                      <span
                        style={{
                          marginLeft: "10px",
                          fontSize: "0.8rem",
                          color: "#ffc107",
                          backgroundColor: "#fff3cd",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        Libre
                      </span>
                    )}
                  </strong>
                  <div className="final-info">
                    <span className="final-aula">
                      <FaCalendarAlt /> {final.Fecha}
                    </span>
                    <span className="final-aula">
                      <FaClock /> {final.Hora}
                    </span>
                  </div>
                  <div className="final-info">
                    <span className="final-aula">
                      <FaMapMarkerAlt /> {final.Lugar}
                    </span>
                    <span className="final-aula">
                      <FaUserGraduate /> {final.Titular}
                    </span>
                  </div>
                  <div className="mt-3">
                    <button
                      className={
                        final.Libre === "1" ? "cta-primary" : "cta-button"
                      }
                      onClick={() => handleRegister(final)}
                      disabled={
                        final.Asistencia === "0" || final.PerdioTurno === "1"
                      }
                      style={{
                        padding: "8px 20px",
                        fontSize: "0.9rem",
                        backgroundColor:
                          final.Libre === "1" ? "#ffc107" : "#667eea",
                        color: final.Libre === "1" ? "#000" : "#fff",
                        border: final.Libre === "1" ? "none" : "none",
                        cursor:
                          final.Asistencia === "0" || final.PerdioTurno === "1"
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {final.Libre === "1"
                        ? "Inscribirse (Libre)"
                        : "Inscribirse"}
                    </button>
                    {(final.Asistencia === "0" ||
                      final.PerdioTurno === "1") && (
                      <small className="text-muted d-block mt-2">
                        {final.Asistencia === "0"
                          ? "No tiene asistencia suficiente"
                          : "Perdió el turno anterior"}
                      </small>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-4">
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
