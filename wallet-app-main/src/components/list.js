import React from 'react';
import { View, StyleSheet, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { Colors, Constants } from '../utils';
import { SwipeListView } from 'react-native-swipe-list-view';

const lazyLoad = (show) => (
    <>
        {
            show ?
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color={Colors.yellow} />
                </View>
                : <></>
        }
    </>
)

const List = (props) => (
    !props.swipe ?
        <FlatList
            {...props}
            ListEmptyComponent={props?.empty}
            keyExtractor={(item) => item.id}
            horizontal={props.horizontal ? props.horizontal : false}
            data={props.data}
            renderItem={({ item, index }) => props.render(item, index)}
            ListFooterComponent={!props.hideLoad ? <>{lazyLoad(props.load)}{props.footer ? props.footer() : null}</> : <></>}
            onEndReachedThreshold={props.distance || Constants.THRESHOLD_DISTANCE}
            onEndReached={props.onEndReached}
        />
        :
        <SwipeListView
            {...props}
            ListEmptyComponent={props?.empty}
            data={props.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => props.render(item, index)}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={!props.hideLoad ? <>{lazyLoad(props.load)}{props.footer ? props.footer() : null}</> : <></>}
            onEndReachedThreshold={props.distance || Constants.THRESHOLD_DISTANCE}
            renderHiddenItem={({ item }) => props.renderLeft(item)}
            leftOpenValue={80}
        />
)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginTop: 20
    },
    horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10
    }
});

export default List;