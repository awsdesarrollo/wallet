import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Button from './button';
import { Fonts, Colors } from '#/utils';

const Infinite = (props) => (
	<React.Fragment>
		{
			props.active < props.pages && props.pages > 1 && !props.loading && (
				<View style={ styles.container }>
					<Button
						textStyle={ styles.button }
						title={ 'Cargar más' }
						onPress={ props.onChange } />
				</View>
			)
		}
		{
			props.pages > 1 && props.loading && (
				<View style={ styles.container }>
					<ActivityIndicator size={ 30 } color={ Colors.blue } />
				</View>
			)
		}		
	</React.Fragment>
)

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 20
	},
	button: {
		alignSelf: 'center',
		fontFamily: Fonts.BOLD
	}
});

export default Infinite;