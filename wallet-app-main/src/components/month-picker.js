import React from 'react';
import MonthPicker from 'react-native-month-picker';
import { StyleSheet, Image, View, TouchableOpacity, Text } from 'react-native';
import { RightIcon, LeftIcon } from '#/assets/icons';
import { Colors } from '#/utils';
import moment from 'moment';

const _MonthPicker = (props) => {
	return (
		<React.Fragment>
			<MonthPicker
			  localeLanguage={ 'es' }
	          selectedDate={ props.value || new Date() }
	          minDate={ props.minDate }
	          maxDate={ props.maxDate }
	          onMonthChange={ (value) => {
	          	props.onChange(moment(value).format('YYYY-MM-DD'));
	          	props.onClose();
	          } }
	          nextIcon={
	          	<Image style={ styles.icon } source={ RightIcon } />
	          }
	          prevIcon={
	          	<Image style={ styles.icon } source={ LeftIcon } />
	          }
	          monthTextStyle={ {
	          	textTransform: 'capitalize',
	          	color: '#000'
	          } }
	        />
	        <View style={ { flexDirection: 'row' } }>
				<View style={ { flex: 1 } }>
					<TouchableOpacity onPress={ () => props.onClose() }>
						<View style={ styles.close }>
							<Text>{ 'Cerrar' }</Text>						
						</View>
					</TouchableOpacity>	
				</View>
			</View>
		</React.Fragment>		
	)
}

const styles = StyleSheet.create({
	icon: {
		width: 30,
		height: 30,
		resizeMode: 'contain'
	},
	close: {
		width: '100%',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.gray
	},
});

export default _MonthPicker;