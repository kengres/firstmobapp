import Vue from 'vue'
import Vuex from 'vuex'

// modules
import activities from './activities'
import user from './user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    activities,
    user
  },
  state: {
    loading: false,
    error: null
  },
  getters: {
    loading: state => state.loading,
    error: state => state.error
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    }
  },
  actions: {
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    setError ({ commit }, payload) {
      commit('setError', payload)
    }
  }
})
export default store
