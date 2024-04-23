import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BackIcon, Menu } from '#/assets/icons';
import { Colors, Fonts } from '#/utils';
import { DrawerActions } from '@react-navigation/native';

const openDrawer = (navigation) => {
	navigation.dispatch(DrawerActions.toggleDrawer());
}

const Header = (props) => {
	const canGoBack = props.navigation.canGoBack();
	const params = props?.scene?.route?.params || props?.scene?.route?.state?.routes[0].params || props?.params;
	const navigation = params?.navigation || props.navigation;

	if (params?.hideHeader)
		return null;
	else
		return (
			<View style={ [styles.container,params?.containerStyle || {}] }>
				<View style={ { flex: .1 } }>
					{ canGoBack && (
						<TouchableOpacity onPress={ params?.backAction || navigation.goBack }>
							<Image source={ BackIcon } style={ [styles.icon,params?.iconStyle || {}] } />
						</TouchableOpacity>
					) }
					{(!canGoBack && params?.showMenu) && (
							<TouchableOpacity onPress={ () => openDrawer(navigation) }>
								<Image source={ Menu } style={ [styles.icon,params?.iconStyle || {}] } />
							</TouchableOpacity>
					)}
					{(!canGoBack && params?.left) && params?.left}
				</View>
				<View style={ { flex: !canGoBack && params?.showMenu ? .8 : .9 } }>
					<Text style={ [styles.title,params?.titleStyle] }>{ params?.title }</Text>
				</View>
				<View style={ { flex: .1, justifyContent: 'center', alignItems: 'center' } }>
					{
						params?.right
					}
				</View>
			</View>
		)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: Colors.white,
		height: 45
	},
	title: {
		color: Colors.text,
		fontSize: 16,
		fontFamily: Fonts.BOLD,
		textAlign: 'center',
	},
	icon: {
		width: 22.5,
		height: 22.5,
		resizeMode: 'contain',
		tintColor: Colors.text,
	}
});

export default Header;