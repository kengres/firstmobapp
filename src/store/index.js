import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

// constant inti
const LOG_KEY = 'timespentlogs'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    logs: [
      {
        date: '2017-12-13T00:00:00.000+03:00',
        start: '2017-12-19T09:00:00.000+03:00',
        lunchStart: '2017-12-19T12:10:00.000+03:00',
        lunchEnd: '2017-12-19T12:50:00.000+03:00',
        end: '2017-12-19T19:00:00.000+03:00'
      },
      {
        date: '2017-12-14T00:00:00.000+03:00',
        start: '2017-12-19T09:00:00.000+03:00',
        lunchStart: '2017-12-19T12:10:00.000+03:00',
        lunchEnd: '2017-12-19T12:50:00.000+03:00',
        end: '2017-12-19T19:00:00.000+03:00'
      },
      {
        date: '2017-12-15T00:00:00.000+03:00',
        start: '2017-12-19T09:00:00.000+03:00',
        lunchStart: '2017-12-19T12:10:00.000+03:00',
        lunchEnd: '2017-12-19T12:50:00.000+03:00',
        end: '2017-12-19T19:00:00.000+03:00'
      }
    ],
    loading: false,
    error: null
  },
  getters: {
    user: state => state.user,
    logs: state => state.logs,
    singleLog: state => state.singleLog,
    loading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLogs (state, payload) {
      state.logs = payload
    },
    addLog (state, payload) {
      state.logs.push(payload)
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    setUser ({ commit }, payload) {
      commit('setUser', payload)
    },
    loadLogs ({ commit }, payload) {
      firebase.database().ref(LOG_KEY).once('value')
        .then(response => {
          const dataObj = response.val()
          const apiLogs = []
          for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
              const element = dataObj[key]
              const id = key
              const newLog = {
                ...element,
                id
              }
              apiLogs.push(newLog)
            }
          }
          console.log('logs from firebase: ', apiLogs)
          commit('setLogs', apiLogs)
        })
        .catch(error => {
          console.log('error fetching logs: ', error)
        })
    },
    addLog ({ commit }, payload) {
      commit('addLog', payload)
    },
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    },
    signUserUp ({ commit }, payload) {
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          console.log(data)
          const newUser = {
            id: data.uid
          }
          commit('setUser', newUser)
        })
        .catch(error => {
          console.log('error creating: ', error)
        })
    },
    signUserIn ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(data => {
            console.log('user data: ', data)
            const user = {
              id: data.uid
            }
            resolve(user)
            commit('setUser', user)
          })
          .catch(error => {
            console.log('user error: ', error)
            reject(error)
          })
      })
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid
      })
    },
    fetchUserData ({commit, getters}) {
      firebase.database().ref('/users/' + getters.user.id + `/${LOG_KEY}/`).once('value')
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createLog ({ commit }, payload) {
      const newLog = payload
      firebase.database().ref(LOG_KEY).push(newLog)
        .then(response => {
          console.log('added log: ', response)
        })
        .catch(error => {
          console.log('error adding log: ', error)
        })
    }
  }
})
export default store
