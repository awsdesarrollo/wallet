import React from 'react';
import FastImageContainer from 'react-native-fast-image';

const FastImage = (props) => (
    <FastImageContainer
        { ...props }
        source={ {
            uri: props.source?.uri,
            priority: FastImageContainer.priority.high
        } }
        resizeMode={ props.style?.resizeMode || FastImageContainer.resizeMode.contain }
    />
)

export default FastImage;

const preload = (images = []) => {
	FastImageContainer.preload(images.map(i => {
		return {
			uri: i
		}
	}));
}

export {
	preload
}