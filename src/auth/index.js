import * as firebase from 'firebase/app'
import 'firebase/auth'

export default (Vue) => {
  Vue.auth = {
    firebaseInit () {
      if (firebase.apps.length === 0) {
        console.log('initializing the firebase...')
        firebase.initializeApp({
          apiKey: 'AIzaSyCNrNZbm97DWP4kFi_SQgp13hiz2xVrgqk',
          authDomain: 'time-spent-app.firebaseapp.com',
          databaseURL: 'https://time-spent-app.firebaseio.com',
          projectId: 'time-spent-app',
          storageBucket: 'time-spent-app.appspot.com'
        })
        return
      }
      console.log('already have firebase... returning')
    },
    getUser () {
      if (firebase.apps.length === 0) {
        console.log('no firebase in get user... initializing')
        this.firebaseInit()
      }
      console.log('getting a user')
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log('got the user... resolving')
            resolve(user)
            return user
          }
          else {
            reject(new Error('No user'))
          }
        })
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
