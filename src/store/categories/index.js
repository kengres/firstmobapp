export default {
  state: {
    categories: [
      { id: 1, name: 'Work', value: 'work', icon: 'work' },
      { id: 2, name: 'Health', value: 'health', icon: 'local_hospital' },
      { id: 3, name: 'Sport', value: 'sport', icon: 'directions_run' }
    ]
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
    addCategory ({ commit }, payload) {
      commit('addCategory', payload)
    },
    setCategories ({ commit }, payload) {
      commit('setCategories', payload)
    }
  }
}
