import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Repo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
    Meteor.call('repos.getInfo', {
      username: this.props.params.user,
      repo: this.props.params.repo,
    }, (err, data) => {
      if (err) {
        this.state.error = err;
      } else {
        this.state.data = data;
      }
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="repo">
        <p>Viewing info for {this.props.params.repo} by {this.props.params.user}</p>
        { (!this.state.error && !this.state.data) &&
          <p>Loading Repo Data...</p>
        }
        { this.state.error &&
          <p>There has been a server-side error. Please contact support.</p>
        }
        { this.state.data &&
          <p>This repo was last edited on {this.state.data.repository.pushedAt}</p>
        }
      </div>
    );
  }
}

Repo.propTypes = {
  params: React.PropTypes.object,
};
