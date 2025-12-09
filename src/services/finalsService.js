// finalsService.js
import apiClient from './apiClient';

export const getFinalExamsByStudentAndCareer = async (permiso, carrera) => {
  try {
    const result = await apiClient(`/session/finales/${permiso}/${carrera}`, {
      method: 'GET',
    });
    return result;
  } catch (error) {
    console.error('Error al obtener los finales', error);
    throw error;
  }
};

export const deleteFinalInscription = async (Mesa, Alumno) => {
  try {
    const result = await apiClient('/session/delete-inscription', {
      method: 'PUT',
      body: JSON.stringify({ Mesa, Alumno }),
    });
    
    // Verificar si la respuesta tiene un mensaje de error
    if (result.mensaje && result.mensaje.includes('Error')) {
      throw new Error(result.mensaje);
    }
    
    return result;
  } catch (error) {
    console.error('Error al eliminar la inscripción', error);
    throw error;
  }
};

export const registerStudentToFinal = async ({ Mesa, Alumno, Cursada, Libre }) => {
  try {
    const result = await apiClient('/session/inscribirfinal', {
      method: 'POST',
      body: JSON.stringify({ Mesa, Alumno, Cursada, Libre }),
    });

    // Manejo de errores devueltos por el backend
    if (result.mensaje && (
      result.mensaje.includes('Error') || 
      result.mensaje.includes('no puede') ||
      result.mensaje.includes('no ha aprobado') ||
      result.mensaje.includes('ya fue impresa') ||
      result.mensaje.includes('límite máximo')
    )) {
      throw new Error(result.mensaje);
    }

    return result;
  } catch (error) {
    console.error('Error al inscribir al alumno', error);
    throw error;
  }
};

export const getFinalExamsTaken = async (permiso, carrera) => {
  try {
    return await apiClient(`/session/finales-rendidos/${permiso}/${carrera}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error al obtener los finales rendidos', error);
    throw error;
  }
};