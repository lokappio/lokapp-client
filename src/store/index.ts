import Vue from 'vue'
import Vuex from 'vuex'
import states, {State} from "@/store/states";
import mutations from "@/store/mutations";
import getters from "@/store/getters";

Vue.use(Vuex)

export default new Vuex.Store<State>({
  state: states,
  mutations: mutations,
  getters: getters,
  actions: {},
  modules: {}
})