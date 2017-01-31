import React, { Component } from 'react';
import moment from 'moment';

export default class IssueSummary extends Component {

  oldestIssue() {
    if (this.props.issues.length > 0) {
      return (<span>Oldest Open Issue: <a href={this.props.issues[0].url}>
        {this.props.issues[0].title}</a>
        &nbsp;reported&nbsp;
        {moment(this.props.issues[0].createdAt).fromNow()}
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
