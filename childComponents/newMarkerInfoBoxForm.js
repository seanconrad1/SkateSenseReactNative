import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, CameraRoll } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, ThemeProvider } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';
import environment from '../environment.js'

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
    name: '',
    description: '',
    kickout: '',
    photo: false,
    validation: false
  }

  // THIS IS A NIGHTMARE
  // - WHEN BEING SUBMITTED TO THE BACKEND,
  // - THE BACKENED IS NOT ACCEPTING THE FORM
  // - HOWEVER IT'S WORKING FINE ON THE NORMAL REACT APP

  // ImagePicker.showImagePicker(options, (response) => {
    //   // console.log('Response = ', response);
    //
    //   if (response.didCancel) {
      //     console.log('User cancelled image picker');
      //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else if (response.customButton) {
          //     console.log('User tapped custom button: ', response.customButton);
          //   } else {
            //     let source = {uri: response.uri.replace('file://', ''), isStatic: true};
            //     // You can also display the image using data:
            //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
            //
            //     this.setState({
              //       photo: source,
              //       validation: true
              //     })
              //   }
              // })

  getPhotoFromCameraRoll = () => {
      const options = {
        title: 'Select Skatespot Photo',
        customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      }

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source;
        source = {uri: response.uri.replace('file://', ''), isStatic: true};

        let photo = {
          uri: source.uri,
          type: 'image/jpeg',
          name: response.fileName
        }

        this.setState({
          photo: photo,
          validation: true
        })

        }
      })
    }

    onSubmit = () =>{
      let data = new FormData()
      data.append('name', this.state.name)
      data.append('country', 'n/a')
      data.append('city', 'n/a')
      data.append('state', 'n/a')
      data.append('latitude', this.props.location.latitude)
      data.append('longitude', this.props.location.longitude)
      data.append('description', this.state.description)
      data.append('bust_factor', this.state.kickout)
      data.append("skatephoto", {uri: this.state.photo.uri, name: 'image.jpg', type: 'multipart/form-data'})
      data.append('user_id', 2)

      // fetch(`http://${environment['BASE_URL']}/api/v1/skate_spots`, {
      //   method: 'POST',
      //   body: data,
      //   headers: {
      //     'Content-Type': 'undefined',
      //     "Authorization": `${environment['API_KEY']}`
      //   }
      //   })
      //   .then(response => {
      //     console.log("image uploaded")
      //     console.log(response)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
      //
      //   let headers = {
      //      'Content-Type': 'application/json',
      //      'Authorization': `${environment['API_KEY']}`
      //    }

        axios({
            method: 'post',
            url: `http://${environment['BASE_URL']}/api/v1/skate_spots`,
            data: {
              data
            },
            headers: headers
            })
            .then((response) => {
                console.log('RESPONSE FROM SERVER', response)
            })
            .catch((error) => {
                console.log('Error creating new marker: ', error)
            })

      }

  render(){
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
            title="Photo Upload"
            icon={{name: 'camera', type: 'font-awesome'}}
            onPress={this.getPhotoFromCameraRoll}
            buttonStyle={{
              marginTop: 10,
              backgroundColor: "grey",
              width: '80%',
              height: '80%',
              borderWidth: 0,
              borderRadius: 20
            }}
            />

          {this.state.photo
          ? <View style={{display: 'flex', flexDirection: 'row', marginRight:10}}>
              <Text>Photo Uploaded</Text>
              <Icon
              name="check"/>
            </View>
          : null}

          {this.state.validation
          ? <Button
            title='Submit'
            buttonStyle={{
              marginTop: 10,
              backgroundColor: "rgb(244, 2, 87)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 20
            }}
            onPress={this.onSubmit}
          />
          : <Button
            title='Submit'
            disabled='true'
            buttonStyle={{
              marginTop: 10,
              backgroundColor: "rgb(244, 2, 87)",
              width: 300,
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 20
            }}
            />
          }

      </View>
    )
  }
}



export default withNavigation(SignUp)
