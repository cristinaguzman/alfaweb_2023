<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>
        <v-card shaped>
          <v-card-title>Registro de Usuario</v-card-title>
          <v-card-text>
            <form>
              <v-text-field
                v-model="email"
                :error-messages="emailErrors"
                label="Correo Electrónico"
                required
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              ></v-text-field>

              <v-text-field
                v-model="password"
                :error-messages="passwordErrors"
                label="Clave"
                required
                @input="$v.password.$touch()"
                @blur="$v.password.$touch()"
                type="password"
              ></v-text-field>

              <v-btn color="teal lighten-1" class="mr-4" @click="submit">
                Registrar
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
      !this.$v.email.email && errors.push("Correo electrónico debe ser válido");
      !this.$v.email.required && errors.push("Correo electrónico es requerido");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Clave es requerida");
      return errors;
    },
  },
  methods: {
    ...mapActions(["register"]),
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const formData = { email: this.email, password: this.password };
        this.register(formData);
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
