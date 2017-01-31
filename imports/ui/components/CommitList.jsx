import React, { Component } from 'react';
import DaysAgo from '../components/DaysAgo.jsx';

export default class CommitList extends Component {
  constructor(props) {
    super(props);
    this.messageLength = 50;
  }

  trimMessage(message) {
    if (message.length >= this.messageLength) {
      return `${message.substr(0, this.messageLength - 1)}...`;
    }
    return message;
  }

  render() {
    if (this.props.commits) {
      const items = this.props.commits.map(commit =>
        <li key={commit.id}>
          <a href={commit.url}>{this.trimMessage(commit.message)}</a>
          &nbsp;made <DaysAgo datetime={commit.committer.date} />
          &nbsp;by <a href={commit.committer.user.url}>{commit.committer.user.name}</a>
        </li>
      );
      return (
        <div>
          <p><b>Commits:</b><br />
            {this.props.commits.length} Most Recent Commits:<br />
          </p>
          <ul>
            {items}
          </ul>
        </div>
      );
    }
    return (<i>No Commits found</i>);
  }
}

CommitList.propTypes = {
  commits: React.PropTypes.array,
};
