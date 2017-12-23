import * as firebase from 'firebase/app'
import 'firebase/database'

export default {
  state: {
    catActivities: null
  },
  getters: {
    catActivities: state => state.catActivities
  },
  mutations: {
    setCatActivities (state, payload) {
      state.catActivities = payload
    }
  },
  actions: {
    fetchCatActivities ({ commit, getters }) {
      const userId = getters.user.id
      const allCategories = []
      firebase.database().ref('categories/' + userId).on('child_added', snap => {
        const formActivities = []
        firebase.database().ref('categories/' + userId).child(snap.key).child('activities').on('child_added', childSnap => {
          firebase.database().ref('activities/' + userId).child(childSnap.key).once('value')
            .then(finalSnap => {
              formActivities.push({
                id: finalSnap.key,
                ...finalSnap.val()
              })
            })
            .catch(error => console.log(error))
        })
        allCategories.push({
          id: snap.key,
          name: snap.val().name,
          icon: snap.val().icon,
          color: snap.val().color,
          activities: formActivities
        })
      })
      commit('setCatActivities', allCategories)
    }
  }
}
