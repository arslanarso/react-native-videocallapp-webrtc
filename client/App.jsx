import React from 'react';
import {Provider} from 'react-redux';
import store from './src/Redux/store';
import Router from './src/Route/Router';

const App = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};
export default App;
