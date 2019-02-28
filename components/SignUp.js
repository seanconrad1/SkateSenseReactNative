import React, {Component} from 'react'
import { Keyboard, Text, StyleSheet, View, KeyboardAvoidingView, Animated } from 'react-native'
import { Header } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, ThemeProvider } from 'react-native-elements';
import { withNavigation } from 'react-navigation'
import { createUser } from '../action.js'
import { connect } from 'react-redux'
import { compose } from 'redux'

class SignUp extends Component {
  state = {
    username: '',
    password: '',
    validatePassword: '',
    email: 'n/a',
    firstName: 'n/a',
    lastName: 'n/a',
    photo: 'n/a',
    passwordMustMatch: false,
    error:''
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      failed_login_error_password: nextProps.failed_login_error_password,
      failed_login_error_username: nextProps.failed_login_error_username
      })
    }

  updateUsername = (username) =>{
    this.setState({
      username:username,
      failed_login_error_password: '',
      failed_login_error_username: ''
    })
  }

  updatePassword = (password) =>{
    this.setState({
      password:password,
      failed_login_error_password: '',
      failed_login_error_username: ''
    })
  }

  onSubmit = () =>{
    if(this.state.password === this.state.validatePassword){
      this.props.createUser(this.state.username,
        this.state.password,
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.photo
      )
    }else{
      this.setState({passwordMustMatch: true})
    }
  }


  render(){
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        // marginTop: 75,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'white'
      },
      header: {
        fontFamily: 'Lobster',
        fontSize: 50,
        fontWeight: 'bold',
        // marginBottom: 80
      },
    })

    return(
      <KeyboardAvoidingView style={styles.container} behavior="padding">

          <View>
            <Animated.Text style={styles.header}>Signup</Animated.Text>
          </View>

          <Text style={{color:'red'}}>
            {this.state.failed_login_error_password}
          </Text>
          <Text style={{color:'red'}}>
             {this.state.failed_login_error_username
             ? `Username ${this.state.failed_login_error_username}`
             : null
            }
          </Text>

          <View>
            <Text style={{color:'red'}}>
              {this.state.passwordMustMatch ? 'Passwords Must Match' : null}
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
            onChangeText={(username) => this.updateUsername(username)}
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

            <Input
              placeholder='Confirm password'
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
              onChangeText={(validatePassword) => this.setState({validatePassword})}
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
                  buttonStyle={{
                    marginTop: 20,
                    backgroundColor: "rgb(244, 2, 87)",
                    width: 300,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 20
                  }}
                  onPress={this.onSubmit}
                />
      </KeyboardAvoidingView>
    )
  }
}


const mapStateToProps = ({ user: { authenticatingUser, failedLogin, error, loggedIn, failed_login_error_password, failed_login_error_username } }) => ({
  authenticatingUser,
  failedLogin,
  loggedIn,
  failed_login_error_password,
  failed_login_error_username
})


const connectMap = connect(mapStateToProps, { createUser })

export default withNavigation(compose(connectMap)(SignUp))
