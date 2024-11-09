import React, { useState, useEffect } from "react";
import { Table, Button, Accordion, Card } from "react-bootstrap";
import { getFinalExamsByStudentAndCareer, registerStudentToFinal, deleteFinalInscription } from "../../services/finalsService";
import { useMediaQuery } from 'react-responsive';

const FinalExams = () => {
  const [finals, setFinals] = useState([]);
  const permiso = localStorage.getItem("permiso");
  const codigo = localStorage.getItem("codigoCarrera");
  const nombreCarrera = formatCarreraName(localStorage.getItem("nombreCarrera"));

  const isMobile = useMediaQuery({ maxWidth: 768 });

  // Función para darle formato al nombre de la carrera
  function formatCarreraName(nombre) {
    const palabrasMin = ["en", "de", "y"];
    return nombre
      .toLowerCase()
      .split(" ")
      .map((palabra) =>
        palabrasMin.includes(palabra) ? palabra : palabra.charAt(0).toUpperCase() + palabra.slice(1)
      )
      .join(" ");
  }

  // Función para mostrar abreviatura en móvil
  const getAbreviatura = () => {
    return "Tec. Sup. en Análisis, Desarrollo y Prog. de Aplicaciones";
  };
  
  // Cargar exámenes cuando el componente se monta
  useEffect(() => {
    const fetchFinalExams = async () => {
      try {
        const result = await getFinalExamsByStudentAndCareer(permiso, codigo);
        setFinals(result);
      } catch (error) {
        console.error("Error al obtener los exámenes:", error);
      }
    };

    fetchFinalExams();
  }, [permiso, codigo]);

  // Inscribir a un estudiante en un examen final
  const handleRegister = async (final) => {
    try {
      await registerStudentToFinal(final.Numero, permiso, final.Curso, final.Libre);
      alert("Inscripción realizada con éxito.");
      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 1 } : f
        )
      );
    } catch (error) {
      console.error("Error al inscribirse en el examen:", error);
    }
  };

  // Borrar la inscripción de un estudiante en un examen final
  const handleDeregister = async (final) => {
    try {
      await deleteFinalInscription(final.Numero, permiso);
      alert("Borrado de inscripción exitoso.");
      setFinals((prev) =>
        prev.map((f) =>
          f.Numero === final.Numero ? { ...f, Inscripto: 0 } : f
        )
      );
    } catch (error) {
      console.error("Error al borrarse del examen:", error);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2 style={{ textAlign: "center" }}>
        {isMobile ? getAbreviatura(nombreCarrera) : nombreCarrera}
      </h2>

           
      {!isMobile ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Código</th>
              <th>Asignatura</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Lugar</th>
              <th>Docente</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {finals.map((final) => (
              <tr key={final.Numero}>
                <td>{final.Codigo}</td>
                <td>{final.Abreviatura}</td>
                <td>{final.Fecha}</td>
                <td>{final.Hora}</td>
                <td>{final.Lugar}</td>
                <td>{final.Titular}</td>
                <td>
                  {final.Inscripto === 0 ? (
                    <Button
                      variant="primary"
                      onClick={() => handleRegister(final)}
                    >
                      Inscribirse
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      onClick={() => handleDeregister(final)}
                    >
                      Borrarse
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // Para versión celular
        <Accordion>
          {finals.map((final) => (
            <Card key={final.Numero}>
              <Accordion.Item eventKey={final.Numero}>
                <Accordion.Header>{final.Abreviatura}</Accordion.Header>
                <Accordion.Body>
                  <p><strong>Código:</strong> {final.Codigo}</p>
                  <p><strong>Fecha:</strong> {final.Fecha}</p>
                  <p><strong>Hora:</strong> {final.Hora}</p>
                  <p><strong>Lugar:</strong> {final.Lugar}</p>
                  <p><strong>Docente:</strong> {final.Titular}</p>
                  <Button
                    variant={final.Inscripto === 0 ? "primary" : "danger"}
                    onClick={() =>
                      final.Inscripto === 0 ? handleRegister(final) : handleDeregister(final)
                    }
                  >
                    {final.Inscripto === 0 ? "Inscribirse" : "Borrarse"}
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Card>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FinalExams;
