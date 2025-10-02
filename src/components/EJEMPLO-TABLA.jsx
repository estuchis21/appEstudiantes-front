
import React, { useState, useEffect } from 'react';
import TablaReutilizable from './Tabla';
import listCoursesService from '../services/listCoursesService';

const CursadasPage = () => {
  const [cursadas, setCursadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCursadas = async () => {
      try {
        const data = await listCoursesService(13355, 75);
        setCursadas(data);
      } catch (error) {
        console.error('Error cargando cursadas:', error);
        setCursadas([]);
      } finally {
        setLoading(false);
      }
    };

    cargarCursadas();
  }, []);

  const columnas = [
    { key: "Curso", header: "Curso", align: "center" },
    { key: "Materia", header: "Materia" },
    { key: "Division", header: "Div", align: "center" },
    { 
      key: "Parcial1", 
      header: "P1", 
      align: "center",
      render: (fila) => fila.Parcial1 || "-"
    },
    { 
      key: "Parcial2", 
      header: "P2", 
      align: "center",
      render: (fila) => fila.Parcial2 || "-"
    },
    { 
      key: "AsistenciaPorcentaje", 
      header: "Asist.", 
      align: "center",
      render: (fila) => `${fila.AsistenciaPorcentaje || 0}%`
    }
  ];

  return (
    <div>
      <h1>Mis Cursadas</h1>
      <TablaReutilizable
        datos={cursadas}
        columnas={columnas}
        loading={loading}
        vacioMensaje="No hay cursadas para mostrar"
      />
    </div>
  );
};

export default CursadasPage;