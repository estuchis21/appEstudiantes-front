import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
} from "react-icons/fa";
import { FaBook, FaBookBookmark } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";
import {
  deleteFinalInscription,
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal,
} from "../services/finalsService";
import "../styles/Finales.css";

const FinalExams = () => {
  const [finals, setFinals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtención de datos del usuario
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const careerData = JSON.parse(localStorage.getItem("careerData")) || {};

  const permiso = userData?.Permiso || userData?.permiso || "";
  const codigo = careerData?.Codigo || careerData?.codigo || "";
  const nombreCarrera = formatCarreraName(careerData?.Nombre || "");

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

  // ==========================
  // CARGA PERSISTENTE
  // ==========================
  useEffect(() => {
    const storedFinals = JSON.parse(localStorage.getItem("finalsData"));

    if (storedFinals && storedFinals.length > 0) {
      console.log("📌 Finales cargados desde LocalStorage");
      setFinals(storedFinals);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
        setFinals(result || []);
        localStorage.setItem("finalsData", JSON.stringify(result || []));
      } catch (e) {
        Swal.fire("Error", "No se pudieron cargar los finales.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [permiso, codigo]);

  // ==========================
  // INSCRIBIR (con persistencia)
  // ==========================
  const handleRegister = async (final) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar inscripción?",
      text: `Estas por inscribirte en el final de ${final.Abreviatura}`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#667eea",
    });

    if (!confirm.isConfirmed) return;

    try {
      await registerStudentToFinal(final.Numero, permiso, final.Curso, final.Libre);

      setFinals(prev => {
        const updated = prev.map(f =>
          f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
        );
        localStorage.setItem("finalsData", JSON.stringify(updated));
        return updated;
      });

      Swal.fire("¡Listo!", "Inscripción realizada con éxito", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo inscribir.", "error");
    }
  };

  // ==========================
  // DESINSCRIBIR (con persistencia)
  // ==========================
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

      setFinals(prev => {
        const updated = prev.map(f =>
          f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
        );
        localStorage.setItem("finalsData", JSON.stringify(updated));
        return updated;
      });

      Swal.fire("¡Baja realizada!", "Se canceló tu inscripción", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo cancelar la inscripción.", "error");
    }
  };

  const materiasDisponibles = finals.filter(f => Number(f.Inscripto) === 0);
  const materiasInscriptas = finals.filter(f => Number(f.Inscripto) === 1);

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

        {/* ===================== INCRIPTAS ===================== */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBookBookmark /> Materias Inscriptas ({materiasInscriptas.length})</h2>

            {materiasInscriptas.length === 0 ? (
              <div className="empty-state"><p>No hay materias inscriptas</p></div>
            ) : materiasInscriptas.map(final => (
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
            ))}
          </div>
        </div>

        {/* ===================== DISPONIBLES ===================== */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title"><FaBook /> Materias Disponibles ({materiasDisponibles.length})</h2>

            {materiasDisponibles.length === 0 ? (
              <div className="empty-state"><p>No hay materias disponibles</p></div>
            ) : materiasDisponibles.map(final => (
              <div key={final.Numero} className="final-item disponible">
                <h3 className="final-subject">{final.Abreviatura}</h3>

                <div className="final-info-grid">
                  <span><FaCalendarAlt /> {final.Fecha}</span>
                  <span><FaClock /> {final.Hora}</span>
                  <span><FaMapMarkerAlt /> {final.Lugar}</span>
                  <span><FaUserGraduate /> {final.Titular}</span>
                </div>

                <button className="action-button libre" onClick={() => handleRegister(final)}>
                  Inscribirse
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinalExams;
