import React from 'react';
import DatePicker from 'react-native-datepicker';
import { StyleSheet, View, Image } from 'react-native';
import { Colors, Styles } from '#/utils';
import { CalendarIcon } from '#/assets/icons';
import { connect } from 'react-redux';

const _DatePicker = (props) => {
	return (
		<View style={ [styles.container,props.style || {}] }>
			<DatePicker
				androidMode="spinner"
				locale={ props.lang }
				{...props}
				format={ props.format ? props.format : "DD-MM-YYYY" }
				onDateChange={ props.onValueChange }
				confirmBtnText={ 'Aceptar' }
				cancelBtnText={ 'Rechazar' }
				showIcon={ true }
				date={ props.value }
				style={ { width: '100%' } }
				customStyles={{
					dateIcon: {
						position: 'absolute',
						left: 0,
						top: 10,
						marginLeft: 5,
						tintColor: Colors.text,
						width: 20,
						height: 20,
						...props.iconStyle
					},
					dateInput: {
						borderWidth: 0,
						backgroundColor: Colors.white,
						marginLeft: 33,
						borderTopRightRadius: 3,
						borderBottomRightRadius: 3,
						alignItems: 'flex-start',
						paddingHorizontal: 5,
						height: 45,
						...props.dateInput,
					},
					dateText: {
						color: Colors.text,
						...props.dateText
					},
					disabled: {
						backgroundColor: Colors.white
					},
					placeholderText: {
						...props.placeholderTextStyle,
					}
				}}
				iconSource={ props.icon || CalendarIcon } />
		</View>		
	)
}

const styles = StyleSheet.create({
	container: {
		borderRadius: 5,
		height: 38,
		flexDirection: 'row',
		overflow: 'hidden',
		backgroundColor: Colors.white,
		borderColor: Colors.gray2,
		borderWidth: 1
	}
});

export default connect(state => {
	return {
		user: state.user
	}
})(_DatePicker)