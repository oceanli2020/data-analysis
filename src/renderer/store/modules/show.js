const state = {
  talker: ''
}

const mutations = {
  SET_TALKER(state, talker) {
    state.talker = talker
  }
}

const actions = {
  setTalker({ commit }, talker) {
    commit('SET_TALKER', talker)
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
