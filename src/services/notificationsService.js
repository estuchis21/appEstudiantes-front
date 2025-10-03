// services/notificationsService.js
import apiClient from './apiClient';

export const getNotifications = async (permiso) => {
  try {
    const result = await apiClient(`/session/notifications/${permiso}`, {
      method: 'GET'
    });
    return result;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};
