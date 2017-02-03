import React, { Component } from 'react';
import RepoList from '../components/RepoList.jsx';

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: null,
      error: null,
    };
    if (props.user) {
      Meteor.call('repos.getList', {
      }, (err, data) => {
        if (err) {
          this.state.error = err;
        } else {
          this.state.data = data;
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      Meteor.call('repos.getList', {
      }, (err, data) => {
        if (err) {
          this.setState({ error: err });
        } else {
          this.setState({ data });
        }
      });
    } else {
      this.setState({ error: null });
      this.setState({ data: null });
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
