import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router';
import AuthWidget from '../components/AuthWidget.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: Meteor.user(),
    };
    this.logout = this.logout.bind(this);
    this.loginWithGithub = this.loginWithGithub.bind(this);
  }

  logout() {
    Meteor.logout(() => {
      this.setState({ user: Meteor.user() });
    });
  }

  loginWithGithub() {
    Meteor.loginWithGithub({
      requestPermissions: ['user', 'repo'],
    }, (err) => {
      if (err) {
        // handle error
      }
      this.setState({ user: Meteor.user() });
    });
  }

  render() {
    const {
      children,
    } = this.props;

    const {
      user,
    } = this.state;

    return (
      <div>
        <h1><Link to="/">Source Decay Alpha</Link></h1>
        <AuthWidget user={user} logout={this.logout} login={this.loginWithGithub} />
        {React.cloneElement(children, { user })}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element,
};
