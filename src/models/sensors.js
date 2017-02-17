import firebase from 'firebase'
import {firebaseValue} from './firebase'

export const getSensors = (userId) => {
  return firebaseValue(`${userId}/sensors`, (ref) => {
    return ref.orderByChild('created')
  })
}

export const getSensor = (userId, sensorId) => {
  return firebaseValue(`${userId}/sensors/${sensorId}`, (ref) => {
    return ref
  })
}

export const addSensor = (userId, obj) => {
  firebase.database()
    .ref(`${userId}/sensors`)
    .push({
      name: obj.name,
      created: firebase.database.ServerValue.TIMESTAMP
    })
}
