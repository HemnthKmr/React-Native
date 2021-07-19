import React, { useState, useEffect, useMemo } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ContactsList from "./components/ContactsList";
import QRScanner from "./components/QRScanner";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/auth/Profile";
import Chat from "./components/Chat";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "./components/context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ContactsStack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const authContext = useMemo(
    () => ({
      signIn: () => {
        setUserToken("fgkj");
        setIsLoading(false);
      },
      signOut: () => {
        setUserToken(null);
        setIsLoading(false);
      },
      signUp: () => {
        setUserToken("fgkj");
        setIsLoading(false);
      },
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const ContactStackScreen = () => {
    return (
      <ContactsStack.Navigator>
        <ContactsStack.Screen
          name="Contacts"
          component={ContactsList}
          options={{
            headerStyle: {
              backgroundColor: "black",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontStyle: "normal",
            },
          }}
        />
      </ContactsStack.Navigator>
    );
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {userToken !== null ? (
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "QRScanner") {
                  iconName = focused ? "qr-code" : "qr-code-outline";
                } else if (route.name === "Contacts") {
                  iconName = focused ? "book" : "book-outline";
                } else if (route.name === "Profile") {
                  iconName = focused ? "people" : "people-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: "black",
              inactiveTintColor: "gray",
            }}
          >
            <Tab.Screen name="Contacts" component={ContactStackScreen} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="QRScanner" component={QRScanner} />
            <Tab.Screen name="Profile" component={Profile} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerStyle: {
                  backgroundColor: "black",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontStyle: "normal",
                },
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
