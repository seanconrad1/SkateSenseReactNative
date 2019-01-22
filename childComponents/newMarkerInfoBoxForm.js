import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, CameraRoll } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, ThemeProvider } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
// import ImagePicker from 'react-native-image-picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'90%',
    alignItems:'center',
    backgroundColor: 'white',
    borderRadius:20,
    borderWidth:1,
    borderStyle:'solid',
    borderColor:'rgb(236, 229, 235)',
    height:300,
    width: '80%',
    marginLeft: '5%',
    // shadowColor: '#000',
    // shadowOffset: { width: 5, height: 4 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
  },
  header: {
    fontFamily: 'Lobster',
    fontSize: 20,
    fontWeight: 'bold',
  },
})


class SignUp extends Component {
  state = {
    username: '',
    description: '',
    kickout: '',
    photos: ''
  }

  getPhotoFromCameraRoll = () =>{
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    ImagePicker.showImagePicker(options, (response) => {
      console.log('GOT HERE');
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
        });
      }
    })
  }


  //   const data = new FormData();
  //   data.append('name', 'testName'); // you can append anyone.
  //   data.append('photo', {
  //     uri: photo.uri,
  //     type: 'image/jpeg', // or photo.type
  //     name: 'testPhotoName'
  //   });
  //   fetch(url, {
  //     method: 'post',
  //     body: data
  //   }).then(res => {
  //     console.log(res)
  //   });
  // }



  render(){
    console.log(this.state.photos);
    return(
      <View style={styles.container}>
          <Text style={styles.header}>Create New Spot</Text>
          <Input
            placeholder='Spot Name'
            clearButtonMode={'never'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType="default"
            onChangeText={(name) => this.setState({name})}
            />

          <Input
            placeholder='Description'
            clearButtonMode={'never'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType="default"
            onChangeText={(description) => this.setState({description})}
            />

          <Input
            placeholder='Kickout 1-10'
            clearButtonMode={'never'}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType="numeric"
            onChangeText={(kickout) => this.setState({kickout})}
            />

          <Button
            title='Photo'
            onPress={() => console.log('yo1231324')}
            />

          <Button
            title='Submit'
            buttonStyle={{
              marginTop: 20,
              backgroundColor: "rgb(244, 2, 87)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 20
            }}
            onPress={() => console.log('yoo')}
          />
      </View>
    )
  }
}

export default withNavigation(SignUp)
