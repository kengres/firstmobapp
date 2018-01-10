import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Toast } from 'quasar'

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
    createActivity ({ commit, getters, dispatch }, payload) {
      const userId = getters.user.id
      const dateRef = firebase.database().ref('activities/' + userId)
      dateRef.push(payload)
        .then(resp => {
          dispatch('loadActivities')
          Toast.create({
            html: 'create succeded!',
            color: 'positive',
            icon: 'check',
            bgColor: 'white',
            timeout: 3000
          })
        })
        .catch(error => {
          console.log(error)
          Toast.create.negative({
            html: 'An error occured!'
          })
        })
    },
    loadActivities ({ commit, getters }) {
      commit('setLoading', true)
      const userId = getters.user.id
      console.log('userId: ', userId)
      const date = '2018-01-'
      const actRef = firebase.database().ref(`activities/${userId}`).orderByChild('date').startAt(date)
      const allActivities = []
      actRef.once('value')
        .then(snap => {
          // console.log('api activities: ', snap.val())
          const dataObj = snap.val()
          for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
              const el = dataObj[key]
              allActivities.push({
                id: key,
                ...el
              })
            }
          }
          // console.log('all activities: ', allActivities)
          commit('setActivities', allActivities)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log('error loading activities: ', error)
          commit('setLoading', false)
        })
    },
    deleteActivity ({commit, getters, dispatch}, payload) {
      commit('setLoading', true)
      const userId = getters.user.id
      const actId = payload.id
      const actRef = firebase.database().ref(`activities/${userId}`)
      actRef.child(actId).remove()
        .then(data => {
          console.log('delete complete')
          Toast.create.warning({
            html: 'Log deleted!',
            icon: 'close',
            timeout: 3000
          })
          commit('setLoading', false)
          dispatch('loadActivities')
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    updateActivity ({commit, getters, dispatch}, payload) {
      commit('setLoading', true)
      const userId = getters.user.id
      const actId = payload.id
      const {id, ...rest} = payload
      const actRef = firebase.database().ref(`activities/${userId}`)
      actRef.child(actId).update(rest)
        .then(() => {
          Toast.create({
            html: 'Update succeded!',
            color: 'positive',
            icon: 'check',
            bgColor: 'white',
            timeout: 3000
          })
          dispatch('loadActivities')
          commit('setLoading', false)
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
