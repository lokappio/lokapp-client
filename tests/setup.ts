import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import {serviceInjection} from "@/data/di/service";
import VueRouter from "vue-router";
import VueI18n from "vue-i18n";
import Notify from "@/plugins/notify";

Vue.use(Vuetify);
Vue.use(Notify, { $vuetify: new Vuetify().framework });
Vue.use(serviceInjection);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);