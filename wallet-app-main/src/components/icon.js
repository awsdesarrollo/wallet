import React from 'react';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const _Icon = (props) => (
	<Icon name={ props.name } size={ props.size } color={ props.color } style={ props.style } />
)

export default _Icon;