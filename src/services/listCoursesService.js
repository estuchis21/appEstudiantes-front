// coursesService.js
import apiClient from './apiClient';

const listCoursesService = async (permiso, codigo) => {
  try {
    return await apiClient(`/session/cursadas/${permiso}/${codigo}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Error al recorrer la lista', error);
    throw error;
  }
};

export default listCoursesService;