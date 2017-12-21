import * as firebase from 'firebase/app'
import 'firebase/database'

export default {
  state: {
    categories: []
  },
  getters: {
    categories: state => state.categories
  },
  mutations: {
    addCategory (state, payload) {
      state.categories.push(payload)
    },
    setCategories (state, payload) {
      state.categories = payload
    }
  },
  actions: {
    addCategory ({ commit, getters }, payload) {
      const newCategory = {
        name: payload.name,
        icon: payload.icon,
        color: payload.color
      }
      firebase.database().ref('/categories/' + getters.user.id).push(newCategory)
        .then(data => {
          console.log('added category: ', data)
        })
        .catch(error => {
          console.error('error category: ', error)
        })
    },
    fetchCategories ({ commit, getters }) {
      commit('setLoading', true)
      firebase.database().ref('/categories/' + getters.user.id).once('value')
        .then(resp => {
          console.log('received categories: ', resp.val())
          const dataObj = resp.val()
          const apiCategories = []
          for (const key in dataObj) {
            if (dataObj.hasOwnProperty(key)) {
              apiCategories.push({
                ...dataObj[key],
                id: key
              })
            }
          }
          console.log('committing: ', apiCategories)
          commit('setCategories', apiCategories)
          commit('setLoading', false)
        })
        .catch(error => {
          console.error('error fetching categories: ', error)
          commit('setLoading', false)
        })
    }
  }
}
