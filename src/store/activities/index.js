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
    createActivity ({ commit, getters }, payload) {
      const userId = getters.user.id
      const dateRef = firebase.database().ref('activities/' + userId)
      dateRef.push(payload)
        .then(resp => {
          console.log('act created: ', resp)
        })
        .catch(error => {
          console.log('act not created: ', error)
        })
    },
    loadActivities ({ commit, getters }) {
      const userId = getters.user.id
      const date = '2017-12-'
      const actRef = firebase.database().ref(`activities/${userId}`).orderByKey().startAt(date)
      actRef.once('value')
        .then(snap => {
          console.log('acti du 28: ', snap.val())
        })
        .catch(error => console.log(error))
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
      const actMonth = (payload.date).slice(3, 5)
      const actDate = payload.date
      const actId = payload.id
      firebase.database().ref('activities/' + userId + '/' + actMonth + '/' + actDate).child(actId).once('value')
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
