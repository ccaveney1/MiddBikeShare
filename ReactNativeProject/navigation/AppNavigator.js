import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import RideScreen from '../screens/RideScreen';
import AdminScreen from '../screens/AdminScreen';
import BikesComponent from '../screens/admin_components/BikesComponent';
import UsersComponent from '../screens/admin_components/UsersComponent';



const AuthStack = createStackNavigator({ Login: LoginScreen });
const AppStack = createStackNavigator({ Home: HomeScreen, Ride: RideScreen, Admin: AdminScreen, Bikes: BikesComponent, Users: UsersComponent });


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));