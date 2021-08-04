/* eslint-disable prettier/prettier */
import {PermissionsAndroid} from 'react-native';

export const requestAudioPermisson = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
      PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use mic');
    } else {
      console.log('Permission Denied for mic');
    }
  } catch (err) {
    console.warn(err);
  }
};
