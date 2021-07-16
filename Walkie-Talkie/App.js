import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ContactsList from "./components/ContactsList";
import QRScanner from "./components/QRScanner";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "QRScanner") {
              iconName = focused ? "qr-code" : "qr-code-outline";
            } else if (route.name === "Contacts") {
              iconName = focused ? "book" : "book-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "black",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="QRScanner" component={QRScanner} />
        <Tab.Screen name="Contacts" component={ContactsList} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
