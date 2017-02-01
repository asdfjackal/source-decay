import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import AppContainer from '../../ui/containers/AppContainer.jsx';
import Home from '../../ui/pages/Home.jsx';
import Repo from '../../ui/pages/Repo.jsx';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Home} />
      <Route path="repo/:user/:repo" component={Repo} />
    </Route>
  </Router>
);

export default renderRoutes;
