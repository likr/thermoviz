import React from 'react'
import {formatDate} from '../../date'
import {getSensors, addSensor} from '../../models/sensors'
import styles from './sensor-list.css'

export class SensorList extends React.Component {
  constructor () {
    super()

    this.state = {
      sensors: {}
    }
  }

  componentDidMount () {
    const {userId} = this.props.params
    this.sensorsSubscription = getSensors(userId).subscribe((snapshot) => {
      this.setState({
        sensors: snapshot.val()
      })
    })
  }

  componentWillUnmount () {
    this.sensorsSubscription.unsubscribe()
  }

  render () {
    const {sensors} = this.state

    return <div>
      <div>
        <h2>Register New Sensor</h2>
        <form className='ui form' onSubmit={this.handleSubmitRegisterForm.bind(this)}>
          <div className='field'>
            <label>Name</label>
            <input ref='name' type='text' placeholder='Sensor Name' />
          </div>
          <button className='ui button' type='submit'>Register</button>
        </form>
      </div>
      <div className='ui divider' />
      <div>
        <h2>Registered Sensors</h2>
        <table className='ui celled table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>{
            Object.keys(sensors).map((id) => {
              const sensor = sensors[id]
              return <tr key={id} className={styles.row} onClick={this.handleClickTableRow.bind(this, id)}>
                <td>{sensor.name}</td>
                <td>{formatDate(new Date(sensor.created))}</td>
              </tr>
            })
          }</tbody>
        </table>
      </div>
    </div>
  }

  handleSubmitRegisterForm (event) {
    event.preventDefault()
    const {userId} = this.props.params
    addSensor(userId, {
      name: this.refs.name.value
    })
  }

  handleClickTableRow (id) {
    const {userId} = this.props.params
    this.context.router.push(`/${userId}/sensors/${id}`)
  }
}

SensorList.contextTypes = {
  router: React.PropTypes.object
}
