import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Config from 'react-native-config';
const { GOOGLE_MAPS } = Config;

const Maps = (props) => {
    return (
        <MapView
            {...props}
            region={props.region}
            key={props.key}
            provider={PROVIDER_GOOGLE}
            apikey={GOOGLE_MAPS}
        >
            { props.children }
        </MapView>
    )
}

export default Maps;