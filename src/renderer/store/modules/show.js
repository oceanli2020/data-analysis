const state = {
  menuDisabled: false
}

const mutations = {
  SET_MENU_DISABLEd(state, menuDisabled) {
    state.menuDisabled = menuDisabled
  }
}

const actions = {
  setMenuDisabled({ commit }, menuDisabled) {
    commit('SET_MENU_DISABLEd', menuDisabled)
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
