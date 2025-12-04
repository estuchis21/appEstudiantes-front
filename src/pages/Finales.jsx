import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  deleteFinalInscription,
  getFinalExamsByStudentAndCareer,
  registerStudentToFinal
} from "../services/finalsService";

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
    <div style={{ padding:25 }}>

      {/* DISPONIBLES */}
      <h2>Finales disponibles</h2>
      {finalesDisponibles.length === 0 && <p>No hay finales para inscribirse 🎓</p>}

      <ul style={{ listStyle:"none", padding:0 }}>
        {finalesDisponibles.map(f => (
          <li key={f.Numero}
              style={{border:"1px solid #ccc",padding:12,marginBottom:10,borderRadius:6}}>

            <h3>{f.Abreviatura}</h3>
            <p><b>Fecha:</b> {f.Fecha} {f.Hora}</p>

            <button onClick={() => inscribir(f.Numero)}
              style={{background:"#1464d2",color:"#fff",padding:"8px 15px",
              border:"none",borderRadius:5,cursor:"pointer"}}>
              Inscribirme
            </button>

          </li>
        ))}
      </ul>


      {/* INSCRIPTOS */}
      <h2 style={{marginTop:30}}>Finales inscriptos</h2>
      {finalesInscriptos.length === 0 && <p>No estás inscripto en ningún final.</p>}

      <ul style={{ listStyle:"none", padding:0 }}>
        {finalesInscriptos.map(f => (
          <li key={f.Numero}
              style={{border:"1px solid green",padding:12,marginBottom:10,borderRadius:6}}>

            <h3>{f.Abreviatura}</h3>
            <p><b>Fecha:</b> {f.Fecha} {f.Hora}</p>
            <p style={{color:"green", fontWeight:"bold"}}>INSCRIPTO ✔</p>

            <button onClick={() => cancelarInscripcion(f.Numero)}
              style={{background:"red",color:"#fff",padding:"6px 12px",
              border:"none",borderRadius:5,cursor:"pointer",marginTop:8}}>
              Cancelar Inscripción
            </button>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default Finales;

