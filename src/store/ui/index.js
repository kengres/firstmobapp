export default {
  state: {
    isEditMode: false,
    avatarModalOpen: false,
    profileUpdated: ''
  },
  getters: {
    isEditMode: state => state.isEditMode,
    avatarModalOpen: state => state.avatarModalOpen,
    profileUpdated: state => state.profileUpdated
  },
  mutations: {
    setEditMode (state, payload) {
      state.isEditMode = payload
    },
    setAvatarModalOpen (state, payload) {
      state.avatarModalOpen = payload
    },
    profileUpdate (state, payload) {
      state.profileUpdated = payload
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
