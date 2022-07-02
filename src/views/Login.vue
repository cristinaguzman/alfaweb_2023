<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>
        <v-card shaped>
          <v-card-title>Acceso de Usuario</v-card-title>
          <v-card-text>
            <form>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="Correo Electrónico"
                required
                @input="$v.email.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Clave"
                required
                @input="$v.password.$touch()"
                type="password"
              ></v-text-field>

              <v-btn color="teal lighten-1" class="mr-4" @click="submit">
                Acceso
              </v-btn>
              <v-btn color="blue-grey darken-1" @click="clear"> Borrar </v-btn>
            </form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required },
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Email debe ser válido");
      !this.$v.email.required && errors.push("Email es requerido");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password es requerido.");
      return errors;
    },
  },
  methods: {
    ...mapActions(["login"]),
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const formData = { email: this.email, password: this.password };
        this.login(formData);
      }
    },
    clear() {
      this.$v.$reset();
      this.email = "";
      this.password = "";
    },
  },
};
</script>
