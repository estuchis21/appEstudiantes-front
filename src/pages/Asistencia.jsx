import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAsistenciasPorMateria } from "../services/asistenciasService";

const Asistencias = () => {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Tomar datos del LocalStorage
  const alumno = JSON.parse(localStorage.getItem("userData"));
  const carrera = JSON.parse(localStorage.getItem("careerData"));

  const permiso = alumno?.Permiso;

  const codigoCarrera = carrera?.Codigo;


  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const data = await getAsistenciasPorMateria(permiso, codigoCarrera);

        if (!data || data.length === 0) {
          Swal.fire("Sin registros", "No existen cursadas vigentes", "info");
        } else {
          setMaterias(data);
        }

      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar las asistencias", "error");
      } finally {
        setCargando(false);
      }
    };

    fetchAsistencias();
  }, []);

  // Determinar color del porcentaje
  const getClasePorcentaje = (porcentaje) => {
    const num = parseInt(porcentaje);
    if (num >= 80) return 'alto';
    if (num >= 60) return 'medio';
    if (num >= 40) return 'bajo';
    return 'critico';
  };

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

        {cargando ? (
          <p>Cargando asistencias...</p>
        ) : (
          <ul className="lista-materias">
            {materias.map((m, index) => {
              const porcentaje = m.AsistenciaPorcentaje ?? 0;

              return (
                <li key={index} className="item-materia">
                  <strong>{m.Materia}</strong> <br />
                  Comisión/División: {m.Division} <br />
                  Profesor: {m.Profesor} <br />
                  Asistencia Hasta: {m.AsistenciaHasta} <br />
                  Porcentaje:{" "}
                  <span className={`porcentaje-asistencia ${getClasePorcentaje(porcentaje)}`}>
                    <strong>{porcentaje}%</strong>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Asistencias;
