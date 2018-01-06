export default {
  state: {
    isEditMode: false
  },
  getters: {
    isEditMode: state => state.isEditMode
  },
  mutations: {
    setEditMode (state, payload) {
      state.isEditMode = payload
    }
  },
  actions: {
    setEditMode ({ commit }, payload) {
      commit('setEditMode', payload)
    }
  }
}
