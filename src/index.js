import 'babel-polyfill'
import './firebase-init'
import React from 'react'
import {render} from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import {Auth} from './models/auth'
import {App} from './app'
import {Root} from './pages/root/index'
import {SensorList} from './pages/sensor-list/index'
import {SensorDetail} from './pages/sensor-detail/index'

const requireAuth = (nextState, replace, callback) => {
  Auth()
    .first()
    .subscribe((user) => {
      if (user) {
        callback()
      } else {
        replace({
          pathname: '/'
        })
      }
    })
}

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={Root} />
      <Route path='/:userId/sensors' component={SensorList} onEnter={requireAuth} />
      <Route path='/:userId/sensors/:sensorId' component={SensorDetail} onEnter={requireAuth} />
    </Route>
  </Router>
  ), document.getElementById('content'))
