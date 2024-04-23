import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Constants } from '../utils';
import { HomeIcon, WithdrawalIcon, LogoutIcon, UserIcon } from '../assets/icons';

const BOTTOM_TAB_HEIGHT = 59;

const Items = [
	{ title: 'Inicio', page: 'Home', route: 'redirect', icon: HomeIcon },
	{ title: 'Retiros', page: 'Withdrawals', route: 'redirect', icon: WithdrawalIcon },
	{ title: 'Perfil', page: 'Profile', route: 'redirect', icon: UserIcon },
];

const ItemsAdmin = [];

const Menu = (props) => {
	const user = useSelector(state => state.user);
	const route = useRoute();
	const navigation = useNavigation();
	const [showModal, setShowModal] = useState(false);
	let menu = [];

	if (!!user) {
		switch (user.level_id) {
			case Constants.LEVELS.ADMIN:
				menu = ItemsAdmin;
				break;

			case Constants.LEVELS.CLIENT:
				menu = Items;
				break;
		}
	}

	const replace = (page, type = 'default') => {
		setShowModal(false);
		if (type === 'default') navigation.navigate(page)
		else {
			navigation.dispatch(
				CommonActions.reset({
					index: 0,
					routes: [
						{ name: page }
					],
				})
			)
		}
	}

	const logout = () => {
		setShowModal(false);
		replace('Logout', 'redirect');
	}

	return (
		<>
			{showModal && (
				<TouchableOpacity
					style={styles.backdrop}
					onPress={() => setShowModal(false)}
					activeOpacity={0.8}
				>
					{(user.level_id === Constants.LEVELS.ADMIN) && (
						<>
							<MenuButton
								icon={MenuReportIcon}
								onPress={() => replace('Reports')}
								label="Reportes"
							/>
						</>
					)}

					<MenuButton
						icon={LogoutIcon}
						onPress={() => logout()}
						label="Cerrar sesión"
					/>
				</TouchableOpacity>
			)}

			<View style={styles.container}>
				{menu.map((item, index) => {
					const isActive = route.name === item.page || route.name.startsWith(item.page);

					return (
						<TouchableOpacity
							key={index}
							onPress={() => {
								item.page === 'ShowModal'
									? setShowModal(true)
									: replace(item.page, item.route)
							}}
						>
							<View style={styles.item}>
								<Image source={item.icon} style={styles.icon(isActive)} />
								{/* <Text style={styles.label(isActive)}>{ item.title }</Text> */}
							</View>
						</TouchableOpacity>
					)
				})}
			</View>
		</>
	)
}

const MenuButton = ({ icon, onPress, label }) => (
	<TouchableOpacity
		style={styles.modalItem}
		onPress={onPress}
		activeOpacity={0.8}
	>
		<Image source={icon} style={styles.modalItemIcon} />
		<Text style={styles.modalItemText}>{ label }</Text>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		position: 'absolute',
		...StyleSheet.absoluteFill,
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
		marginBottom: BOTTOM_TAB_HEIGHT,
		paddingVertical: 20,
		paddingHorizontal: 16,
	},
	modalItem: {
		backgroundColor: Colors.blue,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 6,
		marginTop: 16,
		borderRadius: 20,
	},
	modalItemIcon: {
		width: 16,
		height: 16,
		resizeMode: 'contain',
		marginRight: 10,
	},
	modalItemText: {
		color: Colors.white,
	},
	container: {
		height: BOTTOM_TAB_HEIGHT,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#312E67',
		borderTopColor: '#3D3B83',
		borderTopWidth: 2,
	},
	item: {
		alignItems: 'center',
	},
	icon: (isActive = false) => ({
		width: 24,
		height: 24,
		resizeMode: 'contain',
		tintColor: isActive ? Colors.blue : undefined,
	}),
	label: (isActive = false) => ({
		fontSize: 12,
		marginTop: 2,
		color: isActive ? Colors.blue : Colors.gray3,
	}),
});

export default Menu;