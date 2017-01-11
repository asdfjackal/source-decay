import React, { Component } from 'react';

export default class App extends Component {
  render() {
    const {
      children,
    } = this.props;

    return (
      <div>
        <h1>Source Decay Alpha</h1>
        {children}
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element,
};
