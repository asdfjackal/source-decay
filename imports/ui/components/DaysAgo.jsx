import React, { Component } from 'react';
import moment from 'moment';

export default class DaysAgo extends Component {
  render() {
    return (
      <span title={moment(this.props.datetime).format('MMMM Do YYYY, h:mm:ss a')}>{moment(this.props.datetime).fromNow()}</span>
    );
  }
}

DaysAgo.propTypes = {
  datetime: React.PropTypes.string,
};
