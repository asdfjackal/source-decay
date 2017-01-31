import React, { Component } from 'react';

export default class App extends Component {
  userLog() {
    console.log(Meteor.user());
  }

  loginWithGithub() {
    console.log('onclick working')
    Meteor.loginWithGithub({
      loginStyle: 'popup',
    }, (err) => {
      if (err) {
        // handle error
      } else {
        console.log('success!')
      }
    });
  }

  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        <h1>Source Decay Alpha</h1>
        <button onClick={this.loginWithGithub}>Login with gitub</button>
        <button onClick={this.userLog}>Is user logged in?</button>
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element,
};
