import apiClient from './apiClient';

const loginService = async (data) => {
  try {
    const result = await apiClient('/session/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return result;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export default loginService;