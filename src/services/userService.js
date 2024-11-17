// Aca llamamos a la apiClient para traer las ruta base.
import apiClient from './apiClient';

export const changePass = async (newClave) => {
    try {
      return await apiClient('/session/changePassword', {
        method: 'PUT',
        body: JSON.stringify(newClave),
      });
    } catch (error) {
      console.error('Error al eliminar la inscripción', error);
      throw error;
    }
  };
  
  export const editDatos = async (phoneNumber,email,adress,permiso) => {
    try {
      return await apiClient(`/session/changeUserInfo/${permiso}`, {
        method: 'PUT',
        body: JSON.stringify({ phoneNumber,email,adress }),
      });
    } catch (error) {
      console.log('Error al inscribir al alumno', error);
      throw error;
    }
  };