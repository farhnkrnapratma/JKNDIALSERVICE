/**
 * API Shoot System - Entry Point
 * 
 * Modular system untuk integrasi dengan external services:
 * - BPJS/JKN API
 * - USSD Gateway Operator
 * - SMS/Email Gateway
 * - Payment Gateway
 * 
 * CATATAN:
 * Saat ini menggunakan dummy data dari database.
 * File ini siap untuk dikembangkan dengan API integration sesungguhnya.
 */

// JKN API Modules (Future)
// const kepesertaan = require('./jkn/kepesertaan');
// const tagihan = require('./jkn/tagihan');
// const faskes = require('./jkn/faskes');

// USSD Gateway Module (Future)
// const ussdGateway = require('./gateway/ussdGateway');

// Notification Modules (Future)
// const sms = require('./notification/sms');
// const email = require('./notification/email');

/**
 * Placeholder functions untuk future implementation
 */

const shoot = {
  // JKN API
  jkn: {
    getKepesertaan: async (nik) => {
      // TODO: Call real JKN API
      // return await kepesertaan.getData(nik);
      console.log('[SHOOT] JKN API - getKepesertaan:', nik);
      return { status: 'mock', nik };
    },
    
    getTagihan: async (nik) => {
      // TODO: Call real JKN API
      console.log('[SHOOT] JKN API - getTagihan:', nik);
      return { status: 'mock', nik };
    },
    
    getFaskes: async (kabupaten) => {
      // TODO: Call real JKN API
      console.log('[SHOOT] JKN API - getFaskes:', kabupaten);
      return { status: 'mock', kabupaten };
    }
  },

  // USSD Gateway
  ussd: {
    send: async (phoneNumber, message) => {
      // TODO: Send to USSD Gateway operator
      console.log('[SHOOT] USSD Gateway - send:', phoneNumber, message);
      return { status: 'mock', sent: true };
    }
  },

  // Notifications
  notification: {
    sendSMS: async (phoneNumber, message) => {
      // TODO: Send SMS via gateway
      console.log('[SHOOT] SMS - send:', phoneNumber, message);
      return { status: 'mock', sent: true };
    },
    
    sendEmail: async (email, subject, body) => {
      // TODO: Send email
      console.log('[SHOOT] Email - send:', email, subject);
      return { status: 'mock', sent: true };
    }
  }
};

module.exports = shoot;
