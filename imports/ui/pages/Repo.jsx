import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import CommitList from '../components/CommitList.jsx';
import IssueSummary from '../components/IssueSummary.jsx';

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
        console.log(data);
      }
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div className="repo">
        { this.state.data ?
          <p>Viewing info for&nbsp;
             <a href={this.state.data.repository.url}>{this.props.params.repo}</a>
             &nbsp;by&nbsp;
             <a href={this.state.data.repository.owner.url}>{this.props.params.user}</a>
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
            <p>This repo was created {moment(this.state.data.repository.createdAt).fromNow()}</p>
            <p>This repo was last edited {moment(this.state.data.repository.pushedAt).fromNow()}</p>
            <p><b>Description: </b> {this.state.data.repository.description}</p>
            <IssueSummary
              issues={this.state.data.repository.issues.nodes}
              issueCount={this.state.data.repository.issues.totalCount}
            />
            <CommitList commits={this.state.data.repository.ref.target.history.nodes} />
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
