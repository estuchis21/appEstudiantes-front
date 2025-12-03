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
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Verificar si la respuesta tiene contenido
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Si no es JSON, devolver el texto o un objeto vacío
      const text = await response.text();
      return text ? { message: text } : {};
    }
    
  } catch (error) {
    console.error(`API request error: ${error}`);
    throw error;
  }
};

export default apiClient;