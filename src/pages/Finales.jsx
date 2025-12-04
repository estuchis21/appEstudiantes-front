import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserGraduate } from "react-icons/fa";
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
  const [finalsRendidos, setFinalsRendidos] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const careerData = JSON.parse(localStorage.getItem("careerData")) || {};

  const permiso = userData?.Permiso ?? userData?.permiso ?? "";
  const codigo = careerData?.Codigo ?? careerData?.codigo ?? "";

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const formatCarreraName = (nombre) => {
    if (!nombre) return "";
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((p) => (palabrasMin.includes(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(" ");
  };

  const nombreCarrera = formatCarreraName(careerData?.Nombre);
  const abreviaturaCarrera = "Tec. Sup. en Análisis, Desarrollo y Prog. de Aplicaciones";


  // =========================================================================
  // 📌 Carga + persistencia (con respaldo offline ⚡)
  // =========================================================================
  useEffect(() => {

    const storedFinals = JSON.parse(localStorage.getItem("finalsData"));
    const storedRendidos = JSON.parse(localStorage.getItem("finalsRendidos"));

    if (storedFinals) setFinals(storedFinals);
    if (storedRendidos) setFinalsRendidos(storedRendidos);

    const fetchData = async () => {
      try {

        const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
        setFinals(result);
        localStorage.setItem("finalsData", JSON.stringify(result));

        const rendidosRes = await fetch(`http://localhost:3000/api/session/finales-rendidos/${permiso}/${codigo}`);
        const rendidosData = await rendidosRes.json();

        setFinalsRendidos(rendidosData);
        localStorage.setItem("finalsRendidos", JSON.stringify(rendidosData));

      } catch {
        Swal.fire("Offline", "No se pudo conectar. Usando datos guardados.", "info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [permiso, codigo]);


  // =========================================================================
  // 📌 Inscripción (con bloqueo si ya se rindió)
  // =========================================================================
  const handleRegister = async (final) => {

    if (finalsRendidos.some((r) => r.Codigo === final.Codigo))
      return Swal.fire("No disponible", "Ya rendiste esta materia.", "warning");

    const confirm = await Swal.fire({
      title: "¿Confirmar inscripción?",
      text: `Inscribirse a ${final.Abreviatura}`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonColor: "#667eea",
    });

    if (!confirm.isConfirmed) return;

    try {
      await registerStudentToFinal(final.Numero, permiso, final.Curso, final.Libre);

      const updated = finals.map((f) =>
        f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
      );

      setFinals(updated);
      localStorage.setItem("finalsData", JSON.stringify(updated));

      Swal.fire("OK!", "Inscripción realizada", "success");

    } catch {
      Swal.fire("Error", "No se pudo inscribir, mesa cerrada.", "error");
    }
  };


  // =========================================================================
  // 📌 Dar baja
  // =========================================================================
  const handleDeregister = async (final) => {

    const confirm = await Swal.fire({
      title: "Cancelar inscripción?",
      text: `Final: ${final.Abreviatura}`,
      showCancelButton: true,
      confirmButtonText: "Sí",
      confirmButtonColor: "#dc3545",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteFinalInscription(final.Numero, permiso);

      const updated = finals.map(f =>
        f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
      );

      setFinals(updated);
      localStorage.setItem("finalsData", JSON.stringify(updated));

      Swal.fire("Listo!", "Inscripción cancelada", "success");

    } catch {
      Swal.fire("Error", "No se pudo cancelar inscripción.", "error");
    }
  };


  // =========================================================================
  // 📌 CATEGORÍAS
  // =========================================================================

  const materiasInscriptas = finals.filter(f => Number(f.Inscripto) === 1);

  const materiasDisponibles = finals.filter(f =>
    Number(f.Inscripto) === 0 &&
    !finalsRendidos.some(r => r.Codigo === f.Codigo) // NO mostrar rendidos
  );

  // EXTRA 🔥 → mostrar rendidos como historial
  const materiasAprobadas = finalsRendidos.filter(f => f.Aprobada === "1");
  const materiasDesaprobadas = finalsRendidos.filter(f => f.Aprobada === "0");


  // =========================================================================
  // UI
  // =========================================================================

  if (loading) return <div className="loader">Cargando...</div>;

  return (
    <div className="final-exams-container">

      <h1>{isMobile ? abreviaturaCarrera : nombreCarrera}</h1>

      <div className="final-exams-grid">

        {/* ============================================ INSCRIPTAS ============================================ */}
        <FinalColumn title={<><FaBookBookmark /> Inscriptas ({materiasInscriptas.length})</>}>
          {materiasInscriptas.length === 0 ?
            <Empty msg="No tenés inscripciones activas" /> :
            materiasInscriptas.map(f => <FinalCard key={f.Numero} data={f} onCancel={() => handleDeregister(f)} />)}
        </FinalColumn>


        {/* ============================================ DISPONIBLES ============================================ */}
        <FinalColumn title={<><FaBook /> Disponibles ({materiasDisponibles.length})</>}>
          {materiasDisponibles.length === 0 ?
            <Empty msg="No hay mesas disponibles" /> :
            materiasDisponibles.map(f => <FinalCard key={f.Numero} data={f} onRegister={() => handleRegister(f)} />)}
        </FinalColumn>

      </div>

      <hr />

      {/* ============================================ HISTORIAL ============================================ */}
      <h2>📜 Historial Académico</h2>

      <FinalHistory title="Aprobadas" list={materiasAprobadas} color="green" />
      <FinalHistory title="Desaprobadas / Perdidas" list={materiasDesaprobadas} color="red" />

    </div>
  );
};


// ========================= COMPONENTES UI BASE ========================= //

const FinalColumn = ({ title, children }) => (
  <div className="final-exams-column">
    <div className="final-exams-card">
      <h2 className="card-title">{title}</h2>
      {children}
    </div>
  </div>
);

const FinalCard = ({ data, onRegister, onCancel }) => (
  <div className="final-item">
    <h3>{data.Abreviatura}</h3>
    <div className="final-info-grid">
      <span><FaCalendarAlt /> {data.Fecha}</span>
      <span><FaClock /> {data.Hora}</span>
      <span><FaMapMarkerAlt /> {data.Lugar}</span>
      <span><FaUserGraduate /> {data.Titular}</span>
    </div>

    {onRegister && <button className="action-button libre" onClick={onRegister}>Inscribirse</button>}
    {onCancel && <button className="action-button regular" onClick={onCancel}>Desinscribirse</button>}
  </div>
);

const Empty = ({ msg }) => <div className="empty-state"><p>{msg}</p></div>;

const FinalHistory = ({ title, list, color }) => (
  <>
    <h3 style={{ color }}>{title} ({list.length})</h3>
    {list.map((f, i) => (
      <p key={i}>• {f.Abreviatura} – Nota: {f.Nota}</p>
    ))}
  </>
);

export default FinalExams;
