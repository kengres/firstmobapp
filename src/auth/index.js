import * as firebase from 'firebase/app'
import 'firebase/auth'

export default (Vue) => {
  Vue.auth = {
    firebaseInit () {
      console.log('initializing the firebase...')
      firebase.initializeApp({
        apiKey: 'AIzaSyCNrNZbm97DWP4kFi_SQgp13hiz2xVrgqk',
        authDomain: 'time-spent-app.firebaseapp.com',
        databaseURL: 'https://time-spent-app.firebaseio.com',
        projectId: 'time-spent-app',
        storageBucket: 'time-spent-app.appspot.com'
      })
    },
    getUser () {
      if (firebase.apps) {
        console.log('firebase: ', firebase)
        // this.firebaseInit()
      }
      console.log('getting a user')
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            resolve(user)
            return user
          }
          else {
            reject(new Error('No user'))
          }
        })
      })
    },
    isLoggedIn () {
      console.log('check if logged in: ')
      this.getUser()
        .then(user => {
          console.log('user logged in: ', user)
          return !!user
        })
        .catch(error => {
          console.log('error is logged in', error)
          return false
        })
    },
    logUserOut () {
      firebase.auth().signOut()
        .then(resp => {
          console.log('sing out resp: ', firebase)
        })
        .catch(error => {
          console.log('sing out error: ', error)
        })
    }
  }

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        return Vue.auth
      }
    }
  })
}
