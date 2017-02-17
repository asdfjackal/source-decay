/* eslint-disable no-param-reassign */
import ApolloClient, { createNetworkInterface } from 'apollo-client';

const githubToken = process.env.SD_TOKEN;

function clientFromToken(token) {
  const networkInterface = createNetworkInterface({
    uri: 'https://api.github.com/graphql',
  });

  networkInterface.use([{
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};  // Create the header object if needed.
      }

      // get the authentication token from local storage if it exists
      req.options.headers.authorization = token ? `Bearer ${token}` : null;
      next();
    },
  }]);

  return new ApolloClient({
    networkInterface,
  });
};

export { clientFromToken, githubToken };
