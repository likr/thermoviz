import React from 'react'
import {Link} from 'react-router'
import $ from 'jquery'
import {Auth, signOut} from './models/auth'
import styles from './app.css'

class UserMenu extends React.Component {
  render () {
    const {user, onClickSignOutButton} = this.props
    if (user == null) {
      return <div className='menu'>
        <Link className='item' to='/'>Sign In</Link>
      </div>
    }
    return <div className='menu'>
      <div className='header'>{user.email}</div>
      <div className='item' onClick={onClickSignOutButton}>Sign Out</div>
    </div>
  }
}

export class App extends React.Component {
  constructor () {
    super()
    this.state = {
      user: null
    }
  }

  componentWillMount () {
    Auth().subscribe((user) => {
      this.setState({user})
    })
  }

  componentDidMount () {
    $(this.refs.dropdown).dropdown()
  }

  render () {
    const {user} = this.state

    return <div>
      <div className='ui fixed inverted menu'>
        <div className='ui container'>
          <Link className='header item' to='/'>ThermoViz</Link>
          <div className='right menu'>
            <div ref='dropdown' className='ui dropdown icon item'>
              <i className='user icon' />
              <UserMenu user={user} onClickSignOutButton={this.handleClickSignOutButton.bind(this)} />
            </div>
          </div>
        </div>
      </div>
      <div className={`ui container ${styles.container}`}>{
        React.Children.map(this.props.children, (child) => {
          return React.cloneElement(child, {user})
        })
      }</div>
    </div>
  }

  handleClickSignOutButton () {
    signOut().then(() => {
      this.context.router.push('/')
    })
  }
}

App.contextTypes = {
  router: React.PropTypes.object
}
