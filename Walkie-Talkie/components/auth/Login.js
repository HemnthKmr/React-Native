import React, { useEffect, useState, useRef, useContext } from "react";
import { Input, Button } from "react-native-elements";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../context";
import { data } from "../../Data/LoginData";

export default function Login() {
  const inputFocus = useRef(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  useEffect(() => {
    inputFocus.current.focus();
  }, []);

  const handlePress = () => {
    console.log("Register Clicked");
  };

  const loginValidation = () => {
    const user = data.find((element) => element.email == username);
    if (user != undefined) {
      user.password == password ? signIn() : null;
    }
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
      <StatusBar translucent={false} style="light" />
      <Input
        ref={inputFocus}
        placeholder="Enter Email"
        leftIcon={{
          type: "materialIcons",
          name: "mail-outline",
        }}
        leftIconContainerStyle={{ paddingRight: 10 }}
        onChangeText={setUsername}
      />
      <Input
        placeholder="Enter Password"
        leftIcon={{ type: "materialIcons", name: "lock-outline" }}
        rightIcon={{ type: "materialIcons", name: "visibility" }}
        secureTextEntry={true}
        leftIconContainerStyle={{ paddingRight: 10 }}
        onChangeText={setPassword}
      />
      <View
        style={{
          paddingBottom: 20,
          marginLeft: 10,
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "gray" }}>
          Not a User?
          <Text style={{ color: "blue" }} onPress={handlePress}>
            {" "}
            Register Now
          </Text>
        </Text>
      </View>

      <Button
        type="solid"
        title="Sign In"
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
        onPress={loginValidation}
      />
    </View>
  );
}
