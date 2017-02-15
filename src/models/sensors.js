import Rx from 'rxjs/Rx'
import firebase from 'firebase'

export const getSensors = (userId) => {
  return Rx.Observable.create((observer) => {
    const handler = (snapshot) => {
      observer.next(snapshot)
    }
    const ref = firebase.database()
      .ref(`${userId}/sensors`)
    ref.orderByChild('created')
      .on('value', handler)
    return () => {
      ref.off('value', handler)
    }
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
