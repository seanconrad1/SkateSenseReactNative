import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback } from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'


const styles = StyleSheet.create({

})

class MySpots extends Component {
  constructor(props){
    super(props)
    this.state={
      skatespot: '',
      imageURL: ''
    }
  }

  componentDidMount(){
    this.setState({

      // skatespot: this.props.navigation.getParam('skatespot', 'defaultVAL'),
      // imageURL: this.props.navigation.getParam('skatespot', 'defaultVAL').skatephoto.url
    })
  }


  render(){
    console.log('GOT HERE', this.state.skatespot);
    return(
      <View>

      <Header
        leftComponent={{ icon: 'arrow-back' , color: 'black', onPress: () => this.props.navigation.navigate('Map')}}
        centerComponent={{ fontFamily:'Lobster', text: `Settings`, style: { color: 'black', fontSize: 25 } }}
        backgroundColor='white'
        containerStyle={{
           fontFamily:'Lobster',
           justifyContent: 'space-around',
         }}/>


      </View>
    )
  }
}

export default withNavigation(MySpots)
