import {firebaseValue} from './firebase'

export const getValues = (userId, sensorId) => {
  return firebaseValue(`${userId}/values/${sensorId}`, (ref) => {
    return ref
      .orderByChild('created')
      .limitToLast(500)
  })
}
