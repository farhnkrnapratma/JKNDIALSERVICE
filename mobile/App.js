import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import Dialpad from './components/Dialpad';
import UssdPopup from './components/UssdPopup';
import {
  generateSessionId,
  sendUssdRequest,
  parseUssdResponse
} from './services/ussdService';
import { USSD_SERVICE_CODE } from './config';

/**
 * JKN USSD Simulator App
 * 
 * ⚠️ CATATAN PENTING:
 * Ini adalah prototipe simulasi USSD yang berjalan melalui WiFi.
 * Dial *354# hanya memicu request ke server backend internal.
 * Untuk implementasi USSD resmi, kode harus didaftarkan ke operator seluler.
 */

export default function App() {
  const [dialInput, setDialInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [ussdText, setUssdText] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('END');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate session ID saat app dibuka
    setSessionId(generateSessionId());
  }, []);

  const handleDialpadPress = (button) => {
    setDialInput(prev => prev + button);
  };

  const handleBackspace = () => {
    setDialInput(prev => prev.slice(0, -1));
  };

  const handleCall = async () => {
    if (!dialInput.trim()) {
      Alert.alert('Error', 'Masukkan kode USSD terlebih dahulu');
      return;
    }

    // Check if it's a USSD code
    if (!dialInput.includes('*') && !dialInput.includes('#')) {
      Alert.alert('Info', 'Ini adalah simulasi USSD. Gunakan kode seperti *354#');
      return;
    }

    // Start new USSD session
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setUssdText('');
    setDialInput('');

    // Show loading popup
    setPopupVisible(true);
    setLoading(true);
    setPopupMessage('Menghubungi JKN...');

    try {
      const response = await sendUssdRequest(newSessionId, '', '');
      const parsed = parseUssdResponse(response.response);

      setLoading(false);
      setPopupType(parsed.type);
      setPopupMessage(parsed.message);
      setUssdText('');

    } catch (error) {
      setLoading(false);
      setPopupVisible(false);
      Alert.alert(
        'Connection Error',
        error.message + '\n\nPastikan:\n1. Backend sudah running\n2. IP di config.js sudah benar\n3. Terhubung ke WiFi yang sama'
      );
    }
  };

  const handleUssdInput = async (input) => {
    const newUssdText = ussdText ? `${ussdText}*${input}` : input;
    setUssdText(newUssdText);

    setLoading(true);
    setPopupMessage('Memproses...');

    try {
      const response = await sendUssdRequest(sessionId, newUssdText, '');
      const parsed = parseUssdResponse(response.response);

      setLoading(false);
      setPopupType(parsed.type);
      setPopupMessage(parsed.message);

      // If END, reset session
      if (parsed.type === 'END') {
        setTimeout(() => {
          setUssdText('');
        }, 100);
      }

    } catch (error) {
      setLoading(false);
      setPopupVisible(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setUssdText('');
    // Generate new session for next call
    setSessionId(generateSessionId());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏥 JKN USSD Simulator</Text>
        <Text style={styles.headerSubtitle}>
          ⚠️ Prototipe Simulasi - Bukan USSD Operator Sesungguhnya
        </Text>
      </View>

      {/* Display Input */}
      <View style={styles.displayContainer}>
        <TextInput
          style={styles.display}
          value={dialInput}
          editable={false}
          placeholder="Ketik *354# lalu Call"
          placeholderTextColor="#999"
        />
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>📱 Dial: *354#</Text>
        <Text style={styles.infoSmall}>
          Simulasi via WiFi • Backend harus running
        </Text>
      </View>

      {/* Dialpad */}
      <View style={styles.dialpadContainer}>
        <Dialpad
          onPress={handleDialpadPress}
          onCall={handleCall}
          onBackspace={handleBackspace}
        />
      </View>

      {/* USSD Popup */}
      <UssdPopup
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        loading={loading}
        onClose={handleClosePopup}
        onInput={handleUssdInput}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          JKN Dial Service Simulator v1.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  header: {
    padding: 20,
    backgroundColor: '#009688',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0f2f1',
    textAlign: 'center'
  },
  displayContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  display: {
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'center',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#009688',
    color: '#333'
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 10
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#009688',
    marginBottom: 5
  },
  infoSmall: {
    fontSize: 12,
    color: '#666'
  },
  dialpadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  footerText: {
    fontSize: 12,
    color: '#999'
  }
});
