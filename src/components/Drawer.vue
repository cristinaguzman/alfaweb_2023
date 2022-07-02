<template>
  <div>
    <v-navigation-drawer
      v-if="currentUser"
      class="pink darken-1 accent-4"
      v-model="show"
      left
      temporary
      app
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> Menu </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item-group active-class="deep-purple--text text--accent-4">
          <v-list-item to="/">
            <v-list-item-title>Inicio</v-list-item-title>
          </v-list-item>

          <v-list-item to="/administracion">
            <v-list-item-title> Administracion</v-list-item-title>
          </v-list-item>

          <v-list-item @click="loadData">
            <v-list-item-title> Cargar Datos</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <div class="pa-2">
        <v-btn block @click="logout"> Cerrar Sesión </v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Drawer",
  data: () => ({}),
  computed: {
    ...mapState(["user", "drawer"]),
    currentUser() {
      return this.user;
    },
    show: {
      get() {
        return this.drawer;
      },
      set(newShow) {
        this.show_Drawer(newShow);
      },
    },
  },
  methods: {
    ...mapActions(["sign_Out", "load_Data", "show_Drawer"]),
    logout() {
      this.sign_Out();
    },
    loadData() {
      this.load_Data();
    },
  },
};
</script>
