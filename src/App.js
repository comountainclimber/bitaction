import React from 'react';
import {
    Router,
    Switch,
    Route,
} from 'react-router-dom';

import './styles/App.css';
import RouteNotFound from './components/router/RouteNotFound';
import Home from './components/home/Home';
import AddressContainer from './components/address/AddressContainer';
import Navigation from './components/navigation/Navigation';
import Footer from './components/navigation/Footer';
import history from './history';
import {API_CONFIG} from './config';
import ExchangePriceData from './components/common/ExchangePriceData';

const App = () => (
  <div className="App">
    <div className="App-container">
      <ExchangePriceData>
        <Navigation handleClick={() => history.push('/')} />
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path={API_CONFIG.MAIN_NET.internalUrl}
              render={() => <AddressContainer config={API_CONFIG.MAIN_NET} />}
            />
            <Route
              exact
              path={API_CONFIG.TEST_NET.internalUrl}
              render={() => <AddressContainer config={API_CONFIG.TEST_NET} />}
            />
            <Route component={RouteNotFound} />
          </Switch>
        </Router>
      </ExchangePriceData>
    </div>
    <Footer />
  </div>
);

export default App;
