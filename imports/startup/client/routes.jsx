import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from '../../ui/layouts/App.jsx';
import Home from '../../ui/pages/Home.jsx';
import Repo from '../../ui/pages/Repo.jsx';

const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="repo/:user/:repo" component={Repo} />
    </Route>
  </Router>
);

export default renderRoutes;
