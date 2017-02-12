import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import CommitList from '../components/CommitList.jsx';
import IssueSummary from '../components/IssueSummary.jsx';
import DaysAgo from '../components/DaysAgo.jsx';

export default class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repository: null,
      error: null,
    };
    this.forceDataUpdate = this.forceDataUpdate.bind(this);
    Meteor.call('repos.getInfo', {
      username: this.props.params.user,
      repo: this.props.params.repo,
    }, (err, data) => {
      if (err) {
        this.state.error = err;
      } else {
        this.state.repository = data.repository;
      }
      this.forceUpdate();
    });
  }

  forceDataUpdate() {
    Meteor.call('repos.forceUpdate', {
      username: this.props.params.user,
      repo: this.props.params.repo,
    }, (err, data) => {
      if (err) {
        this.setState({ error: err });
      } else {
        this.setState({ repository: data.repository });
      }
    });
  }

  render() {
    return (
      <div className="repo">
        { this.state.repository ?
          <p>Viewing info for&nbsp;
             <a href={this.state.repository.url}>{this.props.params.repo}</a>
             &nbsp;by&nbsp;
             <a href={this.state.repository.owner.url}>{this.props.params.user}</a>
          </p>
            :
          <p>Viewing info for {this.props.params.repo} {this.props.params.user}</p>
        }
        { (!this.state.error && !this.state.repository) &&
          <p>Loading Repo Data...</p>
        }
        { this.state.error &&
          <p>There has been a server-side error. Please contact support.</p>
        }
        { this.state.repository &&
          <div>
            <p>Refresh <i className="fa fa-refresh" onClick={this.forceDataUpdate} /></p>
            <p>This repo was created&nbsp;
              <DaysAgo datetime={this.state.repository.createdAt} />
            </p>
            <p>This repo was last edited&nbsp;
              <DaysAgo datetime={this.state.repository.pushedAt} />
            </p>
            <p><b>Description: </b> {this.state.repository.description}</p>
            <IssueSummary
              issues={this.state.repository.issues.nodes}
              issueCount={this.state.repository.issues.totalCount}
            />
            <CommitList commits={this.state.repository.ref.target.history.nodes} />
            <b>Warnings:</b>
            <ul>
              { !this.state.repository.hasIssuesEnabled &&
                <li>Issues are not enabled</li>
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}

Summary.propTypes = {
  params: React.PropTypes.object,
};
