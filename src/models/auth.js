import Rx from 'rxjs/Rx'
import firebase from 'firebase'

export const Auth = () => {
  return Rx.Observable.create((observer) => {
    const unsubscribe = firebase.auth()
      .onAuthStateChanged((user) => {
        observer.next(user)
      })
    return () => {
      unsubscribe()
    }
  })
}
