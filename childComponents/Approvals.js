import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         Switch,
         Alert} from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import deviceStorage from '../deviceStorage.js'


const styles = StyleSheet.create({
  container: {
      textDecorationColor:'black',
      color:'black',
      flex: 1,
      backgroundColor: 'white',
      resizeMode: 'stretch'
    },
})

class Approvals extends Component {
  constructor(props){
    super(props)
    this.state={
      approvals: [{
        name: 'test'
      }
      ]
    }
  }

  componentDidMount(){
  }


  render(){
    return(
      <View style={styles.container}>
        <Header
          leftComponent={{
            icon: 'menu' ,
            color: 'black',
            onPress: () => this.props.navigation.openDrawer()}}
          centerComponent={{
            fontFamily:'Lobster',
            text: `Approvals`,
            style: { color: 'black', fontSize: 25 } }}
          backgroundColor='white'
          containerStyle={{
             fontFamily:'Lobster',
             justifyContent: 'space-around',
           }}/>

        <ScrollView>
          {this.state.approvals
             ?this.state.approvals.map((spot, i) => (
               <View>
                   <ListItem
                     title={spot.name}
                     rightIcon={{name: 'check', color:'green'}}
                   />
                </View>
             ))
             :null
           }
        </ScrollView>
        </View>
    )
  }
}



export default withNavigation(Approvals)
