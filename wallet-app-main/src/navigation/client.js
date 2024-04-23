import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { screenOptions } from '#/navigation';

// Goals
import HomeClient from '#/screens/client/home/home';
import WithdrawalsClient from '#/screens/client/withdrawals/withdrawals';
import WithdrawalsSuccessClient from '#/screens/client/withdrawals/success';
import ProfileMainClient from '#/screens/client/profile/main';
import ProfileClient from '#/screens/client/profile/profile';
import ProfileNotificationsClient from '#/screens/client/profile/notifications';

import LogoutScreen from '#/screens/logout';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeClient} />
    </Stack.Navigator>
)

const WithdrawalsScreen = () => (
    <Stack.Navigator initialRouteName="Withdrawals" screenOptions={screenOptions}>
        <Stack.Screen name="Withdrawals" component={WithdrawalsClient} />
        <Stack.Screen name="WithdrawalsSuccess" component={WithdrawalsSuccessClient} />
    </Stack.Navigator>
)

const ProfileScreen = () => (
    <Stack.Navigator initialRouteName="ProfileMain" screenOptions={screenOptions}>
        <Stack.Screen name="ProfileMain" component={ProfileMainClient} />
        <Stack.Screen name="Profile" component={ProfileClient} />
        <Stack.Screen name="ProfileNotifications" component={ProfileNotificationsClient} />
    </Stack.Navigator>
)

const ClientDrawer = () => (
    <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{ swipeEnabled: false }}
    >
        <Drawer.Screen
            name="Home"
            component={HomeScreen}
        />
        <Drawer.Screen
            name="Withdrawals"
            component={WithdrawalsScreen}
        />
        <Drawer.Screen
            name="Profile"
            component={ProfileScreen}
        />
        <Drawer.Screen
            name="Logout"
            component={LogoutScreen} />
    </Drawer.Navigator>
)

export default ClientDrawer;