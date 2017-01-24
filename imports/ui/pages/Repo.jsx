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
        { this.state.data ?
          <p>Viewing info for
             &nbsp;<a href={this.state.data.repository.url}>{this.props.params.repo}</a>&nbsp;
             by&nbsp;
             <a href={this.state.data.repository.owner.url}>{this.props.params.user}</a>
             &nbsp;
          </p>
            :
          <p>Viewing info for {this.props.params.repo} {this.props.params.user}</p>
        }
        { (!this.state.error && !this.state.data) &&
          <p>Loading Repo Data...</p>
        }
        { this.state.error &&
          <p>There has been a server-side error. Please contact support.</p>
        }
        { this.state.data &&
          <div>
            <p>This repo was last edited on {this.state.data.repository.pushedAt}</p>
            <p><b>Description: </b> {this.state.data.repository.description}</p>
            <b>Warnings:</b>
            <ul>
              { !this.state.data.repository.hasIssuesEnabled &&
                <li>Issues are not enabled</li>
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}

Repo.propTypes = {
  params: React.PropTypes.object,
};
