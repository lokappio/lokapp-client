import { RouteConfig } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import NotFound from "../views/NotFound.vue";
import LoginPage from "../views/LoginPage.vue";
import DetailProject from "../views/DetailProject.vue";

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/projects/:project_id',
    name: 'DetailProject',
    component: DetailProject,
    meta: {
      authRequired: true,
    }
  },
  { path: "/*", redirect: "/404" },
];


export default routes;
