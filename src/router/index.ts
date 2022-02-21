import Vue from "vue";
import VueRouter, { NavigationGuardNext, Route } from "vue-router";
import routes from "./routes";
import store from "../store";
import AuthService from "@/data/services/AuthService";
import Meta from 'vue-meta'

Vue.use(VueRouter);
Vue.use(Meta);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const handleRoute = (to: Route, from: Route, next: NavigationGuardNext) => {
  if (to.meta.authRequired && !AuthService.isLoggedIn()) {
    next({ path: "/login", replace: true });
  } else if (to.name === "LoginPage" && AuthService.isLoggedIn()) {
    next({ path: "/dashboard", replace: true });
  } else {
    next();
  }
};

router.beforeEach((to, from, next) => {

  if (store.getters.applicationReady) {
    handleRoute(to, from, next);
  } else {
    store.watch((state) => state.applicationReady, (ready) => {
      if (ready) {
        handleRoute(to, from, next);
      }
    })
  }
});

export default router;
