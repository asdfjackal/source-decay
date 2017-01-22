import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Repo extends Component {
  render() {
    Meteor.call('repos.getInfo', {
      username: this.props.params.user,
      repo: this.props.params.repo,
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });

    return (
      <div className="repo">
        <p>Viewing info for {this.props.params.repo} by {this.props.params.user}</p>
      </div>
    );
  }
}

Repo.propTypes = {
  params: React.PropTypes.object,
};
