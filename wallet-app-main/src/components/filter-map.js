import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Colors, Globals, Fonts } from '#/utils';
import { GoogleService } from '#/services';
import { Input } from '#/components';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';

class FilterMap extends React.Component {

    state = {
        results: [],
        place_id: null,
        search: ''
    }

    componentDidMount() {

    }

    debounce = React.createRef(null)

    searchPlace = (value) => {
        this.setState({ search: value });
        if (!value) {
            this.setState({ results: [] })
            return;
        };

        if (this.debounce.current) clearTimeout(this.debounce.current);
        this.debounce.current = setTimeout(() => {
            this.getAutocomplete(value)
        }, 800);
    }

    getAutocomplete = async (value) => {
        try {
            const res = await GoogleService.autocomplete({ input: value, withoutLoading: true });
            await this.setState({ results: res.predictions });

        } catch (error) {
            console.log(error)
        }
    }

    getCoords = async (place_id) => {
        const geoCode = await GoogleService.geoCode({ place: place_id });
        this.props.onSelect(geoCode?.data ? geoCode.data : null);
        this.props.onClose();
    }

    render() {
        const { results } = this.state;
        const { onClose } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>Buscar dirección</Text>
                    <TouchableOpacity onPress={onClose}>
                        <IconMaterialIcons
                            key={'close'}
                            size={30}
                            name="close"
                            solid={true}
                            color={Colors.white}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Input
                        placeholderTextColor={Colors.black}
                        onChangeText={e => this.searchPlace(e)}
                        placeholder={'Dirección'}
                        style={styles.input}
                        value={this.state.search}
                    />
                </View>
                <ScrollView style={styles.filterMap}>
                    {results.map((element, key) => (
                        <TouchableWithoutFeedback
                            key={key}
                            onPress={() => this.getCoords(element.place_id)}
                        >
                            <View style={styles.search}>
                                <Text style={styles.textSearch} numberOfLines={1}>
                                    {element.description}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    ))}
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    submitButtonContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 15
    },
    submitButton: {
        width: 150,
        padding: 10,
        backgroundColor: Colors.blue,
        borderRadius: 10,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    submitButtonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: Fonts.BOLD,
        color: Colors.white,
    },
    title: {
        color: Colors.white,
        textAlign: 'center',
        top: 7,
        fontFamily: Fonts.BOLD
    },
    titleBox: {
        backgroundColor: Colors.blue,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.gray2,
        marginHorizontal: 16,
        marginTop: 8,
    },
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white
    },
    filterMap: {
        width: '100%',
        top: 15,
        paddingLeft: 1,
        paddingRight: 1
    },
    search: {
        height: 50,
        borderBottomColor: Colors.black,
        borderBottomWidth: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    textSearch: {
        marginStart: 10,
        letterSpacing: 0,
        padding: 0,
        fontSize: 15
    },
})

export default connect(state => {
    return {
        location: state.location
    }
})(FilterMap);