import React from 'react';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router'
import * as actions from '../action.js';
import deviceStorage from '../deviceStorage.js';

const withAuth = WrappedComponent => {
  class AuthorizedComponent extends React.Component {
    componentDidMount() {
      if (deviceStorage.loadJWT('jwt') && !this.props.loggedIn) this.props.fetchCurrentUser();
    }

    render() {
      if (deviceStorage.loadJWT('jwt') && this.props.loggedIn) {
        return <WrappedComponent />;
      }
      if (deviceStorage.loadJWT('jwt') && this.props.authenticatingUser) {
        return <h1>Loading</h1>;
      }
      return this.props.navigation.navigate('Map');
    }
  }

  const mapStateToProps = reduxStoreState => ({
    loggedIn: reduxStoreState.user.loggedIn,
    authenticatingUser: reduxStoreState.user.authenticatingUser,
  });

  return connect(mapStateToProps, actions)(AuthorizedComponent);
};

export default withAuth;
