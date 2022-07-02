import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Home from "../views/Home.vue";
import Admin from "../views/Admin.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import NotFoundComponent from "../views/NotFoundComponent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    redirect: "/login",
  },
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      login: true,
    },
  },
  {
    path: "/administracion",
    name: "Admin",
    component: Admin,
    meta: {
      login: true,
    },
  },
  {
    path: "/registro",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:catchAll(.*)",
    component: NotFoundComponent,
    name: "NotFound",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(function () {
    let user = firebase.auth().currentUser;
    let authRequired = to.matched.some((route) => route.meta.login);
    if (authRequired && !user) next("/login");
    else if (!authRequired && user) next("/home");
    else next();
  });
});

export default router;
