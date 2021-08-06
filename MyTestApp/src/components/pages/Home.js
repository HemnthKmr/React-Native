/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {View} from 'react-native';
import {FAB} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';



const Home = () => {

    const navigation = useNavigation();

    // const userId = "hemanth";
    const RoomId = 300;

    const startRoom = () => {
      // socket.emit('join-room', RoomId, userId);
        navigation.navigate('Room',{
            RoomId
        });
    };


   

  return (
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <FAB
        title="Start Room"
        color="black"
        size="large"
        // icon={<Icon name="mic-outline" type="ionicon" color="white" />}
        onPress={startRoom}
       />
    </View>
  );
};

export default Home;
