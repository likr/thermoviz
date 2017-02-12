import 'babel-polyfill'
import './firebase-init'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import firebase from 'firebase'
import {App} from './app'
import {Root} from './pages/root/index'
import {SensorList} from './pages/sensor-list/index'
import {SensorDetail} from './pages/sensor-detail/index'

const requireAuth = (nextState, replace) => {
  if (firebase.auth().currentUser == null) {
    console.log('login required')
    replace({
      pathname: '/'
    })
  }
}

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Root} />
      <Route path='/sensors' component={SensorList} onEnter={requireAuth} />
      <Route path='/sensors/:sensorId' component={SensorDetail} onEnter={requireAuth} />
    </Route>
  </Router>
  ), document.getElementById('content'))
