import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         TextInput,
         YellowBox,
         Alert} from 'react-native'
import { Header, Icon,  Card, ListItem, Button } from 'react-native-elements'
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import MySpotsButtonGroup from '../childComponents/MySpotsButtonGroup.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'
import deviceStorage from '../deviceStorage.js'

export default class SubmittedSpot extends Component {
  constructor(props){
    super(props)
    this.state={
      spot: ''
    }
  }

  componentDidMount(){
    this.setState({spot: this.props.spot})
  }


  render(){
    return(
      <TouchableWithoutFeedback onPress={()=> { this.props.navigation.navigate('SpotPage', {
        skatespot: spot })}}>
        <Card
        key={spot.id}
        title={spot.name}
        image={{uri:`http://${environment['BASE_URL']}${spot.skatephoto.url}`}}
        containerStyle={{borderRadius: 20}}>

        <Text style={{marginBottom: 10}}>
        {spot.description}
        </Text>

        <Button
        raised
        icon={<Icon name="directions"/>}
        buttonStyle={styles.directionsButton}
        onPress={() => Linking.openURL(`https://www.google.com/maps/dir//${spot.latitude},${spot.longitude}`)}
        title='Directions' />

        <Button
        raised
        icon={{name: 'trash', type: 'font-awesome'}}
        buttonStyle={styles.unBookmarkButton}
        onPress={() => this.props.deleteAlertMsg(spot.id)}
        title='Delete Spot' />
        </Card>
        </TouchableWithoutFeedback>
    )
  }
}
