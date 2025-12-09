import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteFinalInscription,
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal
} from "../services/finalsService";
import '../styles/Finales.css';
import CareerSelector from "../components/CareerSelector";

const Finales = () => {
  const [finalesDisponibles, setFinalesDisponibles] = useState([]);
  const [finalesInscriptos, setFinalesInscriptos] = useState([]);

  /** ⛑ Seguridad: si localStorage está vacío no rompe */
  const user = JSON.parse(localStorage.getItem("userData") ?? "{}");
  const carrera = JSON.parse(localStorage.getItem("careerData") ?? "{}");

  const permisoUsuario = user?.Permiso ?? null;
  const carreraUsuario = carrera?.Codigo ?? null;

  useEffect(() => {
    if (permisoUsuario && carreraUsuario) cargarFinales();
  }, [permisoUsuario, carreraUsuario]);

  /** 📌 Cargar finales con separación inscriptos / disponibles */
  const cargarFinales = async () => {
    try {
      const data = await getFinalExamsByStudentAndCareer(permisoUsuario, carreraUsuario);

      /** Access devuelve True como -1 -> Se normaliza */
      const isTrue = (val) => val === 1 || val === -1 || val === true;

      setFinalesInscriptos(data.filter(f => isTrue(f.Inscripto)));
      setFinalesDisponibles(data.filter(f => !isTrue(f.Inscripto)));

    } catch (error) {
      console.error("Error cargando finales:", error);
      Swal.fire("Error", "No se pudieron cargar los finales", "error");
    }
  };

  /** 📘 Inscribirse a un final */
  const inscribir = async (numeroMesa) => {
    try {
      await registerStudentToFinal({
        Mesa: numeroMesa,
        Alumno: permisoUsuario,
        Cursada: 1,
        Libre: 0
      });

      const finalSeleccionado = finalesDisponibles.find(f => f.Numero === numeroMesa);
      const finalActualizado = { ...finalSeleccionado, Inscripto: 1 };

      setFinalesInscriptos(prev => [...prev, finalActualizado]);
      setFinalesDisponibles(prev => prev.filter(f => f.Numero !== numeroMesa));

      Swal.fire("✔ Inscripción confirmada", "Te anotaste correctamente", "success");

    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo inscribir", "error");
    }
  };

  /** 📗 Cancelar inscripción */
  const cancelarInscripcion = async (numeroMesa) => {
    try {
      await deleteFinalInscription(numeroMesa, permisoUsuario);

      const finalCancelado = finalesInscriptos.find(f => f.Numero === numeroMesa);
      const finalActualizado = { ...finalCancelado, Inscripto: 0 };

      setFinalesInscriptos(prev => prev.filter(f => f.Numero !== numeroMesa));
      setFinalesDisponibles(prev => [...prev, finalActualizado]);

      Swal.fire("Inscripción cancelada", "Se eliminó correctamente", "info");

    } catch (error) {
      Swal.fire("Error al cancelar", error.message || "No se pudo cancelar la inscripción", "error");
    }
  };

  return (
    <div className="final-exams-container">

      <div className="final-exams-header">
        <h1>Finales</h1>
        <CareerSelector />
      </div>

      <div className="final-exams-grid">

        {/* DISPONIBLES */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">📘 Finales disponibles</h2>

            {finalesDisponibles.length === 0 && (
              <div className="empty-state"><p>No hay finales disponibles 🎓</p></div>
            )}

            {finalesDisponibles.map(f => (
              <div key={f.Numero} className="final-item disponible">
                <div className="final-header"><h3 className="final-subject">{f.Abreviatura}</h3></div>
                <div className="final-info-grid">
                  <div className="final-info-item"><b>Fecha:</b> {f.Fecha} - {f.Hora}</div>
                </div>
                <div className="final-actions">
                  <button className="action-button regular" onClick={() => inscribir(f.Numero)}>
                    Inscribirme
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INSCRIPTOS */}
        <div className="final-exams-column">
          <div className="final-exams-card">
            <h2 className="card-title">📗 Finales inscriptos</h2>

            {finalesInscriptos.length === 0 && (
              <div className="empty-state"><p>No estás inscripto en finales.</p></div>
            )}

            {finalesInscriptos.map(f => (
              <div key={f.Numero} className="final-item inscripta">
                <div className="final-header"><h3 className="final-subject">{f.Abreviatura}</h3></div>
                <div className="final-info-grid">
                  <div className="final-info-item"><b>Fecha:</b> {f.Fecha} - {f.Hora}</div>
                </div>
                <div className="final-actions">
                  <button className="action-button libre" onClick={() => cancelarInscripcion(f.Numero)}>
                    Cancelar inscripción
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Finales;
