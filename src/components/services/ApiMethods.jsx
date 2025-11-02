import axios from 'axios';
import ApiConfigures from './ApiConfigures';

const apiInstance = axios.create({
  baseURL: ApiConfigures.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for auth token
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for global error handling
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

const extractErrorMessage = (error) => {
  // Handle different error response structures
  return error?.response?.data?.error?.message ||
         error?.response?.data?.message ||
         error?.message ||
         'An unexpected error occurred';
};

export const apiMethods = {
  get: async (url, params = {}, config = {}) => {
    try {
      const response = await apiInstance.get(url, { ...config, params });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const finalConfig = { ...config };
      
      // Handle FormData differently
      if (data instanceof FormData) {
        finalConfig.headers = {
          ...finalConfig.headers,
          'Content-Type': 'multipart/form-data',
        };
      }
      
      const response = await apiInstance.post(url, data, finalConfig);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  put: async (url, data, config = {}) => {
    try {
      const response = await apiInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  patch: async (url, data, config = {}) => {
    try {
      const response = await apiInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  delete: async (url, data = {}, config = {}) => {
    try {
      // Axios DELETE with body needs special handling
      const response = await apiInstance.delete(url, { 
        ...config, 
        data 
      });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  // Optional: Add request cancellation capability
  getCancelTokenSource: () => {
    return axios.CancelToken.source();
  }
};

export default apiMethods;

// --- Partner Shift Management API ---

/**
 * Create a new shift for a partner
 * @param {Object} data - { partner_id, hub_id, scheduled_start, scheduled_end }
 * @returns {Promise<Object>} Shift object with audit fields
 */
export const createShift = async (data) => {
  return await apiMethods.post('/partner-shifts', data);
};

/**
 * List shifts with optional filters and pagination
 * @param {Object} params - { partner_id, hub_id, status, start_date, end_date, page, limit }
 * @returns {Promise<{data: Array, total: number}>}
 */
export const listShifts = async (params = {}) => {
  return await apiMethods.get('/partner-shifts', params);
};

/**
 * Get a shift by ID
 * @param {string} id - Shift UUID
 * @returns {Promise<Object>} Shift object
 */
export const getShiftById = async (id) => {
  return await apiMethods.get(`/partner-shifts/${id}`);
};

/**
 * Update a shift (if not ended/cancelled)
 * @param {string} id - Shift UUID
 * @param {Object} data - Fields to update (hub_id, scheduled_start, scheduled_end)
 * @returns {Promise<Object>} Updated shift object
 */
export const updateShift = async (id, data) => {
  return await apiMethods.put(`/partner-shifts/${id}`, data);
};

/**
 * End a shift
 * @param {string} id - Shift UUID
 * @param {Object} data - { end_actor_type }
 * @returns {Promise<Object>} Updated shift object
 */
export const endShift = async (id, data) => {
  return await apiMethods.put(`/partner-shifts/${id}/end`, data);
};

/**
 * Cancel a shift
 * @param {string} id - Shift UUID
 * @param {Object} data - { updated_actor_type }
 * @returns {Promise<Object>} Updated shift object
 */
export const cancelShift = async (id, data) => {
  return await apiMethods.put(`/partner-shifts/${id}/cancel`, data);
};

/**
 * Get partner shift history
 * @param {string} partner_id - Partner UUID
 * @param {Object} params - { status, start_date, end_date }
 * @returns {Promise<Array>} Array of shift objects
 */
export const getPartnerShiftHistory = async (partner_id, params = {}) => {
  return await apiMethods.get(`/partner-shifts/partner/${partner_id}/history`, params);
};