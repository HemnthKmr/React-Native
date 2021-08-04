/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text} from 'react-native';
import {Icon, FAB} from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
// import io from 'socket.io-client';

// const socket = io('http://127.0.0.1:5000');

const Room = () => {
    const route = useRoute();
  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <FAB
        title=""
        color="black"
        size="large"
        icon={<Icon name="mic-outline" type="ionicon" color="white" />}
       />
       <Text />
       <Text>Room ID: {route.params.RoomId}</Text>
    </View>
  );
};

export default Room;
