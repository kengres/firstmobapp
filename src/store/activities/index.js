import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Alert } from 'quasar'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

// constant inti
// import { ACTIVITIES_KEY } from '../../config'

export default {
  state: {
    activities: null,
    singleActivity: null
  },
  getters: {
    activities: state => state.activities,
    singleActivity: state => state.singleActivity
  },
  mutations: {
    setActivities (state, payload) {
      state.activities = payload
    },
    setSingleActivity (state, payload) {
      state.singleActivity = payload
    }
  },
  actions: {
    addActivity ({ commit, getters, dispatch }, payload) {
      const userId = getters.user.id
      const month = payload.date.slice(3, 5)
      const monthRef = firebase.database().ref('activities/' + userId).child(month)
      monthRef.once('value')
        .then(snap => {
          console.log('got a snap: ', snap.val())
          if (!snap.val()) {
            console.log('snap is null')
            dispatch('createActivity', payload)
          }
          else {
            console.log('snap not null: ', snap.val())
            const logObj = snap.val()
            for (const key in logObj) {
              if (logObj.hasOwnProperty(key)) {
                if (key === payload.date) {
                  // notify user
                  console.log('no can do')
                  dispatch('notify')
                  break
                }
                else {
                  dispatch('createActivity', payload)
                }
              }
            }
          }
        })
        .catch(error => {
          console.log('no value found: ', error)
        })
    },
    notify (payload) {
      Alert.create({
        html: 'You already have a log on that date. Edit it instead!',
        enter: 'bounceInRight',
        leave: 'bounceOutRight',
        color: 'warning',
        icon: 'error',
        position: 'top-right'
      })
    },
    createActivity ({ commit, getters, dispatch }, payload) {
      const userId = getters.user.id
      const month = payload.date.slice(3, 5)
      const monthRef = firebase.database().ref('activities/' + userId).child(month)
      monthRef.child(payload.date).set(payload)
        .then(resp => {
          console.log('act created: ', resp)
          dispatch('loadActivities')
        })
        .catch(error => {
          console.log('act not created: ', error)
        })
    },
    loadActivities ({ commit, getters }) {
      commit('setLoading', true)
      const userId = getters.user.id
      const month = (new Date()).getMonth() + 1
      const allActivities = []
      const monthRef = firebase.database().ref('activities/' + userId).child(month).orderByKey()
      monthRef.once('value')
        .then(snap => {
          const actObj = snap.val()
          for (const key in actObj) {
            if (actObj.hasOwnProperty(key)) {
              const element = actObj[key]
              allActivities.push(element)
            }
          }
          allActivities.reverse()
          console.log('all acti: ', allActivities)
          commit('setActivities', allActivities)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    deleteActivity ({commit, getters, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        const userId = getters.user.id
        const date = payload.date
        const month = (new Date()).getMonth() + 1
        firebase.database().ref('activities/' + userId + '/' + month).child(date).remove()
          .then(data => {
            console.log('delete complete')
            resolve('done')
            dispatch('loadActivities')
          })
          .catch(error => {
            reject(error)
            console.log(error)
          })
      })
    },
    updateActivity ({commit, getters, dispatch}, payload) {
      const userId = getters.user.id
      const date = payload.date
      const month = (new Date()).getMonth() + 1
      firebase.database().ref('activities/' + userId + '/' + month).child(date).update(payload)
        .then(() => {
          Alert.create({
            html: 'Update succeded!',
            color: 'positive',
            icon: 'check',
            position: 'bottom-left',
            dismissable: true,
            enter: 'bounceInRight',
            leave: 'bounceOutRight'
          })
          dispatch('loadActivities')
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadSingleActivity ({ commit, getters }, payload) {
      commit('setLoading', true)
      const userId = getters.user.id
      const month = (new Date()).getMonth() + 1
      const date = payload
      firebase.database().ref('activities/' + userId + '/' + month).child(date).once('value')
        .then(data => {
          console.log('single: ', data.val())
          const dataObj = data.val()
          if (!dataObj.pauses) {
            console.log('no pauses!!!')
            dataObj.pauses = []
          }
          commit('setSingleActivity', dataObj)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    }
  }
}
