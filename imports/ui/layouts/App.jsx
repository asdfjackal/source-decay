import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router';
import AuthWidget from '../components/AuthWidget.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.loginWithGithub = this.loginWithGithub.bind(this);
  }

  logout() {
    Meteor.logout();
  }

  loginWithGithub() {
    Meteor.loginWithGithub({
    }, (err) => {
      if (err) {
        // handle error
      }
    });
  }

  render() {
    const {
      user,
      children,
    } = this.props;

    return (
      <div>
        <h1><Link to="/">Source Decay Alpha</Link></h1>
        <AuthWidget user={user} logout={this.logout} login={this.loginWithGithub} />
        {children}
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,
  children: React.PropTypes.element,
};
