import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/custom-components';
import i18n from './i18n';
import './sass/main.scss';
import './data/di/index.ts';

import firebase from "firebase/app";
import config from "./config/index";

import './plugins/vue-meta';

firebase.initializeApp(config.firebase);


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
