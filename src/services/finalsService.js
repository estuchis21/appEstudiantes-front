// finalsService.js
import apiClient from './apiClient';

export const getFinalExamsByStudentAndCareer = async (permiso, carrera) => {
  try {
    return await apiClient(`/session/finales/${permiso}/${carrera}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error al obtener los finales', error);
    throw error;
  }
};

export const deleteFinalInscription = async (Mesa, Alumno) => {
  try {
    return await apiClient('/session/delete-inscription', {
      method: 'PUT',
      body: JSON.stringify({ Mesa, Alumno }),
    });
  } catch (error) {
    console.error('Error al eliminar la inscripción', error);
    throw error;
  }
};

export const registerStudentToFinal = async (Mesa, Alumno, Cursada, Libre) => {
  try {
    return await apiClient('/session/inscribirfinal', {
      method: 'POST',
      body: JSON.stringify({ Mesa, Alumno, Cursada, Libre }),
    });
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
