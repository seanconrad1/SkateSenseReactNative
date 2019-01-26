import { AsyncStorage } from 'react-native';

const deviceStorage = {
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log('AsyncStorage saveItem Error: ' + error.message);
    }
  },

  async loadJWT(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log('SENDING BACK', value);
        return value
      } else {
        console.log('There are no tokens for u')
      }
    } catch (error) {
      console.log('AsyncStorage loadJWT Error: ' + error.message);
    }
  },

  async clearJWT(){
    try{
      await AsyncStorage.clear()
      console.log('storage has been cleared!');
    } catch (error) {
      console.log('AsyncStorage clearJWT Error: ' + error.message);
    }
  }

}

export default deviceStorage;
