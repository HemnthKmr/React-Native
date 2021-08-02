import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Button,
  RefreshControl,
  FlatList,
  TouchableHighlight,
  Alert,
  Text,
} from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";
import { ListItem, Icon } from "react-native-elements";

const AudioPage = () => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [recordData, setRecordData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const album = await MediaLibrary.getAlbumAsync("Download");
      MediaLibrary.getAssetsAsync({
        mediaType: ["audio"],
        album: album,
      }).then((data) => {
        setRecordData(data);
        // console.log(data, data.assets.length);
      });
    })();
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // useEffect(() => {

  // });

  const saveFile = async (uri) => {
    const perm = await MediaLibrary.requestPermissionsAsync();
    if (perm.status != "granted") {
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        onRefresh();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFile = async (uri) => {
    const asset = await MediaLibrary.createAssetAsync(uri);
    const album = await MediaLibrary.getAlbumAsync("Download");
    await MediaLibrary.removeAssetsFromAlbumAsync([asset], album);
    // onRefresh();
  };

  async function playSound(uri) {
    console.log("Loading Sound");
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: uri,
        overrideFileExtensionAndroid: "m4a",
      });
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (err) {
      Alert.alert(
        "File not found",
        "Click OK to refresh the page.",
        [{ text: "OK", onPress: () => onRefresh() }],
        { cancelable: false }
      );
    }
  }

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    saveFile(uri);
    // playSound(uri);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => {
      const album = await MediaLibrary.getAlbumAsync("Download");
      MediaLibrary.getAssetsAsync({
        mediaType: ["audio"],
        album: album,
      }).then((data) => {
        setRecordData(data);
        setRefreshing(false);
        console.log(data.assets.length);
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={false} style="light" />
      <FlatList
        data={recordData.assets}
        renderItem={({ item }) => {
          return item && Object.keys(item).length > 0 ? (
            <TouchableHighlight
              onPress={() => playSound(item.uri)}
              underlayColor="gray"
            >
              <ListItem bottomDivider>
                {/* <Avatar source={require("../assets/avatar.jpg")} /> */}
                <ListItem.Content>
                  <ListItem.Title>{item.filename}</ListItem.Title>
                  <ListItem.Subtitle>{item.uri}</ListItem.Subtitle>
                </ListItem.Content>
                <Icon
                  name="trash-outline"
                  type="ionicon"
                  color="red"
                  onPress={() => deleteFile(item.uri)}
                />
                {/* <ListItem.Chevron /> */}
              </ListItem>
            </TouchableHighlight>
          ) : (
            <Text>No Data Available</Text>
          );
        }}
        numColumns={1}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <Button
        title={recording ? "Stop Recording" : "Start Recording"}
        onPress={recording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default AudioPage;
