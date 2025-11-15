/**
 * IMPORTANT: Update this IP address to match your computer's local IP!
 * 
 * How to find your IP:
 * - Windows: ipconfig (look for IPv4 Address)
 * - Mac/Linux: hostname -I or ip addr show
 * 
 * Make sure your phone and computer are on the same WiFi network!
 */
const API_BASE_URL = 'http://192.168.1.14:3000'; // TODO: UPDATE THIS IP!

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  USSD_ENDPOINT: `${API_BASE_URL}/api/ussd`,
  TIMEOUT: 10000
};
