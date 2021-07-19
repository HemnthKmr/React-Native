import React, { useEffect, useRef } from "react";
import { Input, Button } from "react-native-elements";
import { View, Text } from "react-native";

export default function Signup() {
  const inputFocus = useRef(null);

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  const handlePress = () => {
    console.log("Register Clicked");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Input
        ref={inputFocus}
        placeholder="Enter Email"
        leftIcon={{
          type: "materialIcons",
          name: "mail-outline",
        }}
        leftIconContainerStyle={{ paddingRight: 10 }}
      />
      <Input
        placeholder="Enter Password"
        leftIcon={{ type: "materialIcons", name: "lock-outline" }}
        rightIcon={{ type: "materialIcons", name: "visibility" }}
        secureTextEntry={true}
        leftIconContainerStyle={{ paddingRight: 10 }}
      />

      <Button
        type="solid"
        title="Sign Up"
        titleStyle={{ color: "white" }}
        // icon={{
        //   type: "materialIcons",
        //   name: "done",
        //   size: 20,
        //   color: "white",
        // }}
        buttonStyle={{
          backgroundColor: "black",
          paddingLeft: 50,
          paddingRight: 50,
          marginTop: 30,
        }}
      />
    </View>
  );
}
