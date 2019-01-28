import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, CameraRoll } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, ThemeProvider } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';
import environment from '../environment.js'
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    position: 'absolute',
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


class NewMarkerInfoBoxForm extends Component {
  state = {
    name: '',
    description: '',
    kickout: '',
    photo: false,
    validation: false
  }

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
      let test = RNFetchBlob.wrap(this.state.photo.uri)
      RNFetchBlob.fetch('POST', `http://${environment['BASE_URL']}/api/v1/skate_spots`, {
          Authorization : `${environment['API_KEY']}`,
          'Content-Type' : undefined,
        },[{
            name : 'skatephoto',
            filename : 'image.png',
            type:'image/jpg',
            data: RNFetchBlob.wrap(this.state.photo.uri)
          },
          { name : 'name', data : this.state.name},
          { name : 'country', data: 'n/a'},
          { name : 'city', data: 'n/a'},
          { name : 'state', data: 'n/a'},
          { name : 'latitude', data: this.props.location.latitude},
          { name : 'longitude', data: this.props.location.longitude},
          { name : 'description', data: this.state.description},
          { name : 'bust_factor', data: this.state.kickout},
          { name : 'user_id', data: this.props.user.user.id},
        ]).then((resp) => {
          console.log('RESPONSE FROM SERVER', resp)
          this.props.getSkateSpots()
        }).catch((err) => {
          console.log('Error creating new marker: ', error)
        })
      }

  render(){
    console.log('NEW MARKERINFOBOX', this.props)
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

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots())
    }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(NewMarkerInfoBoxForm))
