import React, { Component } from 'react';

export default class Repo extends Component {
  render() {
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
