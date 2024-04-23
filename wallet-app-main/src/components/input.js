import React from 'react';
import { TextInput, StyleSheet, View, TouchableWithoutFeedback, Image } from 'react-native';
import { Colors } from '#/utils';
import { Icon } from '#/components';
import { Fonts } from '../utils';

const Input = (props) => (
	<View
		style={[
			styles.container,
			props.multiline && { alignItems: 'flex-start' },
			props.style || {}
		]}
		onTouchEnd={props.onTouch}
	>
		{
			props.icon && !props.iconRight && (
				<View style={{ flex: .1 }}>
					<TouchableWithoutFeedback onPress={props.onPressIcon}>
						<Image source={props.icon} style={[styles.icon, props.iconStyle || {}]} />
					</TouchableWithoutFeedback>
				</View>
			)
		}
		<View style={[{ flex: .9 }, props.inputBox]}>
			<TextInput
				{...props}
				value={props.value}
				style={[styles.input, props.inputStyle || {}]}
			/>
		</View>
		{
			props.icon && props.iconRight ?
				<View style={{ flex: .1, alignItems: 'center' }}>
					<TouchableWithoutFeedback onPress={props.onPressIcon}>
						<Image source={props.icon} style={[styles.icon, props.iconStyle || {}]} />
					</TouchableWithoutFeedback>
				</View>
				:
				<View style={{ flex: .1, alignItems: 'center' }} onTouchEnd={props.onPressIcon}>
					<TouchableWithoutFeedback>
						<Icon
							name={props.ion}
							color={Colors.white}
							size={25}
							style={ props?.ionStyle || styles.ionIcon }
						/>
					</TouchableWithoutFeedback>
				</View>

		}
		{
			props.iconSetRight &&
				<View style={{ flex: .1, alignItems: 'center' }}>
					<TouchableWithoutFeedback onPress={props.onPressRightIcon}>
						<Image source={props.iconSetRight} style={[styles.icon, props.iconStyle || {}]} />
					</TouchableWithoutFeedback>
				</View>
		}
	</View>
)

const styles = StyleSheet.create({
	ionIcon: {
		fontSize: 20
	},
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
		fontFamily: Fonts.REGULAR,
	},
	icon: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
		marginRight: 20
	}
});

export default Input;