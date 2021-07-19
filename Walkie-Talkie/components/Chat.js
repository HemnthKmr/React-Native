import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { StyleSheet, View, TextInput, Text } from "react-native";

const socket = io("http://127.0.0.1:5000");

const Chat = () => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(["msf", "test"]);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setChatMessages([...chatMessages, msg]);
    });
  }, []);

  const mapchatMessages = chatMessages.map((Message, index) => (
    <Text key={index} style={{ borderWidth: 2 }}>
      {Message}
    </Text>
  ));

  const submitChatMessage = () => {
    socket.emit("chat message", chatMessage);
    let value = [...chatMessages, chatMessage];
    setChatMessages(value);
    setChatMessage("");
  };

  return (
    <View style={styles.container}>
      {mapchatMessages}
      <TextInput
        style={{
          height: 40,
          borderWidth: 2,
          borderColor: "red",
        }}
        autoCorrect={false}
        value={chatMessage}
        onSubmitEditing={() => submitChatMessage()}
        onChangeText={(chatMessage) => {
          setChatMessage(chatMessage);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
});

export default Chat;
