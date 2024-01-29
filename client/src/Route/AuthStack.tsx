import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../Views/Login/LoginScreen';
import RegisterScreen from '../Views/Register/RegisterScreen';

// Create a stack navigator instance.
const {Navigator, Screen} = createStackNavigator();

// Define the AuthStack component.
const AuthStack = () => {
  return (
    // Define the stack navigator with two screens: Login and Register.
    <Navigator>
      <Screen name="Login" component={LoginScreen} />
      <Screen name="Register" component={RegisterScreen} />
    </Navigator>
  );
};

export default AuthStack;
