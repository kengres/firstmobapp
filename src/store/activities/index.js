import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Alert } from 'quasar'
// import 'quasar-extras/animate/bounceInRight.css'
// import 'quasar-extras/animate/bounceOutRight.css'

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
      return new Promise((resolve, reject) => {
        dateRef.push(payload)
          .then(resp => {
            resolve('done')
            Alert.create({
              html: 'Log successfully created!',
              color: 'lime-4',
              icon: 'check',
              position: 'top-right',
              dismissable: true,
              enter: 'bounceInRight',
              leave: 'bounceOutRight'
            })
            console.log('act created: ', resp)
          })
          .catch(error => {
            reject(error)
            console.log('act not created: ', error)
          })
      })
    },
    loadActivities ({ commit, getters }) {
      const userId = getters.user.id
      const date = '2018-01-'
      const actRef = firebase.database().ref(`activities/${userId}`).orderByChild('date').startAt(date)
      const allActivities = []
      actRef.on('child_added', snap => {
        allActivities.unshift({
          id: snap.key,
          ...snap.val()
        })
        console.log('all activities: ', allActivities)
        commit('setActivities', allActivities)
      })
    },
    deleteActivity ({commit, getters, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        const userId = getters.user.id
        const actId = payload.id
        const actRef = firebase.database().ref(`activities/${userId}`)
        actRef.child(actId).remove()
          .then(data => {
            console.log('delete complete')
            resolve('done')
            Alert.create({
              html: 'Delete succeded!',
              color: 'warning',
              icon: 'check',
              position: 'top-right',
              dismissable: true,
              enter: 'bounceInRight',
              leave: 'bounceOutRight'
            })
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
      const actId = payload.id
      const {id, ...rest} = payload
      const actRef = firebase.database().ref(`activities/${userId}`)
      return new Promise((resolve, reject) => {
        actRef.child(actId).update(rest)
          .then(() => {
            resolve('done')
            Alert.create({
              html: 'Update succeded!',
              color: 'lime',
              icon: 'check',
              position: 'top-left',
              dismissable: true,
              enter: 'bounceInRight',
              leave: 'bounceOutRight'
            })
            dispatch('loadActivities')
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
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
