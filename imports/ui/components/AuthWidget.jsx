import React, { Component } from 'react';

export default class AuthWidget extends Component {

  renderLoggedIn(user, logout) {
    return (<p> Logged in as {user.profile.name} | <button onClick={logout}>Logout</button></p>);
  }

  renderNotLoggedIn(login) {
    return (<p>Not Logged In | <button onClick={login}>Log in with Github</button></p>);
  }

  render() {
    const { user, logout, login } = this.props;

    return (
      user
      ? this.renderLoggedIn(user, logout)
      : this.renderNotLoggedIn(login)
    );
  }
}

AuthWidget.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
  login: React.PropTypes.func,
};
