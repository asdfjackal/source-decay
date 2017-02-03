import React, { Component } from 'react';
import RepoList from '../components/RepoList.jsx';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      Meteor.call('repos.getList', {
      }, (err, data) => {
        if (err) {
          this.setState({ err });
          this.state.error = err;
        } else {
          this.setState({ data });
          this.state.data = data;
        }
      });
    }
  }

  render() {
    return (
      <div className="content">
        {this.state.data &&
          <RepoList repos={this.state.data.viewer.repositories.nodes} />
        }

      </div>
    );
  }
}

Home.propTypes = {
  user: React.PropTypes.object,
};
