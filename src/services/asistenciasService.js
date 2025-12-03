// asistenciasService.js
import apiClient from './apiClient';

// Obtener asistencias por materia según permiso y carrera
export const getAsistenciasPorMateria = async (permiso, carrera) => {
  try {
    return await apiClient(`/session/asistencias-materias/${permiso}/${carrera}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error al obtener asistencias por materia', error);
    throw error;
  }
};
