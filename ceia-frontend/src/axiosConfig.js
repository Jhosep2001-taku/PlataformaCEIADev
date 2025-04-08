import axios from 'axios';
import { API_URL } from './config';
import { decrypt } from './utils/crypto'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const pendingRequests = new Map();

const getRequestKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
};

// Lista de rutas que permiten solicitudes duplicadas
const allowDuplicateRoutes = ['/usuarios', '/imagenes', '/historiales', '/solicitudes', '/equipos', '/mantenimientos','/solicitudPersonal'];

axiosInstance.interceptors.request.use(
  (config) => {
    const encryptedUserData = localStorage.getItem('userData');
    let token = null;

    if (encryptedUserData) {
      const userData = decrypt(encryptedUserData);
      if (userData && userData.token) {
        token = userData.token;
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Permitir solicitudes duplicadas para ciertas rutas
    const allowDuplicates = config.allowDuplicates || 
                            allowDuplicateRoutes.some(route => config.url.includes(route));

    if (!allowDuplicates) {
      const requestKey = getRequestKey(config);
      if (pendingRequests.has(requestKey)) {
        const message = `Solicitud duplicada cancelada: ${requestKey}`;
        //console.warn(message);
        return Promise.reject(new axios.Cancel(message));
      }
      pendingRequests.set(requestKey, true);
    }

    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => Promise.reject(error)
);

// El interceptor de respuesta se mantiene igual
axiosInstance.interceptors.response.use(
  (response) => {
    const requestKey = getRequestKey(response.config);
    pendingRequests.delete(requestKey);

    const endTime = new Date();
    const startTime = response.config.metadata.startTime;
    const duration = endTime - startTime;
    //console.log(`Solicitud ${requestKey} completada en ${duration}ms`);

    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      //console.log('Solicitud cancelada:', error.message);
    } else {
      const requestKey = error.config ? getRequestKey(error.config) : null;
      if (requestKey) {
        pendingRequests.delete(requestKey);
      }

      if (error.response && error.response.status === 401) {
        //console.error('Error de autenticación:', error.response.data);
      } else {
        //console.error('Error en la respuesta:', error.response?.data || error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;