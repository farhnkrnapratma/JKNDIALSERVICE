const express = require('express');
const router = express.Router();
const { handleUssd, testUssd } = require('../controllers/ussdController');

/**
 * @swagger
 * /api/ussd:
 *   post:
 *     summary: USSD Main Endpoint
 *     description: Process USSD requests dari mobile app
 *     tags: [USSD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: Unique session identifier
 *               serviceCode:
 *                 type: string
 *                 description: USSD service code (e.g., *354#)
 *               phoneNumber:
 *                 type: string
 *                 description: User phone number
 *               text:
 *                 type: string
 *                 description: User input text
 *             example:
 *               sessionId: "abc123-def456"
 *               serviceCode: "*354#"
 *               phoneNumber: "081234567890"
 *               text: "1*3201234567890001"
 *     responses:
 *       200:
 *         description: USSD response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                 response:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/ussd', handleUssd);

/**
 * @swagger
 * /api/ussd/test:
 *   get:
 *     summary: Test USSD API
 *     description: Check if USSD API is running
 *     tags: [USSD]
 *     responses:
 *       200:
 *         description: API status
 */
router.get('/ussd/test', testUssd);

module.exports = router;
