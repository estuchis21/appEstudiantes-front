import apiClient from './apiClient';

// Obtener asistencias por materia según permiso y carrera
export const getAsistenciasPorMateria = async (permiso, carrera) => {
  try {
    const response = await apiClient(`/session/cursadas/${permiso}/${carrera}`, { 
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Error al obtener asistencias por materia', error);
    throw error;
  }
};
