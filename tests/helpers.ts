import {createLocalVue, mount, ThisTypedMountOptions, Wrapper} from "@vue/test-utils";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import {Store} from "vuex";
import states, {State} from "@/store/states";
import mutations from "@/store/mutations";
import getters from "@/store/getters";
import i18n from "@/i18n";
import Vue from "vue";
import {CombinedVueInstance, ExtendedVue} from "vue/types/vue";

export function setupVueInstance<V extends Vue, Data, Methods, Computed, Props> (component: ExtendedVue<V, Data, Methods, Computed, Props>, options?: ThisTypedMountOptions<V>): Wrapper<CombinedVueInstance<V, Data, Methods, Computed, Props> & Vue> {
  const localVue = createLocalVue()
  const vuetify: Vuetify = new Vuetify();
  const router: VueRouter = new VueRouter();
  const store: Store<State> = new Store<State>({
    state: states,
    mutations: mutations,
    getters: getters,
    actions: {},
    modules: {}
  });

  return mount(component, {
    localVue,
    vuetify,
    router,
    store,
    i18n
  });
}