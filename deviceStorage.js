import { AsyncStorage } from 'react-native';

const deviceStorage = {

  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value)
      console.log('ITEM SET', value)
    } catch (error) {
      console.log('AsyncStorage saveItem Error: ' + error.message);
    }
  },

  async loadJWT(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value
      } else {
        console.log('There are no tokens for u')
      }
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  }

}

export default deviceStorage;
