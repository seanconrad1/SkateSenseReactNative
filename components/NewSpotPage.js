import React, {Component} from 'react'
import { Keyboard,
        Text,
        StyleSheet,
        View,
        CameraRoll,
        TouchableOpacity,
        ScrollView,
        Image} from 'react-native'
import { Header } from 'react-native-elements'
import { Icon,
        Input,
        Button,
        ThemeProvider,
        ButtonGroup,
        Slider,
        } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';
import environment from '../environment.js'
import RNFetchBlob from 'rn-fetch-blob'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'
import deviceStorage from '../deviceStorage.js'
import {widthPercentageToDP as wp,
        heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'white',
    height: 600,
  },

  photoBox:{
    width: wp('21%'),
    height: wp('21%'),
    backgroundColor: 'grey',
    borderWidth: 5,
    borderColor: 'white',
    marginBottom: 20
  },

  spotLocationButton:{
    width: wp('80%'),
    backgroundColor:"rgb(244, 2, 87)",
  },
  submitButton:{
    marginTop: hp('5%'),
    backgroundColor: "rgb(244, 2, 87)",
    width: wp('80%'),
    height: hp('6%'),
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: wp('20%'),
    marginBottom:hp('2%')
  },
  buttonGroup: {
    height: 100,
    marginBottom: 0,
    marginTop: 0,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
})


class NewSpotPage extends Component {
  state = {
    name: null,
    description: null,
    kickout: 0,
    // photo: false,
    validation: false,
    streetSpotType: 0,
    spotContains: [],
    selectedLat: null,
    selectedLng: null,
    spotSubmitted: false
  }

