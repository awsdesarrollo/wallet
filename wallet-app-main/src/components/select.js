import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { Colors, Fonts } from '../utils';

const Select = (props) => {
	const items = props.items || [];
	const placeholder = { value: '', label: props.placeholder || 'Seleccione' };

	return (
		<View style={ [styles.container,props.style || {}] }>
			{
				props.icon && !props.iconRight && (
					<View style={ { flex: .1 } }>
						<TouchableWithoutFeedback onPress={ props.onPressIcon }>
							<Image source={ props.icon } style={ [styles.icon,props.iconStyle || {}] } />
						</TouchableWithoutFeedback>
					</View>
				)
			}
			<View style={ { flex: props.icon ? .9 : 1 } }>
				<RNPickerSelect
				    {...props}
				    useNativeAndroidPickerStyle={ false }
				    style={{
					  	inputAndroid: {...styles.input, ...props.textStyle},
					  	inputIOS: styles.input,
							placeholder: {
								color: Colors.gray + 'AA',
							},
					}}
				    doneText="Aceptar"
				    placeholder={ placeholder }
				    items={ items }
				/>
			</View>
			{
				props.icon && props.iconRight && (
					<View style={ { flex: .1, alignItems: 'center' } }>
						<TouchableWithoutFeedback onPress={ props.onPressIcon }>
							<Image source={ props.icon } style={ [styles.icon,props.iconStyle || {}] } />
						</TouchableWithoutFeedback>
					</View>		
				)
			}		
		</View>
	)	
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		marginBottom: 10,
		paddingLeft: 3,
		paddingRight: 3,
		borderRadius: 5,
		flexDirection: 'row',
		alignItems: 'center'
	},
	input: {
		height: 40,
		color: Colors.white,
		fontFamily: Fonts.REGULAR
	},
	icon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
		marginRight: 20
	},
});

export default Select;