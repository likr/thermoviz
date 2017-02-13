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

export const signIn = (email, password) => {
  return firebase.auth()
    .signInWithEmailAndPassword(email, password)
}

export const signOut = () => {
  return firebase.auth().signOut()
}