  updateStreetSpotType = (streetSpotType) => {
    this.setState({streetSpotType})
  }
  updateSpotContains = (spotContains) => {
    this.setState({spotContains})
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.navigation.getParam('selectedLocation').latitude !== undefined && nextProps.navigation.getParam('selectedLocation').longitude !== undefined) {
      this.setState({
        selectedLat: nextProps.navigation.getParam('selectedLocation').latitude,
        selectedLng: nextProps.navigation.getParam('selectedLocation').longitude
      })
    }
  }

  getPhotoFromCameraRoll = () => {
      const options = {
        title: 'Select Skatespot Photo',
        // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      }

    //   ImagePicker.launchCamera(options, (response) => {
    // // Same code as in above section!
    //   });

    ImagePicker.showImagePicker(options, (response) => {
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

        // Limit to 4 photos uploaded
        if(this.state.photo && this.state.photo.length === 4){
          null
        }else if (this.state.photo) {
          this.setState({ photo: [...this.state.photo, photo]})
        }else if (!this.state.photo) {
          this.setState({ photo: [photo]})
        }


        }
      })
    }

    onSubmit = () =>{
      this.setState({spotSubmitted:true})
      deviceStorage.loadJWT('jwt')
      .then(val => fetchToPostSpot(val))

      const fetchToPostSpot = (val) =>{
        let data = [
              { name : 'name', data : this.state.name},
              { name : 'country', data: 'n/a'},
              { name : 'city', data: 'n/a'},
              { name : 'state', data: 'n/a'},
              { name : 'latitude', data: this.state.selectedLat},
              { name : 'longitude', data: this.state.selectedLng},
              { name : 'description', data: this.state.description},
              { name : 'bust_factor', data: this.state.kickout},
              { name : 'user_id', data: this.props.user.user.id}
            ]

        for (i of this.state.photo){
        	data.push({
        		name : 'avatars[]',
            filename : `${i.name}`,
            type:'image/jpg',
        		data: `RNFetchBlob-file://${i.uri}`
        	})
        }

        RNFetchBlob.fetch('POST', `http://${environment['BASE_URL']}/api/v1/skate_spots`, {
            Authorization: `Bearer ${val}`,
            'Content-Type' : undefined,
          },
            data
          ).then((resp) => {
            console.log('RESPONSE FROM SERVER', resp.data)
            let index = this.props.user.skate_spots.length + 1
            this.setState({spotSubmitted:false})
            this.props.navigation.navigate('Map', {index:index})

          })
          .catch((err) => {
            console.log('Error creating new marker: ', err)
          })
        }
    }

  render(){
    const streetSpotTypebuttons = ['Street Spot', 'Skatepark', 'DIY']
    const streetSpotContains = ['Flatbar', 'Bank', 'Stair', 'Ditch', 'Wallride',
                                'Drop Gap', 'Flat Gap', 'Ledge', 'Polejam', 'Manual Pad', 'QP']
    const { streetSpotType } = this.state
    const { spotContains } = this.state

    return(
      <View>
        <Spinner
         visible={this.state.spotSubmitted}
         textContent={'Creating Spot...'}
         textStyle={styles.spinnerTextStyle}
         />

        <Header
          leftComponent={{ icon: 'arrow-left', type:'font-awesome', color: 'black', onPress: () => this.props.navigation.goBack()}}
          centerComponent={{ fontFamily:'Lobster', text: 'Create New Spot', style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>


            <View style={styles.container}>
            <ScrollView>
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <TouchableOpacity style={styles.photoBox} onPress={this.getPhotoFromCameraRoll}>
                  {this.state.photo
                    ?<Image style={[styles.photoBox, {marginTop:-5}]} source={{ uri: this.state.photo[0].uri }}/>
                    : null
                  }
                  <Text style={{alignSelf:'flex-end', color:'white'}}> + </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoBox} onPress={this.getPhotoFromCameraRoll}>
                  {this.state.photo && this.state.photo[1]
                    ?<Image style={[styles.photoBox, {marginTop:-5}]} source={{ uri: this.state.photo[1].uri }}/>
                    : null
                  }
                  <Text style={{alignSelf:'flex-end', color:'white'}}> + </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoBox} onPress={this.getPhotoFromCameraRoll}>
                  {this.state.photo && this.state.photo[2]
                    ?<Image style={[styles.photoBox, {marginTop:-5}]} source={{ uri: this.state.photo[2].uri }}/>
                    : null
                  }
                  <Text style={{alignSelf:'flex-end', color:'white'}}> + </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.photoBox} onPress={this.getPhotoFromCameraRoll}>
                  {this.state.photo && this.state.photo[3]
                    ?<Image style={[styles.photoBox, {marginTop:-5}]} source={{ uri: this.state.photo[3].uri }}/>
                    : null
                  }
                  <Text style={{alignSelf:'flex-end', color:'white'}}> + </Text>
                </TouchableOpacity>
              </View>

              <Button
                buttonStyle={styles.spotLocationButton}
                title='Spot Location'
                onPress= {() => this.props.navigation.navigate('LocationSelectorMap')}
              />


              {this.state.photo
              ? <View style={{display: 'flex', flexDirection: 'row', marginRight:10}}>
                  <Text>Photo Uploaded</Text>
                  <Icon
                  name="check"/>
                </View>
              : null}

              {this.state.selectedLat && this.state.selectedLat
              ? <View style={{display: 'flex', flexDirection: 'row', marginRight:10}}>
                  <Text>Location Selected</Text>
                  <Icon
                  name="check"/>
                </View>
              : null}

              <Input
                containerStyle={{marginTop:20}}
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

                <Text style={{alignSelf:'flex-start',
                              marginLeft:wp('7.5%'),
                              opacity:.5,
                              fontSize: 17,
                              marginTop: 10
                              }}>
                    Kickout meter
                  </Text>
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


            <View>

              {this.state.name && this.state.description && this.state.photo && this.state.selectedLat && this.state.selectedLng && !this.state.spotSubmitted
              ? <Button
                title='Submit'
                buttonStyle={styles.submitButton}
                onPress={this.onSubmit}
              />
              : <Button
                title='Submit'
                disabled='true'
                buttonStyle={styles.submitButton}
                />
              }
            </View>


            </ScrollView>
        </View>
    </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    skate_spots: state.skate_spots,
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots())
    }
}


const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(NewSpotPage))
