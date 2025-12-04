import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteFinalInscription,
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal
} from "../services/finalsService";
import '../styles/Finales.css';

const Finales = () => {
  const [finalesDisponibles, setFinalesDisponibles] = useState([]);
  const [finalesInscriptos, setFinalesInscriptos] = useState([]);

  const user = JSON.parse(localStorage.getItem("userData")) || {};
  const permisoUsuario = user.Permiso;
  const carrera = JSON.parse(localStorage.getItem("careerData")) || {};
  const carreraUsuario = carrera.Codigo;

  useEffect(() => {
    cargarFinales();
  }, []);

  const cargarFinales = async () => {
    try {
      const data = await getFinalExamsByStudentAndCareer(permisoUsuario, carreraUsuario);

      const guardados = JSON.parse(localStorage.getItem("finalesInscriptos")) || [];
      const disponiblesFiltrados = data.filter(f => !guardados.some(g => g.Numero === f.Numero));

      setFinalesDisponibles(disponiblesFiltrados);
      setFinalesInscriptos(guardados);

    } catch (error) {
      console.error(error);
    }
  };

  const inscribir = async (numeroMesa) => {
    try {
      await registerStudentToFinal(numeroMesa, permisoUsuario, 1, 0);

      const finalSeleccionado = finalesDisponibles.find(f => f.Numero === numeroMesa);

      const nuevosInscriptos = [...finalesInscriptos, finalSeleccionado];
      const nuevosDisponibles = finalesDisponibles.filter(f => f.Numero !== numeroMesa);

      setFinalesInscriptos(nuevosInscriptos);
      setFinalesDisponibles(nuevosDisponibles);
      localStorage.setItem("finalesInscriptos", JSON.stringify(nuevosInscriptos));

      Swal.fire("Inscripción confirmada", "Te anotaste al final correctamente", "success");

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // 🔥 nuevo: cancelar inscripción
  const cancelarInscripcion = async (numeroMesa) => {
    try {
      await deleteFinalInscription(numeroMesa, permisoUsuario);

      const finalCancelado = finalesInscriptos.find(f => f.Numero === numeroMesa);

      const nuevosInscriptos = finalesInscriptos.filter(f => f.Numero !== numeroMesa);
      const nuevosDisponibles = [...finalesDisponibles, finalCancelado];

      setFinalesInscriptos(nuevosInscriptos);
      setFinalesDisponibles(nuevosDisponibles);
      localStorage.setItem("finalesInscriptos", JSON.stringify(nuevosInscriptos));

      Swal.fire("Inscripción eliminada", "Ya no estás anotado en ese final", "info");

    } catch (error) {
      Swal.fire("Error al cancelar", error.message, "error");
    }
  };

  return (
    <div className="final-exams-container">

      <div className="final-exams-header">
        <h1>Finales</h1>
      </div>

      <div className="user-info-container">
        <div className="user-info-card">
          <span>Alumno #{permisoUsuario}</span>
        </div>
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
                <div className="final-header">
                  <h3 className="final-subject">{f.Abreviatura}</h3>
                </div>

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
                <div className="final-header">
                  <h3 className="final-subject">{f.Abreviatura}</h3>
                </div>

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

