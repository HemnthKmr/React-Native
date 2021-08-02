import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  RefreshControl,
  FlatList,
  TouchableHighlight,
  Alert,
  Text,
  Pressable,
} from "react-native";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";
import { ListItem, Icon, FAB } from "react-native-elements";

const AudioPage = () => {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [recordData, setRecordData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isPlaying, setIsPlaying] = useState([false, ""]);

  useEffect(() => {
    (async () => {
      const album = await MediaLibrary.getAlbumAsync("Recordings");
      if (album !== null) {
        MediaLibrary.getAssetsAsync({
          mediaType: ["audio"],
          album: album,
        }).then((data) => {
          setRecordData(data);
        });
      }
    })();
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const saveFile = async (uri) => {
    const perm = await MediaLibrary.requestPermissionsAsync();
    if (perm.status != "granted") {
      return;
    }

    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("Recordings");

      if (album == null) {
        await MediaLibrary.createAlbumAsync(
          "com.ptsrecorder/Recordings",
          asset,
          false
        );
        onRefresh();
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        onRefresh();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteFile = async (uri) => {
    const album = await MediaLibrary.getAlbumAsync("Recordings");
    if (album !== null) {
      MediaLibrary.getAssetsAsync({
        mediaType: ["audio"],
        album: album,
      }).then((data) => {
        data.assets.forEach((element) => {
          if (uri == element.uri) {
            MediaLibrary.deleteAssetsAsync([element.id]);
            onRefresh();
          }
        });
      });
    }
  };

  async function playSound(uri) {
    console.log(uri);
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

  async function pauseSound(uri) {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: uri,
        overrideFileExtensionAndroid: "m4a",
      });
      setSound(sound);

      console.log("Pausing Sound");
      await sound.setStatusAsync({ shouldPlay: false });
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
    // setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    saveFile(uri);
    // playSound(uri);
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    (async () => {
      const album = await MediaLibrary.getAlbumAsync("Recordings");
      if (album !== null) {
        MediaLibrary.getAssetsAsync({
          mediaType: ["audio"],
          album: album,
        }).then((data) => {
          setRecordData(data);
          setRefreshing(false);
          console.log(data.assets.length);
        });
      }
      setRefreshing(false);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={false} style="light" />
      {recordData.assets && recordData.assets.length > 0 ? (
        <FlatList
          data={recordData.assets}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight
                onPress={() => {
                  if (!isPlaying[0] && isPlaying[1] !== item.uri) {
                    setIsPlaying([true, item.uri]);
                    playSound(item.uri);
                  } else if (isPlaying[0] && isPlaying[1] === item.uri) {
                    setIsPlaying([false, ""]);
                    pauseSound(item.uri);
                  } else if (isPlaying[0] && isPlaying[1] !== item.uri) {
                    setIsPlaying([true, item.uri]);
                    playSound(item.uri);
                  }
                }}
                underlayColor="gray"
              >
                <ListItem bottomDivider>
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
                </ListItem>
              </TouchableHighlight>
            );
          }}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text style={{ color: "red", width: 180 }}>No Recording.</Text>
          <Text style={{ color: "red", width: 180 }}>
            Press mic button to start new recording
          </Text>
        </View>
      )}

      <FAB
        title=""
        color="black"
        size="large"
        icon={<Icon name="mic-outline" type="ionicon" color="white" />}
        onPressIn={() => startRecording()}
        onPressOut={() => stopRecording()}
        style={{
          marginBottom: 10,
          position: "absolute",
          alignSelf: "center",
          bottom: 10,
        }}
      ></FAB>
    </View>
  );
};

export default AudioPage;
