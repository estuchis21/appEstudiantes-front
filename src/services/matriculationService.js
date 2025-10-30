import apiClient from './apiClient';

// Registrar una nueva matriculación
export const registerMatriculation = async ({Alumno, Materia, Division, Libre, Profesor}) => {
  try {
    return await apiClient('/session/matricular', {
      method: 'POST',
      body: JSON.stringify({ Alumno, Materia, Division, Libre, Profesor }),
    });
  } catch (error) {
    console.error('Error al matricular al alumno:', error);
    throw error;
  }
};

// Eliminar una matriculación existente
export const deleteMatriculation = async (Alumno, Materia, Division) => {
  try {
    return await apiClient('/session/eliminarMatriculacion', {
      method: 'DELETE',
      body: JSON.stringify({ Alumno, Materia, Division }),
    });
  } catch (error) {
    console.error('Error al eliminar la matriculación:', error);
    throw error;
  }
};


// Obtener asignaturas pendientes para el alumno
export const getAsignaturasPendientes = async (permiso, carrera) => {
  try {
    const response = await apiClient(`/session/asignaturasPendientes/${permiso}/${carrera}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error al obtener asignaturas pendientes:', error);
    throw error;
  }
};


export const getCarrerasDelAlumno = async (permiso) => {
  try {
    const response = await apiClient(`/session/carrerasDelAlumno/${permiso}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error obteniendo carreras del alumno:', error);
    throw error;
  }
};

