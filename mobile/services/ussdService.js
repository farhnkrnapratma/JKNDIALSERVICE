import axios from 'axios';
import { API_CONFIG } from '../config';

/**
 * USSD Service
 * Handle komunikasi dengan backend USSD
 */

/**
 * Generate unique session ID
 */
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Send USSD request to backend
 * @param {string} sessionId - Unique session identifier
 * @param {string} text - User input text
 * @param {string} phoneNumber - User phone number (optional)
 * @param {string} serviceCode - USSD service code (default: *354#)
 */
export const sendUssdRequest = async (sessionId, text, phoneNumber = '', serviceCode = '*354#') => {
  try {
    const response = await axios.post(
      API_CONFIG.USSD_ENDPOINT,
      {
        sessionId,
        serviceCode,
        phoneNumber,
        text
      },
      {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Periksa koneksi internet.');
    } else if (error.response) {
      throw new Error(error.response.data.message || 'Server error');
    } else if (error.request) {
      throw new Error('Tidak dapat terhubung ke server. Pastikan backend berjalan dan IP sudah benar.');
    } else {
      throw new Error(error.message || 'Terjadi kesalahan');
    }
  }
};

/**
 * Parse USSD response
 * @param {string} response - Response from backend
 * @returns {object} Parsed response with type (CON/END) and message
 */
export const parseUssdResponse = (response) => {
  if (!response) {
    return { type: 'END', message: 'No response from server' };
  }

  if (response.startsWith('CON ')) {
    return {
      type: 'CON',
      message: response.substring(4)
    };
  } else if (response.startsWith('END ')) {
    return {
      type: 'END',
      message: response.substring(4)
    };
  }

  return {
    type: 'END',
    message: response
  };
};
