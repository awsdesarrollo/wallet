import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Styles } from '#/utils';
import { CloseIcon } from '#/assets/icons';

const Modal = (props) => {
	return (
		<View style={ styles.container }>
			<View style={ [styles.containerModal,props.containerStyle || {}] }>
				{
					!props.withoutClose && (
						<View style={ [{ alignItems: 'flex-end', marginRight: 5 },props.closeStyle || {}] }>
							<TouchableOpacity onPress={ props.onClose }>
								<Image source={ CloseIcon } style={[styles.close, props.iconStyle]} />
							</TouchableOpacity>
						</View>
					)
				}				
				<View>
					{ props.children }
				</View>
			</View>
		</View>
	)	
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(0,0,0,0)',
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		zIndex: 99999,
		elevation: 99999,
		justifyContent: 'center',
		alignItems: 'center'
	},
	containerModal: {
		backgroundColor: Colors.white,
		minWidth: 100,
		minHeight: 50,
		borderRadius: 10,
		padding: 15,
		maxHeight: '90%',
		...Styles.shadow
	},
	close: {
		tintColor: Colors.black,
		width: 18,
		height: 18
	}
});

export default Modal;