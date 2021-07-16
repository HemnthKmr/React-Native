import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableHighlight,
} from "react-native";
import * as Contacts from "expo-contacts";
import { ListItem, Avatar } from "react-native-elements";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();

        if (data.length > 0) {
          const sortedData = data.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );
          setContacts(sortedData);
        }
      }
    })();
  }, []);

  const handlePress = (item) => {
    alert(`${item.phoneNumbers[0].number}`);
  };

  return contacts && contacts.length > 0 ? (
    <View style={styles.container}>
      <StatusBar translucent={false} style="light" />
      <View>
        <Text
          style={{
            fontSize: 25,
            color: "white",
            padding: 15,
            backgroundColor: "black",
          }}
        >
          Contacts
        </Text>
      </View>

      <FlatList
        data={contacts}
        renderItem={({ item }) => {
          return item.phoneNumbers && item.phoneNumbers.length > 0 ? (
            <TouchableHighlight
              onPress={() => handlePress(item)}
              underlayColor="gray"
            >
              <ListItem bottomDivider>
                <Avatar source={require("../assets/avatar.jpg")} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>
                    {item.phoneNumbers[0].number}
                  </ListItem.Subtitle>
                </ListItem.Content>
                {/* <ListItem.Chevron /> */}
              </ListItem>
            </TouchableHighlight>
          ) : null;
        }}
        numColumns={1}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  ) : (
    <View></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
