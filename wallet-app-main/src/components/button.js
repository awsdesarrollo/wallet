import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import Icon from './icon';
import { Colors, Styles } from '#/utils';

const Button = (props) => (
	<TouchableOpacity onPress={ props.onPress } activeOpacity={props.activeOpacity || 0}>
		<View style={ !props.social ? [styles.container,props.style || {}] : [styles.socialContainer, props.style] }>
			<View style={ { flex: .1 }}>
				{ props.icon && !props.iconRight && (
					<Icon name={ props.icon } 
						size={ props.iconSize }
						color={ props.iconColor }
					/>
				) }
			</View>
			<View style={ { flex: .8 }}>
				{ props.title && <Text style={ props.textStyle } numberOfLines={ props.nowrap ? 1 : null }>{ props.title }</Text> }
			</View>
			<View style={ { flex: .1 }}>
				{ props.icon && props.iconRight && (
					<Icon name={ props.icon } 
						size={ props.iconSize }
						color={ props.iconColor }
					/>
				) }
			</View>			
		</View>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	container: {
		alignSelf: 'flex-start',
		backgroundColor: Colors.orange,
		padding: 7,
		borderRadius: 10,
		height: 38,
		// paddingTop: Platform.OS == 'android' ? 5 : undefined
	},
	socialContainer: {
		backgroundColor: Colors.white,
		padding: 7,
		borderRadius: 20,
		height: 38,
		// paddingTop: Platform.OS == 'android' ? 5 : undefined
	}
});

export default Button;