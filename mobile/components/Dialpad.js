import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Dialpad = ({ onPress, onCall, onBackspace }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <View style={styles.container}>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button) => (
            <TouchableOpacity
              key={button}
              style={styles.button}
              onPress={() => onPress(button)}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, styles.emptyButton]}
          activeOpacity={1}
        >
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={onCall}
          activeOpacity={0.7}
        >
          <MaterialIcons name="call" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.backspaceButton]}
          onPress={onBackspace}
          activeOpacity={0.7}
        >
          <MaterialIcons name="backspace" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8
  },
  button: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#333',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto'
    })
  },
  callButton: {
    backgroundColor: '#4CAF50'
  },
  backspaceButton: {
    backgroundColor: '#FF6B6B'
  },
  emptyButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0
  }
});

export default Dialpad;
