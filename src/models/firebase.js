import Rx from 'rxjs/Rx'
import firebase from 'firebase'

export const firebaseValue = (path, refCallback) => {
  return Rx.Observable.create((observer) => {
    const handler = (snapshot) => {
      observer.next(snapshot)
    }
    const ref = firebase.database()
      .ref(path)
    refCallback(ref)
      .on('value', handler)
    return () => {
      ref.off('value', handler)
    }
  })
}
