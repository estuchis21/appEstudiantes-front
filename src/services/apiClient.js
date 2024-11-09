const BASE_URL = 'http://localhost:3000/api';

const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request error: ${error}`);
    throw error;
  }
};

export default apiClient;