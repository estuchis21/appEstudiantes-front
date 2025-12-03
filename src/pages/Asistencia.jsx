import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAsistenciasPorMateria } from "../services/asistenciasService";

const Asistencias = () => {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Tomar datos del alumno desde localStorage
  const alumno = JSON.parse(localStorage.getItem("datosAlumno"));
  const carrera = JSON.parse(localStorage.getItem("datosCarrera"));

  console.log("Datos Alumno desde localStorage:", alumno);
  console.log("Datos Carrera desde localStorage:", carrera);

  const permiso = alumno?.Permiso;
  const codigoCarrera = carrera?.Codigo;

  console.log("Permiso del Alumno:", permiso);
  console.log("Código de la Carrera:", codigoCarrera);

  useEffect(() => {
    const cargarAsistencias = async () => {
      try {
        const respuesta = await getAsistenciasPorMateria(permiso, codigoCarrera);

        if (!respuesta || respuesta.length === 0) {
          Swal.fire({
            icon: "info",
            title: "Sin asistencias",
            text: "No hay registros de asistencia para mostrar.",
          });
        } else {
          setMaterias(respuesta);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las asistencias del alumno.",
        });
      } finally {
        setCargando(false);
      }
    };

    if (permiso && codigoCarrera) {
      cargarAsistencias();
    }
  }, [permiso, codigoCarrera]);

  if (cargando) return <p>Cargando asistencias...</p>;

  return (
    <div className="asistencias-container">
      <header>
        <h1>Registro de Asistencias</h1>
        <h3>
          Alumno: {alumno?.Nombre} <br />
          Carrera: {carrera?.Nombre}
        </h3>
      </header>

      <section>
        <h2>Asistencias por Materia</h2>

        <ul className="lista-materias">
          {materias.map((materia, index) => {
            const porcentaje = materia.totalClases
              ? ((materia.asistencias / materia.totalClases) * 100).toFixed(1)
              : 0;

            return (
              <li key={index} className="item-materia">
                <strong>{materia.nombre}</strong> <br />
                Comisión: {materia.comision} <br />
                Asistencias: {materia.asistencias} / {materia.totalClases} <br />
                Porcentaje: <strong>{porcentaje}%</strong>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Asistencias;
