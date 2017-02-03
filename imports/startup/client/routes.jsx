import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import AppContainer from '../../ui/containers/AppContainer.jsx';
import Home from '../../ui/pages/Home.jsx';
import Summary from '../../ui/pages/Summary.jsx';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Home} />
      <Route path="summary/:user/:repo" component={Summary} />
    </Route>
  </Router>
);

export default renderRoutes;
