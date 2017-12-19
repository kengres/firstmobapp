import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

// constant inti
const ACTIVITIES_KEY = 'timespentactivities'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null,
    activities: null,
    loading: false,
    error: null
  },
  getters: {
    user: state => state.user,
    activities: state => state.activities,
    singleActivity: state => state.singleActivity,
    loading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setActivities (state, payload) {
      state.activities = payload
    },
    addActivity (state, payload) {
      state.activities.push(payload)
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
    loadActivities ({ commit }, payload) {
      commit('setLoading', true)
      firebase.database().ref(ACTIVITIES_KEY).once('value')
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
          console.log('activities from firebase: ', apiLogs)
          commit('setActivities', apiLogs)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log('error fetching activities: ', error)
          commit('setLoading', false)
        })
    },
    addActivity ({ commit }, payload) {
      commit('addActivity', payload)
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
          console.log('data after user create: ', data)
          const newUser = {
            id: data.uid
          }
          firebase.database().ref('users').child(data.uid).set({
            name: payload.name,
            email: data.email
          })
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
      firebase.database().ref('/users/' + getters.user.id + `/${ACTIVITIES_KEY}/`).once('value')
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createActivity ({ commit, getters }, payload) {
      const newLog = {
        ...payload,
        creatorId: getters.user.id
      }
      firebase.database().ref(ACTIVITIES_KEY).push(newLog)
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
