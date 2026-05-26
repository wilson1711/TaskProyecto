import axios from 'axios';

/**
 * Axios es una librería cliente HTTP basada en promesas para el navegador y node.js.
 * Nos permite realizar peticiones a servicios REST de forma sencilla.
 */
const axiosClient = axios.create({
  // baseURL: URL base que se antepondrá a cada petición.
  // Importante: En Vite usamos import.meta.env para acceder a variables de entorno.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // headers: Cabeceras comunes para todas las peticiones.
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // timeout: Tiempo máximo de espera para una respuesta (en milisegundos).
  timeout: 10000,
});

/**
 * Los Interceptores nos permiten ejecutar código o modificar la petición/respuesta
 * antes de que sea procesada por el .then() o .catch().
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (2xx), la devolvemos tal cual.
    return response;
  },
  (error) => {
    /**
     * Manejo global de errores.
     * Axios entrega el error en un objeto que contiene 'response' si el servidor respondió,
     * o 'request' si la petición se hizo pero no hubo respuesta.
     */
    const customError = {
      message: 'Ocurrió un error inesperado',
      status: error.response?.status || 500,
      data: error.response?.data || null
    };

    if (!error.response) {
      customError.message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else if (error.response.status === 404) {
      customError.message = 'El recurso solicitado no existe.';
    } else if (error.response.status === 400) {
      customError.message = 'Datos de solicitud inválidos.';
    } else if (error.response.status === 500) {
      customError.message = 'Error interno del servidor.';
    }

    // Rechazamos la promesa con nuestro error personalizado.
    return Promise.reject(customError);
  }
);

export default axiosClient;
