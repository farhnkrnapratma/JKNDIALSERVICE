/**
 * JKN DIAL SERVICE PROTOTYPE - Mobile Application
 * 
 * Copyright (c) 2025 Global Palvion. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This source code is the proprietary and confidential information of
 * Global Palvion. Unauthorized copying, distribution, modification, or
 * use of this software, via any medium, is strictly prohibited without
 * the express written permission of Global Palvion.
 * 
 * For licensing inquiries: zainahmadfahrezi@gmail.com
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Dialpad from './components/Dialpad';
import UssdPopup from './components/UssdPopup';
import {
  generateSessionId,
  sendUssdRequest,
  parseUssdResponse
} from './services/ussdService';

export default function App() {
  const [dialInput, setDialInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [ussdText, setUssdText] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('END');
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    if (!dialInput.includes('*') || !dialInput.includes('#')) {
      Alert.alert('Info', 'Ini adalah simulasi USSD. Gunakan kode seperti *354#');
      return;
    }

    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setUssdText('');
    setDialInput('');

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
      Alert.alert('Error', error.message);
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
    setSessionId(generateSessionId());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>JKN Dial Service Prototype</Text>
      </View>

      <View style={styles.displayContainer}>
        <TextInput
          style={styles.display}
          value={dialInput}
          editable={false}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.dialpadContainer}>
        <Dialpad
          onPress={handleDialpadPress}
          onCall={handleCall}
          onBackspace={handleBackspace}
        />
      </View>

      <UssdPopup
        visible={popupVisible}
        type={popupType}
        message={popupMessage}
        loading={loading}
        onClose={handleClosePopup}
        onInput={handleUssdInput}
      />
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
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto'
    })
  },
  displayContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  display: {
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#009688',
    color: '#333',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto'
    })
  },
  dialpadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
