import ussdEngine from './ussdEngine';

export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const sendUssdRequest = async (sessionId, text, phoneNumber = '', serviceCode = '*354#') => {
  try {
    const response = ussdEngine.processRequest(text, phoneNumber);

    return {
      sessionId,
      response
    };
  } catch (error) {
    throw new Error(error.message || 'Terjadi kesalahan sistem');
  }
};

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
