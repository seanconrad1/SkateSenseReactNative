import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, CameraRoll } from 'react-native'
import { Header } from 'react-native-elements'
import { Icon,
        Input,
        Button,
        ThemeProvider,
        ButtonGroup,
        Slider} from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';
import environment from '../environment.js'
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'


const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 40,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white'
  },
  header: {
    fontFamily: 'Lobster',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 80
  },
  submitButton:{
    marginTop: 10,
    backgroundColor: "rgb(244, 2, 87)",
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20,
    marginBottom: 20,
  },

  buttonGroup: {
    height: 100,
    marginBottom: 0,
    marginTop: 0,
  },
  first: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  middle: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    // This is the same as `first` but it's just for the example
  },
  last: {
    borderWidth: 0,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
})


class NewSpotPage extends Component {
  state = {
    name: '',
    description: '',
    kickout: 0,
    photo: false,
    validation: false,
    streetSpotType: 0,
    spotContains: [],
    selectedLat: null,
    selectedLng: null,
  }

  updateStreetSpotType = (streetSpotType) => {
    this.setState({streetSpotType})
  }
  updateSpotContains = (spotContains) => {
    this.setState({spotContains})
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      selectedLat: nextProps.navigation.getParam('selectedLocation').latitude,
      selectedLng: nextProps.navigation.getParam('selectedLocation').longitude
    })
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
      this.props.getSkateSpots()
      // this.props.navigation.navigate('Map')
      // let test = RNFetchBlob.wrap(this.state.photo.uri)
      // RNFetchBlob.fetch('POST', `http://${environment['BASE_URL']}/api/v1/skate_spots`, {
      //     Authorization : `${environment['API_KEY']}`,
      //     'Content-Type' : undefined,
      //   },[{
      //       name : 'skatephoto',
      //       filename : 'image.png',
      //       type:'image/jpg',
      //       data: RNFetchBlob.wrap(this.state.photo.uri)
      //     },
      //     { name : 'name', data : this.state.name},
      //     { name : 'country', data: 'n/a'},
      //     { name : 'city', data: 'n/a'},
      //     { name : 'state', data: 'n/a'},
      //     { name : 'latitude', data: this.state.selectedLat},
      //     { name : 'longitude', data: this.state.selectedLng},
      //     { name : 'description', data: this.state.description},
      //     { name : 'bust_factor', data: this.state.kickout},
      //     { name : 'user_id', data: this.props.user.user.id},
      //   ]).then((resp) => {
      //     console.log('RESPONSE FROM SERVER', resp)
      //     this.props.navigation.navigate('Map')
      //   }).catch((err) => {
      //     console.log('Error creating new marker: ', error)
      //   })
      }

  render(){
    const streetSpotTypebuttons = ['Street Spot', 'Skatepark', 'DIY']
    const streetSpotContains = ['Flatbar', 'Bank', 'Stair', 'Ditch', 'Wallride',
                                'Drop Gap', 'Flat Gap', 'Ledge', 'Polejam', 'Manual Pad', 'QP']
    const { streetSpotType } = this.state
    const { spotContains } = this.state
    return(
      <View>

        <Header
          centerComponent={{ fontFamily:'Lobster', text: 'Create New Spot', style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

          <View><Text>
           {this.state.selectedLat
           ? this.state.selectedLat + ' and ' + this.state.selectedLng
           : null}
           </Text>
           </View>

          <View style={styles.container}>

          <Text>Add Photo</Text>
          <Icon
            name='plus'
            type='font-awesome'
            size={40}
            onPress={this.getPhotoFromCameraRoll}
            containerStyle={styles.pictureButton}
            />

          {this.state.photo
          ? <View style={{display: 'flex', flexDirection: 'row', marginRight:10}}>
              <Text>Photo Uploaded</Text>
              <Icon
              name="check"/>
            </View>
          : null}

          <Input
            placeholder='Spot Name'
            clearButtonMode={'never'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType="default"
            onChangeText={(name) => this.setState({name})}
            />

          <Button
          title='Spot Location'
          onPress= {() => this.props.navigation.navigate('LocationSelectorMap')}
          />

          <Input
            placeholder='Description'
            clearButtonMode={'never'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType="default"
            onChangeText={(description) => this.setState({description})}
            />

            <Text style={{textAlign:'left'}}>Kickout meter</Text>
            <View style={{marginLeft:35, width:'100%'}}>
              <Slider
                thumbTintColor='rgb(244, 2, 87)'
                style={{width:'90%'}}
                step='1'
                maximumValue='10'
                animateTransitions='true'
                value={this.state.kickout}
                onValueChange={value => this.setState({ kickout: value })}
              />

            </View>

            <ButtonGroup
              onPress={this.updateStreetSpotType}
              selectedIndex={streetSpotType}
              buttons={streetSpotTypebuttons}
              containerStyle={{height: 100}}
              selectedButtonStyle={{backgroundColor:"rgb(244, 2, 87)"}}
            />




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
            buttonStyle={styles.submitButton}
            />
          }

      </View>
    </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots())
    }
}


const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(NewSpotPage))
