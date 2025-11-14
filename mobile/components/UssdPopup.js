import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';

/**
 * USSD Popup Component
 * Mirip popup USSD asli GSM
 */
const UssdPopup = ({ visible, type, message, onClose, onInput, loading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onInput(inputValue);
      setInputValue('');
    }
  };

  const handleCancel = () => {
    setInputValue('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>USSD</Text>
          </View>

          {/* Content */}
          <ScrollView style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#009688" />
                <Text style={styles.loadingText}>Menghubungi JKN...</Text>
              </View>
            ) : (
              <Text style={styles.messageText}>{message}</Text>
            )}
          </ScrollView>

          {/* Input (only for CON type) */}
          {!loading && type === 'CON' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Masukkan pilihan"
                keyboardType="default"
                autoFocus={true}
                returnKeyType="send"
                onSubmitEditing={handleSend}
              />
            </View>
          )}

          {/* Buttons */}
          {!loading && (
            <View style={styles.buttonContainer}>
              {type === 'CON' ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={handleCancel}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>CANCEL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.sendButton]}
                    onPress={handleSend}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sendButtonText}>SEND</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.okButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  header: {
    backgroundColor: '#009688',
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  content: {
    padding: 20,
    maxHeight: 400
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: 'monospace'
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666'
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9'
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0'
  },
  button: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0'
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold'
  },
  sendButton: {
    backgroundColor: '#009688'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  okButton: {
    backgroundColor: '#009688'
  },
  okButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default UssdPopup;
