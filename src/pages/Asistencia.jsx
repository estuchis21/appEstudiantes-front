import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAsistenciasPorMateria } from "../services/asistenciasService";
import CareerSelector from "../components/CareerSelector"; // ← IMPORTADO

const Asistencias = () => {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const alumno = JSON.parse(localStorage.getItem("userData") ?? "{}");
  const carrera = JSON.parse(localStorage.getItem("careerData") ?? "{}");

  const permiso = alumno?.Permiso;
  const codigoCarrera = carrera?.Codigo;

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        let data = await getAsistenciasPorMateria(permiso, codigoCarrera);

        if (!Array.isArray(data)) {
          const posibles = [data?.materias, data?.rows, data?.data, data?.Asistencias, data];
          data = posibles.find(x => Array.isArray(x)) ?? [];
        }

        if (data.length === 0) Swal.fire("Sin registros", "No existen cursadas vigentes", "info");
        setMaterias(data);

      } catch {
        Swal.fire("Error", "No se pudieron cargar las asistencias", "error");
      } finally {
        setCargando(false);
      }
    };

    fetchAsistencias();
  }, [permiso, codigoCarrera]); // ← importante: recarga si cambia la carrera

  const getClasePorcentaje = (porcentaje) => {
    const num = parseInt(porcentaje);
    if (num >= 80) return "alto";
    if (num >= 60) return "medio";
    if (num >= 40) return "bajo";
    return "critico";
  };

  return (
    <div className="asistencias-container">

      <header>
        <h1>Registro de Asistencias</h1>
        <CareerSelector /> {/* 👈 Ahora aparece selector de carrera */}

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
                  <strong>{m.Materia}</strong><br />
                  Comisión/División: {m.Division}<br />
                  Profesor: {m.Profesor}<br />
                  Asistencia Hasta: {m.AsistenciaHasta}<br />
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
