import React from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Styles, Globals } from '#/utils';
import { Button } from '#/components';
import { WaitingIcon } from '#/assets/icons';
import { connect } from 'react-redux';

class ModalWaiting extends React.Component {
	
	render() {

		return (
			<View style={{ paddingBottom: 30 }}>
				<Image source={ WaitingIcon } style={ styles.waiting } />
				<Text style={ styles.text }>Esperando verificación del admin</Text>
				<Text style={ styles.text }>Esto puede tardar</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		textAlign: 'center',
		marginVertical: 5
	},
	waiting: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		alignSelf: 'center',
		marginVertical: 20
	}
});

export default connect(state => {
	return {
		user: state.user
	}
})(ModalWaiting);