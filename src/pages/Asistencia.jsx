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
        setTimeout(() => {
            setAsistencias([
                { materia: "Álgebra I", fecha: "01/11/2024", Porcentaje: "90", profesor: "Dr. López" },
                { materia: "Geometría", fecha: "02/11/2024", Porcentaje: "15", profesor: "Mg. Torres" },
                { materia: "Pedagogía", fecha: "03/11/2024", Porcentaje: "99", profesor: "Lic. Díaz" },
                { materia: "Matemática Discreta", fecha: "04/11/2024", Porcentaje: "10", profesor: "Dra. García" },
                { materia: "Programación", fecha: "05/11/2024", Porcentaje: "60", profesor: "Ing. Martínez" },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const columnas = [
        { 
            key: "materia", 
            header: "Materia", 
            width: "250px",
            render: (fila) => <strong>{fila.materia}</strong>
        },
        { 
            key: "fecha", 
            header: "Fecha", 
            align: "center",
            render: (fila) => (
                <span style={{ fontWeight: '500' }}>{fila.fecha}</span>
            )
        },
        { 
            key: "Porcentaje", 
            header: "Porcentaje", 
            align: "center",
            render: (fila) => (
                <span className={`porcentaje-asistencia ${getClasePorcentaje(fila.Porcentaje)}`}>
                    {fila.Porcentaje}%
                </span>
            )
        },
        { 
            key: "profesor", 
            header: "Profesor",
            render: (fila) => (
                <span style={{ color: '#6c757d' }}>{fila.profesor}</span>
            )
        }
    ];

    // Función para determinar la clase CSS según el porcentaje
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
