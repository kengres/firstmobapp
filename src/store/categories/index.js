import * as firebase from 'firebase/app'
import 'firebase/database'
import { Alert } from 'quasar'
import 'quasar-extras/animate/bounceInRight.css'
import 'quasar-extras/animate/bounceOutRight.css'

export default {
  state: {
    categories: null
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
      firebase.database().ref('categories/' + getters.user.id + '/' + payload.name).set(newCategory)
        .then(data => {
          console.log('added category: ', data)
        })
        .catch(error => {
          console.error('error category: ', error)
        })
    },
    fetchCategories ({ commit, getters }) {
      // commit('setLoading', true)
      const allCat = []
      firebase.database().ref('categories/' + getters.user.id).on('child_added', snap => {
        console.log('received categories: ', snap.val())
        allCat.push(snap.val())
        commit('setCategories', allCat)
      })
    },
    updateCategory ({ commit, getters }, payload) {
      firebase.database().ref('categories/' + getters.user.id + '/' + payload.name).set(payload)
        .then((a) => {
          console.log('updated: ', a)
          Alert.create({
            html: 'Update succeded!',
            color: 'positive',
            icon: 'check',
            position: 'top-left',
            dismissable: true,
            enter: 'bounceInRight',
            leave: 'bounceOutRight'
          })
        })
    },
    deleteCategory ({ commit, getters }, payload) {
      firebase.database().ref('categories/' + getters.user.id + '/' + payload.name).remove()
        .then((a) => {
          console.log('removed: ', a)
          Alert.create({
            html: 'Delete succeded!',
            color: 'positive',
            icon: 'check',
            position: 'top-left',
            dismissable: true,
            enter: 'bounceInRight',
            leave: 'bounceOutRight'
          })
        })
    }
  }
}
