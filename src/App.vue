<template>
  <v-app>
    <Navbar />
    <Drawer />
    <Snackbar />
    <v-main>
      <router-view />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import { mapActions } from "vuex";

import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";
import Footer from "@/components/Footer";
import Snackbar from "@/components/Snackbar";

export default {
  name: "App",
  components: {
    Navbar,
    Drawer,
    Footer,
    Snackbar,
  },
  data: () => ({}),
  mounted() {
    this.auth_State_Change();
  },
  methods: {
    ...mapActions(["auth_State_Change"]),
  },
};
</script>
