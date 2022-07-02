<template>
  <div>
    <v-snackbar v-model="show" :color="color" shaped center top>
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["snackbar"]),
    show: {
      get() {
        return this.snackbar.show;
      },
      set(newShow) {
        const snack = {
          show: newShow,
          text: "",
          color: "",
        };
        this.show_Snack(snack);
      },
    },
    color() {
      return this.snackbar.color;
    },
    text() {
      return this.snackbar.text;
    },
  },
  methods: {
    ...mapActions(["show_Snack"]),
  },
};
</script>

<style></style>
