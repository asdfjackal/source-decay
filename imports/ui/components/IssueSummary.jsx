import React, { Component } from 'react';
import DaysAgo from '../components/DaysAgo.jsx';

export default class IssueSummary extends Component {

  oldestIssue() {
    if (this.props.issues.length > 0) {
      return (<span>Oldest Open Issue: <a href={this.props.issues[0].url}>
        {this.props.issues[0].title}</a>
        &nbsp;reported&nbsp;
        <DaysAgo datetime={this.props.issues[0].createdAt} />
      </span>);
    }
    return (<span />);
  }

  render() {
    return (<p><b>Issues:</b><br />
      {this.props.issueCount} open issues<br />
      {this.oldestIssue()}
    </p>);
  }
}

IssueSummary.propTypes = {
  issues: React.PropTypes.array,
  issueCount: React.PropTypes.number,
};
