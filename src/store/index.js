import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import { coursesToLoad } from "../data";

Vue.use(Vuex);

const totalSlots = (courses) =>
  courses.reduce((acc, act) => acc + act.data.slots, 0);
const totalEnrolled = (courses) =>
  courses.reduce((acc, act) => acc + act.data.enrolled, 0);

export default new Vuex.Store({
  state: {
    user: null,
    courses: [],
    loading: false,
    snack: {},
    drawer: false,
  },
  getters: {
    drawer: ({ drawer }) => {
      return drawer;
    },
    snackbar: ({ snack }) => {
      return snack;
    },
    getCourses: ({ courses }) => {
      return courses;
    },
    getLoading: ({ loading }) => {
      return loading;
    },
    getTotalOfSlots: ({ courses }) => {
      return totalSlots(courses);
    },
    getTotalOfEnrolled: ({ courses }) => {
      return totalEnrolled(courses);
    },
    getTotalRemainingSlots: ({ courses }) => {
      return totalSlots(courses) - totalEnrolled(courses);
    },
    getTotalOfFinishedCourses: ({ courses }) => {
      return courses.filter((course) => course.data.state).length;
    },
    getTotalOfActiveCourses: ({ courses }) => {
      return courses.filter((course) => !course.data.state).length;
    },
    getTotalOfCourses: ({ courses }) => {
      return courses.length;
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SHOW_DRAWER(state, drawer) {
      state.drawer = drawer;
    },
    SHOW_SNACK(state, snack) {
      state.snack = snack;
    },
    SET_COURSES(state, courses) {
      state.courses = courses;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
  },
  actions: {
    show_Drawer({ commit }, drawer) {
      commit("SHOW_DRAWER", drawer);
    },
    show_Snack({ commit }, snack) {
      commit("SHOW_SNACK", snack);
    },
    register({ commit }, { email, password }) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const { email } = userCredential.user;
          commit("SET_USER", email);
        })
        .catch((error) => {
          const snack = {
            show: true,
            text: error.message,
            color: "error",
          };
          commit("SHOW_SNACK", snack);
        });
    },
    login({ commit }, { email, password }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const { email } = userCredential.user;
          commit("SET_USER", email);
        })
        .catch((error) => {
          const snack = {
            show: true,
            text: error.message,
            color: "error",
          };
          commit("SHOW_SNACK", snack);
        });
    },
    sign_Out({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("SET_USER", null);
        })
        .catch((error) => {
          const snack = {
            show: true,
            text: error.message,
            color: "error",
          };
          commit("SHOW_SNACK", snack);
        });
    },
    auth_State_Change({ commit }) {
      firebase.auth().onAuthStateChanged((userCredential) => {
        if (userCredential) {
          const { email } = userCredential;
          commit("SET_USER", email);
        } else {
          commit("SET_USER", null);
        }
      });
    },
    load_Data() {
      firebase
        .firestore()
        .collection("courses")
        .get()
        .then((res) => {
          res.forEach((element) => {
            element.ref.delete();
          });
        })
        .then(() => {
          coursesToLoad.forEach((course) => {
            firebase.firestore().collection("courses").add(course);
          });
        });
    },
    fetch_Courses({ commit }) {
      commit("SET_LOADING", true);
      firebase
        .firestore()
        .collection("courses")
        .orderBy("date", "asc")
        .onSnapshot((snapshot) => {
          const courses = [];
          snapshot.forEach((doc) => {
            courses.push({ id: doc.id, data: doc.data() });
          });
          commit("SET_LOADING", false);
          commit("SET_COURSES", courses);
        });
    },
    delete_Course({ commit }, id) {
      firebase.firestore().collection("courses").doc(id).delete();
      const snack = {
        show: true,
        text: "Curso eliminado con exito.",
        color: "success",
      };
      commit("SHOW_SNACK", snack);
    },
    update_Course({ commit }, { id, course }) {
      console.log(id, course);
      firebase.firestore().collection("courses").doc(id).set(course);
      const snack = {
        show: true,
        text: "Curso editado con exito.",
        color: "success",
      };
      commit("SHOW_SNACK", snack);
    },
    add_Course({ commit }, course) {
      course.date = firebase.firestore.Timestamp.now();
      firebase.firestore().collection("courses").add(course);
      const snack = {
        show: true,
        text: "Curso agregado con exito.",
        color: "success",
      };
      commit("SHOW_SNACK", snack);
    },
  },
  modules: {},
});
