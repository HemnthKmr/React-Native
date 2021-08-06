/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState, useMemo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './src/components/context';
import Home from './src/components/pages/Home';
import Settings from './src/components/pages/Settings';
import Login from './src/components/auth/Login';
import Profile from './src/components/auth/Profile';
import Room from './src/components/pages/Room';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const HomeStack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(
    () => ({
      signIn: () => {
        setUserToken('fgkj');
        setIsLoading(false);
      },
      signOut: () => {
        setUserToken(null);
        setIsLoading(false);
      },
      signUp: () => {
        setUserToken('fgkj');
        setIsLoading(false);
      },
    }),
    [],
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const HomeScreen = () => {
    return (
      <HomeStack.Navigator>
        <HomeStack.Screen
          name="HomePage"
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontStyle: 'normal',
            },
          }}
        />
        <HomeStack.Screen
          name="Room"
          component={Room}
          options={{
            headerStyle: {
              backgroundColor: 'black',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontStyle: 'normal',
            },
          }}
        />
      </HomeStack.Navigator>
    );
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken !== null ? (
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'people' : 'people-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              headerStyle: {
                backgroundColor: 'black',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontStyle: 'normal',
              },
              tabBarActiveTintColor: 'black',
              tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Tab.Screen name="Settings" component={Settings} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerStyle: {
                  backgroundColor: 'black',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontStyle: 'normal',
                },
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
