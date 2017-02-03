import React, { Component } from 'react';
import { Link } from 'react-router';

export default class RepoList extends Component {
  renderRows() {
    const { repos } = this.props;
    return repos.map(repo =>
      <tr key={repos.id}>
        <td><Link to={`/summary/${repo.owner.login}/${repo.name}`}>{repo.name}</Link>
          {repo.isPrivate &&
            <i className="fa fa-lock" />
          }</td>
        <td>{repo.description}</td>
        <td><a href={repo.url}>{repo.owner.login}/{repo.name}</a></td>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <h2>Repo List</h2>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>View on Github</th>
            </tr>
          </thead>
          <tbody>
            {this.renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

RepoList.propTypes = {
  repos: React.PropTypes.array,
};
