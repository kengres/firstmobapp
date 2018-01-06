export default {
  state: {
    isEditMode: false,
    avatarModalOpen: false
  },
  getters: {
    isEditMode: state => state.isEditMode,
    avatarModalOpen: state => state.avatarModalOpen
  },
  mutations: {
    setEditMode (state, payload) {
      state.isEditMode = payload
    },
    setAvatarModalOpen (state, payload) {
      state.avatarModalOpen = payload
    }
  },
  actions: {
    setEditMode ({ commit }, payload) {
      commit('setEditMode', payload)
    },
    setAvatarModalOpen ({ commit }, payload) {
      commit('setAvatarModalOpen', payload)
    }
  }
}
