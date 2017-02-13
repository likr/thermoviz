import React from 'react'
import {Link} from 'react-router'
import {signIn} from '../../models/auth'

class LoginForm extends React.Component {
  render () {
    return <form className='ui form' onSubmit={this.handleSubmitLoginForm.bind(this)}>
      <div className='field'>
        <label>E-Mail</label>
        <input ref='email' type='email' placeholder='you@example.com' />
      </div>
      <div className='field'>
        <label>Password</label>
        <input ref='password' type='password' placeholder='password' />
      </div>
      <button className='ui button' type='submit'>Login</button>
    </form>
  }

  handleSubmitLoginForm (event) {
    event.preventDefault()
    const email = this.refs.email.value
    const password = this.refs.password.value
    signIn(email, password).catch((error) => {
      console.log(error)
    })
  }
}

class Home extends React.Component {
  render () {
    const {user} = this.props
    return <div>
      <Link className='ui button' to={`/${user.uid}/sensors`}>Home</Link>
    </div>
  }
}

export class Root extends React.Component {
  render () {
    const {user} = this.props
    return <div>
      <div>{
        user ? <Home user={user} /> : <LoginForm />
      }</div>
    </div>
  }
}
