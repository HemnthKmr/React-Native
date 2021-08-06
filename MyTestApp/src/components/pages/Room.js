/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React,{useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {Icon, FAB} from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import {
  mediaDevices,
  RTCView
} from 'react-native-webrtc';
import io from 'socket.io-client';
import Peer from 'react-native-peerjs';
const socket = io('http://127.0.0.1:3000');


const Room = () => {

  const [myStream, setMyStream] = useState(null)
  const [streams, setStreams] = useState([])
  const [remoteStreams, setRemoteStreams] = useState([])

  console.log(streams);

  const route = useRoute();
  let roomId = route.params.roomId;

  const peerServer = new Peer(undefined, {
    host: '127.0.0.1',
    secure: false,
    port: 3000,
    path: '/mypeer'
  })  

  
  socket.on('user-connected', (userId) => {
    console.log('User connected:' + userId)
    connecttoNewUser(userId, stream)
  })

  peerServer.on('open', (userId) => {
    socket.emit('join-room', roomId, userId);
  })

   peerServer.on('call', (call) => {
    call.answer(stream);

    call.on('stream', (stream) => {
      console.log(stream)
      setStreams([...streams,stream])
    })
  })

  peerServer.on('error', console.log)

  const connecttoNewUser = (userId, stream) => {
    const call = peerServer.call(userId, stream);

    call.on('stream', (remoteVideoStream) => {
      if(remoteVideoStream){
        setRemoteStreams(remoteVideoStream);
      }
    })
}

  useEffect(() => {
    let isFront = false;
    mediaDevices.enumerateDevices().then(sourceInfos => {
    console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
    if(sourceInfos[i].kind == "videoinput" && sourceInfos[i].facing == (isFront ? "front" : "environment")) {
       videoSourceId = sourceInfos[i].deviceId;
    }
  }

  console.log(videoSourceId);
  mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 640,
      height: 480,
      frameRate: 30,
      facingMode: (isFront ? "user" : "environment"),
      deviceId: videoSourceId
    }
    // video: false
  })
  .then(stream => {
    setMyStream(stream);
  })
  .catch(error => {
    console.log(error)
  });
});


  },[])

  
  return (
    <View style={{flex:1, justifyContent: 'flex-start', padding: 10}}>
      <View style={{flex: 1,justifyContent: "center",height: 200, borderColor: 'yellow',borderWidth: 4}}>
      {(myStream) ? <RTCView streamURL={myStream.toURL()} style={{height: 200}}/> : console.log(myStream)}
      </View>
      <FAB
        title=""
        color="black"
        size="large"
        icon={<Icon name="mic-outline" type="ionicon" color="white" />}
       />
       <Text />
       <Text>Room ID: {route.params.RoomId}</Text>
       
        <View style={{flex: 1,justifyContent: "center",height: 300, borderColor: 'red',borderWidth: 4}}>
        {(remoteStreams.length > 0) ?
       remoteStreams.map((stream) => {
        <RTCView streamURL={stream.toURL()} style={{height: 300}}/>
      })
      : null}
      </View>
       
    </View>
  );
};

export default Room;
