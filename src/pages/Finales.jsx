import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteFinalInscription,
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal
} from "../services/finalsService";
import '../styles/Finales.css';

const Finales = () => {

  const usuario = JSON.parse(localStorage.getItem("userData")) || {};
  const permiso = usuario.Permiso;

  // carreras (1 o varias)
  let carrerasGuardadas = JSON.parse(localStorage.getItem("careerData")) || [];
  if (!Array.isArray(carrerasGuardadas)) carrerasGuardadas = [carrerasGuardadas];

  const [carreraActiva, setCarreraActiva] = useState(carrerasGuardadas[0] || null);
  const [finalesDisponibles, setFinalesDisponibles] = useState([]);
  const [finalesInscriptos, setFinalesInscriptos] = useState([]);

  // 🔥 Cargar finales al seleccionar carrera
  useEffect(() => {
    if (!permiso || !carreraActiva) return;
    cargarFinales();
  }, [permiso, carreraActiva]);

  const cargarFinales = async () => {
    try {
      const codigo = carreraActiva.Codigo || carreraActiva.codigo;

      const data = await getFinalExamsByStudentAndCareer(permiso, codigo);
      const finales = Array.isArray(data) ? data : [data];

      const guardados = JSON.parse(localStorage.getItem(`finalesInscriptos-${codigo}`)) || [];
      const disponibles = finales.filter(f => !guardados.some(g => g.Numero === f.Numero));

      setFinalesDisponibles(disponibles);
      setFinalesInscriptos(guardados);

    } catch (error) {
      console.error("❌ Error cargando finales:", error);
    }
  };

  // 📌 Inscribir alumno
  const inscribir = async (numeroMesa) => {
  try {
    const codigo = carreraActiva.Codigo || carreraActiva.codigo;

    await registerStudentToFinal({
      Mesa: numeroMesa,
      Alumno: permiso,
      Cursada: 0, // 0 = regular
      Libre: 0
    });

    const finalSel = finalesDisponibles.find(f => f.Numero === numeroMesa);

    const nuevosInscriptos = [...finalesInscriptos, finalSel];
    const nuevosDisponibles = finalesDisponibles.filter(f => f.Numero !== numeroMesa);

    setFinalesInscriptos(nuevosInscriptos);
    setFinalesDisponibles(nuevosDisponibles);

    localStorage.setItem(`finalesInscriptos-${codigo}`, JSON.stringify(nuevosInscriptos));

    Swal.fire("OK", "Inscripción confirmada", "success");

  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
};


  // ❌ Cancelar inscripción
  const cancelarInscripcion = async (numeroMesa) => {
    try {
      await deleteFinalInscription(numeroMesa, permiso);

      const finalCancelado = finalesInscriptos.find(f => f.Numero === numeroMesa);

      const nuevosInscriptos = finalesInscriptos.filter(f => f.Numero !== numeroMesa);
      const nuevosDisponibles = [...finalesDisponibles, finalCancelado];

      setFinalesInscriptos(nuevosInscriptos);
      setFinalesDisponibles(nuevosDisponibles);

      const codigo = carreraActiva.Codigo || carreraActiva.codigo;
      localStorage.setItem(`finalesInscriptos-${codigo}`, JSON.stringify(nuevosInscriptos));

      Swal.fire("OK", "Inscripción eliminada", "info");

    } catch (error) {
      Swal.fire("Error al cancelar", error.message, "error");
    }
  };

  return (
    <div className="final-exams-container">

      <div className="final-exams-header">
        <h1>Finales</h1>
      </div>

      {/* Selección de carrera */}
      <div className="career-select-box">
        <label><b>Seleccionar carrera:</b></label>
        <select
          value={carrerasGuardadas.indexOf(carreraActiva)}
          onChange={(e) => setCarreraActiva(carrerasGuardadas[e.target.value])}
        >
          {carrerasGuardadas.map((c, i) => (
            <option key={`${c.Codigo}-${i}`} value={i}>
              {c.Nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="user-info-card">
        <span>Permiso #{permiso}</span>
      </div>

      <div className="final-exams-grid">

        {/* DISPONIBLES */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2>📘 Finales disponibles</h2>
            {finalesDisponibles.length === 0 && <p>No hay finales disponibles</p>}

            {finalesDisponibles.map((f, i) => (
              <div key={`${f.Numero}-disp-${i}`} className="final-item disponible">
                <h3>{f.Abreviatura}</h3>
                <p><b>Fecha:</b> {f.Fecha} - {f.Hora}</p>
                <button onClick={() => inscribir(f.Numero)}>Inscribirme</button>
              </div>
            ))}
          </div>
        </div>

        {/* INSCRIPTOS */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2>📗 Finales inscriptos</h2>
            {finalesInscriptos.length === 0 && <p>No estás inscripto a ningún final</p>}

            {finalesInscriptos.map((f, i) => (
              <div key={`${f.Numero}-insc-${i}`} className="final-item inscripta">
                <h3>{f.Abreviatura}</h3>
                <p><b>Fecha:</b> {f.Fecha} - {f.Hora}</p>
                <button onClick={() => cancelarInscripcion(f.Numero)}>Cancelar</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Finales;
