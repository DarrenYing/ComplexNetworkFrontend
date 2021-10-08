// dashboard图数据相关

const state = {
  curNodeId: '',
  curEdgeId: '',
}

const getters = {
  curNodeId(state) {
    return state.curNodeId;
  },

  curEdgeId(state) {
    return state.curEdgeId;
  }
}

const mutations = {
  setCurNodeId(state, id) {
    state.curNodeId = id;
  },

  setCurEdgeId(state, id) {
    state.curEdgeId = id;
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

