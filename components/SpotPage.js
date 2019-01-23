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

class SpotPage extends Component {
  constructor(props){
    super(props)
    this.state={
      skatespot: '',
      imageURL: ''
    }
  }

  componentDidMount(){
    this.setState({
      skatespot: this.props.navigation.getParam('skatespot', 'defaultVAL'),
      imageURL: this.props.navigation.getParam('skatespot', 'defaultVAL').skatephoto.url
    })
  }


  render(){
    console.log('GOT HERE', this.state.skatespot);
    return(
      <View>

      <Header
        leftComponent={{ icon: 'arrow-back' , color: 'black', onPress: () => this.props.navigation.navigate('BookmarksContainer')}}
        centerComponent={{ fontFamily:'Lobster', text: `${this.state.skatespot.name}`, style: { color: 'black', fontSize: 25 } }}
        backgroundColor='white'
        containerStyle={{
           fontFamily:'Lobster',
           justifyContent: 'space-around',
         }}/>

      <Card
        containerStyle={{marginTop:'10%', borderRadius: 20}}
        image={{uri:`http://${environment['BASE_URL']}${this.state.imageURL}`}}
        >
        <Text style={{marginBottom: 10}}>
          {this.state.skatespot.url}
          {this.state.skatespot.description}
        </Text>

        <Button
          raised
          buttonStyle={{
            backgroundColor:"grey",
            borderRadius: 20,
            width: '100%',
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 5,
            paddingRight: 0
          }}
        onPress={() => console.log('PRessing this button')}
        title='Comment' />

      </Card>

      </View>
    )
  }
}

export default withNavigation(SpotPage)
