export default {
  state: {
    isEditMode: false,
    avatarModalOpen: false,
    profileUpdated: '',
    netWorkConnection: false
  },
  getters: {
    isEditMode: state => state.isEditMode,
    avatarModalOpen: state => state.avatarModalOpen,
    profileUpdated: state => state.profileUpdated,
    netWorkConnection: state => state.netWorkConnection
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
    },
    setNetWorkConnection (state, payload) {
      state.netWorkConnection = payload
    }
  },
  actions: {
    setEditMode ({ commit }, payload) {
      commit('setEditMode', payload)
    },
    setAvatarModalOpen ({ commit }, payload) {
      commit('setAvatarModalOpen', payload)
    },
    checkInternetConnection ({ commit }, payload) {
      const networkState = navigator.connection.type
      const states = {}
      const Connection = navigator.connection
      states[Connection.UNKNOWN] = 'Unknown connection'
      states[Connection.ETHERNET] = 'Ethernet connection'
      states[Connection.WIFI] = 'WiFi connection'
      states[Connection.CELL_2G] = 'Cell 2G connection'
      states[Connection.CELL_3G] = 'Cell 3G connection'
      states[Connection.CELL_4G] = 'Cell 4G connection'
      states[Connection.CELL] = 'Cell generic connection'
      states[Connection.NONE] = 'No network connection'

      alert('Connection type: ' + states[networkState])
      if (states[networkState] === 'No network connection') {
        commit('setNetWorkConnection', false)
      }
    }
  }
}
