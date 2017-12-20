import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export default {
  state: {
    user: null
  },
  getters: {
    user: state => state.user
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    setUser ({ commit }, payload) {
      commit('setUser', payload)
    },
    signUserUp ({ commit, dispatch }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          console.log('data after user create: ', data)
          firebase.database().ref('users/' + data.uid).child('/info').set({
            first_name: payload.first_name,
            last_name: payload.last_name,
            email: data.email
          })
            .then(user => {
              console.log('returned user details: ', user)
              dispatch('getUserDetails', data.uid)
            })
            .catch(error => {
              console.log('error user details: ', error)
            })
        })
        .catch(error => {
          console.log('error creating: ', error)
        })
    },
    signUserIn ({ commit, dispatch }, payload) {
      commit('setLoading', true)
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(data => {
            console.log('user data: ', data)
            const user = {
              id: data.uid
            }
            resolve(user)
            dispatch('getUserDetails', data.uid)
          })
          .catch(error => {
            console.log('user error: ', error)
            reject(error)
          })
      })
    },
    autoSignIn ({commit, dispatch}, payload) {
      console.log('autoSigning in...')
      commit('setLoading', true)
      dispatch('getUserDetails', payload.uid)
    },
    getUserDetails ({ commit }, UID) {
      firebase.database().ref(`users/${UID}`).child('/info').once('value')
        .then(data => {
          const result = data.val()
          const userData = {
            ...result,
            id: UID
          }
          console.log('got user details: ', userData)
          commit('setUser', userData)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  }
}
