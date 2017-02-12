import firebase from 'firebase'

export const config = {
  apiKey: 'AIzaSyB24yXDJK6t0jOra1-JcItyz2aZuJ2HrdI',
  authDomain: 'thermoviz.firebaseapp.com',
  databaseURL: 'https://thermoviz.firebaseio.com',
  storageBucket: 'thermoviz.appspot.com'
}

firebase.initializeApp(config)
