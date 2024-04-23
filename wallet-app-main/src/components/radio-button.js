import React from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Colors } from '#/utils';

const RadioButton = ({ label, isChecked, onPress = () => {}, disabled = false }) => (
  <TouchableOpacity
    disabled={disabled}
    onPress={onPress}
    style={styles.wrapper}
  >
    <View style={styles.radioButton}>
    {label && <Text style={styles.label}>{label}</Text>}
      {isChecked ? (
        <View style={styles.radioButtonChecked}>
          <View style={styles.radioButtonCheckedInner} />
        </View>
      ) : (
        <View style={styles.radioButtonUnchecked} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  radioButton: {

  },
  radioButtonChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gray,
    borderColor: Colors.green,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonCheckedInner: {
    width: 14,
    height: 14,
    borderRadius: 10,
    backgroundColor: Colors.green,
  },
  radioButtonUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.gray,
    borderColor: Colors.gray3,
    borderWidth: 1,
  },
  label: {
    marginLeft: 5,
    color: Colors.text,
    marginBottom: 3
  },
});

export default RadioButton;