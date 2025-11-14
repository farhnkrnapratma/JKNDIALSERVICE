const ussdEngine = require('../services/ussdEngine');
const { v4: uuidv4 } = require('uuid');

/**
 * USSD Controller
 * Handle incoming USSD requests dari mobile app
 */

/**
 * @route POST /api/ussd
 * @desc Main USSD endpoint
 * @access Public
 */
const handleUssd = async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        error: 'sessionId is required'
      });
    }

    // Process USSD request
    const response = await ussdEngine.processRequest(
      sessionId,
      text || '',
      phoneNumber || 'Unknown',
      serviceCode || '*354#'
    );

    // Return response
    return res.json({
      sessionId,
      response
    });

  } catch (error) {
    console.error('USSD Controller Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * @route GET /api/ussd/test
 * @desc Test endpoint
 * @access Public
 */
const testUssd = (req, res) => {
  res.json({
    message: 'USSD API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      ussd: 'POST /api/ussd',
      docs: 'GET /api/docs'
    }
  });
};

module.exports = {
  handleUssd,
  testUssd
};
