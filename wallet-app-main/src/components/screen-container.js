import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Colors } from '#/utils';

const ScreenContainer = (props) => (
	<SafeAreaView style={ { flex: 1, backgroundColor: props.backgroundColor || Colors.white } }>
		<ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={props.verticalScroll}>
			{ props.children }
		</ScrollView>
	</SafeAreaView>
)

export default ScreenContainer;