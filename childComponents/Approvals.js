import React, {Component} from 'react'
import { View,
         Text,
         StyleSheet,
         Image,
         ScrollView,
         Linking,
         TouchableWithoutFeedback,
         Switch,
         Alert,
         RefreshControl} from 'react-native'
import { Header, Icon, Card, ListItem, Button } from 'react-native-elements'
// import Icon from 'react-native-vector-icons/FontAwesome';
import environment from '../environment.js'
import { withNavigation } from 'react-navigation'
import deviceStorage from '../deviceStorage.js'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { fetchKeyForSkateSpots } from '../action.js'


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
    ],
    refreshing: false
    }
  }

  componentDidMount(){
    this.setState({approvals: this.props.spotsToBeApproved})
  }

  componentWillReceiveProps(newProps){

  }

  filterForApprovals = () =>{
    if (this.props.skate_spots){
    let yetToBeApprovedSpots = this.props.skate_spots.filter(spot => spot.approved === false)

    return yetToBeApprovedSpots.map((spot, i) => (
        <View>
            <ListItem
              title={spot.name}
              onPress={()=> this.props.navigation.navigate('ApprovalSpotPage', {skatespot: spot })}
            />
         </View>
      ))
    }
  }

  _onRefresh = () => {
    console.log('REFRESHING')
    this.setState({refreshing: true});
    this.props.getSkateSpots()
    // this.props.fetchUserData(this.props.user.user.id)
    this.setState({refreshing: false});
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

        <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />}>
          {this.filterForApprovals()}
        </ScrollView>
        </View>
    )
  }
}


const mapStateToProps = state => {
  return {
    skate_spots: state.user.skate_spots,
  }
}

function mapDispatchToProps(dispatch) {
    return {
      getSkateSpots: () => dispatch(fetchKeyForSkateSpots()),
    }
}



const connectMap = connect(mapStateToProps, mapDispatchToProps)

export default withNavigation(compose(connectMap)(Approvals))
