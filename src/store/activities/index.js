import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
// constant inti
// import { ACTIVITIES_KEY } from '../../config'

export default {
  state: {
    activities: null
  },
  getters: {
    activities: state => state.activities,
    singleActivity: state => state.singleActivity
  },
  mutations: {
    setActivities (state, payload) {
      state.activities = payload
    }
  },
  actions: {
    loadActivities ({ commit, getters }, payload) {
      commit('setLoading', true)
      firebase.database().ref('activities/' + getters.user.id).once('value')
        .then(response => {
          const dataObj = response.val()
          const apiActivities = []
          for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
              const element = dataObj[key]
              const id = key
              const newActivity = {
                ...element,
                id
              }
              apiActivities.push(newActivity)
            }
          }
          console.log('activities from firebase: ', apiActivities)
          commit('setActivities', apiActivities)
          commit('setLoading', false)
        })
        .catch(error => {
          console.log('error fetching activities: ', error)
          commit('setLoading', false)
        })
    },
    fetchUserData ({commit, getters}) {
      firebase.database().ref('/users/' + getters.user.id).once('value')
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    createActivity ({ commit, getters }, payload) {
      const newActivity = {
        date: payload.date,
        start: payload.start,
        end: payload.end,
        category: payload.category
      }
      console.log('creating this: ', newActivity)
      console.log('creator: ', getters.user)
      const root = firebase.database().ref()
      root.child('activities/' + getters.user.id).push(newActivity)
        .then(response => {
          const actId = response.key
          console.log('added activity id: ', actId)
          console.log('new ref: ', `/categories/${newActivity.category}/activities/${actId}`)
          root.child('/categories/' + getters.user.id + '/' + newActivity.category + '/activities/' + actId).set(true)
        })
        .catch(error => {
          console.log('error adding activity: ', error)
        })
    }
  }
}
