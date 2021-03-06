import React, { useState, useEffect, useMemo } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getHeaderTitle } from "@react-navigation/elements";
import ContactsList from "./components/ContactsList";
import QRScanner from "./components/QRScanner";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Profile from "./components/auth/Profile";
import Chat from "./components/Chat";
import AudioPage from "./components/AudioPage";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "./components/context";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
// const ContactsStack = createStackNavigator();
// const AudioStack = createStackNavigator();

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

  // const ContactStackScreen = () => {
  //   return (
  //     <ContactsStack.Navigator>
  //       <ContactsStack.Screen
  //         name="Contacts"
  //         component={ContactsList}
  //         options={{
  //           headerStyle: {
  //             backgroundColor: "black",
  //           },
  //           headerTintColor: "#fff",
  //           headerTitleStyle: {
  //             fontStyle: "normal",
  //           },
  //         }}
  //       />
  //     </ContactsStack.Navigator>
  //   );
  // };

  // const AudioStackScreen = () => {
  //   return (
  //     <AudioStack.Navigator>
  //       <AudioStack.Screen
  //         name="Recording"
  //         component={AudioPage}
  //         options={{
  //           headerStyle: {
  //             backgroundColor: "black",
  //           },
  //           headerTintColor: "#fff",
  //           headerTitleStyle: {
  //             fontStyle: "normal",
  //           },
  //         }}
  //       />
  //     </AudioStack.Navigator>
  //   );
  // };

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
                } else if (route.name === "Audio") {
                  iconName = focused ? "mic" : "mic-outline";
                } else if (route.name === "Chat") {
                  iconName = focused ? "chatbox" : "chatbox-outline";
                }

                return <Ionicons name={iconName} size={size} color={color} />;
              },
              headerStyle: {
                backgroundColor: "black",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontStyle: "normal",
              },
              tabBarActiveTintColor: "black",
              tabBarInactiveTintColor: "gray",
            })}
          >
            <Tab.Screen name="Contacts" component={ContactsList} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="QRScanner" component={QRScanner} />
            <Tab.Screen name="Audio" component={AudioPage} />
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
