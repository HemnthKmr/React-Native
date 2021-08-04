/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';

import {AuthContext} from '../context';

const Profile = () => {
  const {signOut} = useContext(AuthContext);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
      title="Logout"
      onPress={signOut}
      buttonStyle={{
          backgroundColor: 'black',
          paddingLeft: 50,
          paddingRight: 50,
          marginTop: 30,
        }} />
    </View>
  );
};

export default Profile;
