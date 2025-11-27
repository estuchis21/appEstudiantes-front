import apiClient from './apiClient';

const loginService = async (data) => {
  const result = await apiClient('/session/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return result;
};

export default loginService;