import React, { Component } from 'react';
import { Keyboard, Text, View, YellowBox, StyleSheet } from 'react-native'
import { Input, Button, ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withNavigation } from 'react-navigation'
import environment from '../environment.js'
import { loginUser } from '../action.js'
import { connect } from 'react-redux'
import { compose } from 'redux'


const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginTop: 200,
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
    marginTop: 20,
    backgroundColor: "rgb(244, 2, 87)",
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20
  },
  signupButton:{
    marginTop: 20,
    backgroundColor: "grey",
    width: 300,
    height: 45,
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 20
  }
})

class Login extends Component {
  state = {
    username: '',
    password: ''
  }

  onSubmit = (e) => {
    this.props.loginUser(this.state.username, this.state.password)
  }

  render(){
    return(
      this.props.loggedIn
      ? this.props.navigation.navigate('Map')
      : <View style={styles.container}>
        <Text style={styles.header}>SkateSense</Text>

        <View>
          <Text style={{color:'red'}}>
            {this.props.error ? this.props.error : null}
          </Text>
        </View>

        <Input
          placeholder='Username'
          leftIcon={
            <Icon
              name='user'
              size={24}
              color='black'
            />
          }
          clearButtonMode={'never'}
          autoCapitalize={'none'}
          autoCorrect={false}
          autoFocus={true}
          keyboardType="default"
          onChangeText={(username) => this.setState({username})}
          />

        <Input
          placeholder='Password'
          autoCapitalize={'none'}
          autoCorrect={false}
          clearButtonMode={'never'}
          secureTextEntry={true}
          leftIcon={
            <Icon
              name='lock'
              size={24}
              color='black'
            />
          }
          onChangeText={(password) => this.setState({password})}
        />

        <Button
          icon={
            <Icon
              name='arrow-right'
              size={15}
              color='white'
            />
          }
          title='Submit'
          buttonStyle={styles.submitButton}
          onPress={this.onSubmit}
        />

        <Button
          icon={
            <Icon
              name='arrow-right'
              size={15}
              color='white'
            />
          }
          title='Sign Up'
          buttonStyle={styles.signupButton}
          onPress={() => this.props.navigation.navigate('SignUp')}
        />
      </View>
    )
  }
}


const mapStateToProps = ({ user: { authenticatingUser, failedLogin, error, loggedIn } }) => ({
  authenticatingUser,
  failedLogin,
  error,
  loggedIn
})


const connectMap = connect(mapStateToProps, { loginUser })

export default withNavigation(compose(connectMap)(Login))
