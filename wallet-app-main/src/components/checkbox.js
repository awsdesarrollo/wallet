import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../utils';

const Checkbox = ({ isChecked, isDisabled, onPress = () => {}, buttonStyles }) => {
  return (
    <TouchableOpacity
      style={[
        styles.checkWrapper,
        !isChecked && styles.checkWrapperUnchecked,
        isDisabled && styles.checkWrapperDisabled,
        buttonStyles
      ]}
      onPress={() => isDisabled ? {} : onPress()}
      activeOpacity={0.9}
    >
      <View style={styles.checkCircle} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
	checkWrapper: {
    width: 80,
		borderRadius: 15,
		backgroundColor: Colors.green,
		alignItems: 'flex-end',
	},
	checkWrapperUnchecked: {
		backgroundColor: Colors.red,
		alignItems: 'flex-start',
	},
	checkWrapperDisabled: {
		backgroundColor: Colors.gray2,
	},
  checkCircle: {
    backgroundColor: 'white',
    width: 25,
    height: 25,
		borderRadius: 25 / 2,
    borderWidth: 1,
    borderColor: Colors.gray2,
  },
});

export default Checkbox;