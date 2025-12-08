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

      // Usamos el campo 'Inscripto' que viene de la base de datos (puede ser 1, -1 o true)
      // Nota: En bases de datos Access, 'True' suele devolverse como -1.
      const isTrue = (val) => val === 1 || val === -1 || val === true;

      const inscriptos = data.filter(f => isTrue(f.Inscripto));
      const disponibles = data.filter(f => !isTrue(f.Inscripto));

      setFinalesDisponibles(disponibles);
      setFinalesInscriptos(inscriptos);

    } catch (error) {
      console.error(error);
    }
  };

  const inscribir = async (numeroMesa) => {
    try {
      await registerStudentToFinal(numeroMesa, permisoUsuario, 1, 0);

      const finalSeleccionado = finalesDisponibles.find(f => f.Numero === numeroMesa);

      // Actualizamos el estado 'Inscripto' a 1
      const finalActualizado = { ...finalSeleccionado, Inscripto: 1 };

      const nuevosInscriptos = [...finalesInscriptos, finalActualizado];
      const nuevosDisponibles = finalesDisponibles.filter(f => f.Numero !== numeroMesa);

      setFinalesInscriptos(nuevosInscriptos);
      setFinalesDisponibles(nuevosDisponibles);

      Swal.fire("Inscripción confirmada", "Te anotaste al final correctamente", "success");

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const cancelarInscripcion = async (numeroMesa) => {
    try {
      await deleteFinalInscription(numeroMesa, permisoUsuario);

      const finalCancelado = finalesInscriptos.find(f => f.Numero === numeroMesa);

      // Actualizamos el estado 'Inscripto' a 0
      const finalActualizado = { ...finalCancelado, Inscripto: 0 };

      const nuevosInscriptos = finalesInscriptos.filter(f => f.Numero !== numeroMesa);
      const nuevosDisponibles = [...finalesDisponibles, finalActualizado];

      setFinalesInscriptos(nuevosInscriptos);
      setFinalesDisponibles(nuevosDisponibles);

      Swal.fire("Inscripción eliminada", "Ya no estás anotado en ese final", "info");

    } catch (error) {
      Swal.fire("Error al cancelar", error.message, "error");
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
