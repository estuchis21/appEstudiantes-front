import React, { useState , useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import listCoursesService from "../../services/listCoursesService";

const ListCourses = () => {

  const [registros, setRegistros] = useState([]);  // Estado para almacenar los registros
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8; // Define el número de registros por página
  const permiso = localStorage.getItem('permiso');
  const codigo = localStorage.getItem('codigoCarrera');


  // Función asincrónica para obtener los datos de la API
  const fetchData = async () => {
    try {
        // Llamamos a la función del servicio para obtener la lista de registros
        const result = await listCoursesService(permiso,codigo);
        // Actualizamos el estado 'registers' con los datos obtenidos
        setRegistros(result); // Establecer solo el primer elemento que contiene los registros
    } catch (error) {
        console.error('Error fetching users:', error);// Si ocurre un error, lo mostramos en la consola
    }
  };
  
  // useEffect se ejecuta después del primer renderizado y cuando el componente se actualiza
  useEffect(() => {
    fetchData();// Ejecutamos la función para obtener los datos
  }, []);


  // Calcula los índices de los registros a mostrar en la página actual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = registros.slice(indexOfFirstRecord, indexOfLastRecord);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(registros.length / recordsPerPage);

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

  return (
    
    <div className="container-fluid mt-1 px-4">
      <h4 className='mb-3'>Estado de las cursadas</h4>
      <div className="table-responsive text-center">
        <Table striped bordered hover className="table-sm">
        <thead>
          <tr>
            <th className="text-center align-middle">Curso</th>
            <th className="text-center align-middle">Div</th>
            <th className="text-center align-middle">Asignatura</th>
            <th className="text-center align-middle">1° Par</th>
            <th className="text-center align-middle">1° Rec</th>
            <th className="text-center align-middle">2° Par</th>
            <th className="text-center align-middle">2° Rec</th>
            <th className="text-center align-middle">Profesor/a</th>
            <th className="text-center align-middle">Porcentaje de asistencia</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((registro, index) => (
            <tr key={index}
            style={{ cursor: 'pointer' }}
            >
              <td className="text-center align-middle">{registro.Curso}</td>
              <td className="text-center align-middle">{registro.Division}</td>
              <td className="text-center align-middle">{registro["Materia"]}</td>
              <td className="text-center align-middle">{registro.Parcial1}</td>
              <td className="text-center align-middle">{registro.Recuperatorio1}</td>
              <td className="text-center align-middle">{registro.Parcial2}</td>
              <td className="text-center align-middle">{registro.Recuperatorio2}</td>
              <td className="text-center align-middle">{registro["Profesor"]}</td>
              <td className="text-center align-middle">{registro.AsistenciaPorcentaje} %</td>
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Pagination className="">
            <Pagination.Prev 
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)} 
                disabled={currentPage === 1} 
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <Pagination.Item 
                key={number} 
                active={number === currentPage} 
                onClick={() => handlePageChange(number)}>
                {number}
                </Pagination.Item>
            ))}
            <Pagination.Next 
                onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)} 
                disabled={currentPage === totalPages} 
            />
            </Pagination>
            <div style={{ display: 'flex', justifyContent: 'space-between' , marginBottom: '20px' }}>
        </div>
      </div>
 
    </div>
    


  );
};

export default ListCourses;