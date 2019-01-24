import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         Switch} from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'


const styles = StyleSheet.create({
  container: {
      textDecorationColor:'black',
      color:'black',
      flex: 1,
      backgroundColor: 'white',
      resizeMode: 'stretch'
    },
})

class MySpots extends Component {
  constructor(props){
    super(props)
    this.state={
      isOn: false,
    }
  }

  toNightMode= (value) =>{
    this.setState({ isOn: value })


    this.state.isOn
    ? styles.container = {
        flex: 1,
        resizeMode: 'stretch',
        backgroundColor: 'white',
    }
    : styles.container = {
        flex: 1,
        resizeMode: 'stretch',
        backgroundColor: 'grey',
      }

      console.log(styles.container);
  }

  render(){
    return(
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'arrow-back' , color: 'black', onPress: () => this.props.navigation.navigate('Map')}}
          centerComponent={{ fontFamily:'Lobster', text: `Settings`, style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

           <ListItem
            containerStyle={styles.container}
            title="Dark Mode"
            switch={{
              value: this.state.isOn,
              onValueChange: value => this.toNightMode(value)
            }}
            />
        </View>
    )
  }
}

export default withNavigation(MySpots)
