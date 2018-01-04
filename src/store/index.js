import Vue from 'vue'
import Vuex from 'vuex'

// modules
import activities from './activities'
import catActivities from './catActivities'
import categories from './categories'
import user from './user'
import sql from './sql'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    activities,
    catActivities,
    categories,
    user,
    sql
  },
  state: {
    loading: false,
    hideLeft: false,
    error: null
  },
  getters: {
    loading: state => state.loading,
    hideLeft: state => state.hideLeft,
    error: state => state.error
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setHideLeft (state, payload) {
      console.log('making hidelefr to: ', payload)
      state.hideLeft = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setHideLeft ({ commit }, payload) {
      commit('setHideLeft', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    }
  }
})
export default store
