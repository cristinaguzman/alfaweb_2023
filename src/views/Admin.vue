<template>
  <v-container class="grey lighten-2">
    <h1 class="mb-2 light-blue accent-2">Administración</h1>
    <v-row class="grey lighten-2">
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="getCourses"
          :items-per-page="5"
          class="elevation-1"
          loading-text="Cargando..."
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="orange darken-4"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Agregar Curso
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.code"
                            :error-messages="codeErrors"
                            label="Codigo"
                            required
                            @input="$v.editedItem.code.$touch()"
                            @blur="$v.editedItem.code.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.name"
                            :error-messages="nameErrors"
                            label="Nombre"
                            required
                            @input="$v.editedItem.name.$touch()"
                            @blur="$v.editedItem.name.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.slots"
                            :error-messages="slotsErrors"
                            label="Cupos"
                            required
                            @input="$v.editedItem.slots.$touch()"
                            @blur="$v.editedItem.slots.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.enrolled"
                            :error-messages="enrolledErrors"
                            label="Inscritos"
                            required
                            @input="$v.editedItem.enrolled.$touch()"
                            @blur="$v.editedItem.enrolled.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.cost"
                            :error-messages="costErrors"
                            label="Costo"
                            required
                            @input="$v.editedItem.cost.$touch()"
                            @blur="$v.editedItem.cost.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="editedItem.duration"
                            :error-messages="durationErrors"
                            label="Duracion"
                            required
                            @input="$v.editedItem.duration.$touch()"
                            @blur="$v.editedItem.duration.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.imgUrl"
                            :error-messages="imgUrlErrors"
                            label="URL Imagen"
                            required
                            @input="$v.editedItem.imgUrl.$touch()"
                            @blur="$v.editedItem.imgUrl.$touch()"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            rows="2"
                            v-model="editedItem.description"
                            :error-messages="descriptionErrors"
                            label="Descripcion"
                            required
                            @input="$v.editedItem.description.$touch()"
                            @blur="$v.editedItem.description.$touch()"
                          ></v-textarea>
                        </v-col>
                        <v-col cols="12">
                          <v-switch
                            v-model="editedItem.state"
                            :label="`Terminado: ${
                              editedItem.state ? 'Si' : 'No'
                            }`"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Guardar
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogDelete" max-width="280">
                <v-card>
                  <v-card-title class="text-h5 text-justify red accent-3">
                    ¿Seguro(a) que quiere borrar el curso?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">
                      Cancelar
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="deleteItemConfirm"
                    >
                      OK
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item.id)"> mdi-delete </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row v-if="!getLoading">
      <v-col>
        <v-alert dense outlined color="pink darken-4" icon="mdi-account-group">
          Cantidad total de alumnos permitidos: {{ getTotalOfSlots }}
        </v-alert>

        <v-alert
          dense
          outlined
          color="deep-purple darken-4"
          icon="mdi-account-multiple-check"
        >
          Cantidad total de alumnos inscritos: {{ getTotalOfEnrolled }}
        </v-alert>

        <v-alert dense outlined color="red darken-4" icon="mdi-account-clock">
          Cantidad total de cupos restantes: {{ getTotalRemainingSlots }}
        </v-alert>

        <v-alert dense outlined color="pink accent-3" icon="mdi-cancel">
          cantidad total de cursos terminados: {{ getTotalOfFinishedCourses }}
        </v-alert>

        <v-alert dense outlined color="brown darken-1" icon="mdi-bell-check">
          Cantidad total de cursos activos: {{ getTotalOfActiveCourses }}
        </v-alert>

        <v-alert
          dense
          outlined
          color="deep-orange darken-3"
          icon="mdi-bell-ring"
        >
          Cantidad total de cursos: {{ getTotalOfCourses }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";

const enrolledCantBeGreaterThanSlots = (value, vm) => value <= vm.slots;

export default {
  name: "Home",
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Codigo",
        align: "start",
        value: "data.code",
      },
      { text: "Nombre", value: "data.name" },
      { text: "Cupos", value: "data.slots" },
      { text: "Inscritos", value: "data.enrolled" },
      { text: "Duracion", value: "data.duration" },
      { text: "Costo", value: "data.cost" },
      { text: "Terminado", value: "data.state" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    editedIndex: null,
    editedItem: {
      code: "",
      name: "",
      state: false,
      cost: 0,
      duration: "",
      description: "",
      slots: 0,
      enrolled: 0,
      imgUrl: "",
    },
    defaultItem: {
      code: "",
      name: "",
      state: false,
      cost: 0,
      duration: "",
      description: "",
      slots: 0,
      enrolled: 0,
      imgUrl: "",
    },
  }),
  mixins: [validationMixin],
  validations: {
    editedItem: {
      code: { required },
      name: { required },
      cost: { required },
      duration: { required },
      description: { required },
      slots: { required },
      enrolled: { required, enrolledCantBeGreaterThanSlots },
      imgUrl: { required },
    },
  },

  computed: {
    ...mapGetters([
      "getCourses",
      "getLoading",
      "getTotalOfSlots",
      "getTotalOfEnrolled",
      "getTotalRemainingSlots",
      "getTotalOfFinishedCourses",
      "getTotalOfActiveCourses",
      "getTotalOfCourses",
    ]),
    formTitle() {
      return !this.editedIndex ? "Nuevo Curso" : "Editar Curso";
    },
    codeErrors() {
      let errors = [];
      if (!this.$v.editedItem.code.$dirty) return errors;
      !this.$v.editedItem.code.required && errors.push("Codigo es requerido.");
      return errors;
    },
    nameErrors() {
      let errors = [];
      if (!this.$v.editedItem.name.$dirty) return errors;
      !this.$v.editedItem.name.required && errors.push("Nombre es requerido.");
      return errors;
    },
    slotsErrors() {
      let errors = [];
      if (!this.$v.editedItem.slots.$dirty) return errors;
      !this.$v.editedItem.slots.required && errors.push("Cupos es requerido.");
      return errors;
    },
    enrolledErrors() {
      let errors = [];
      if (!this.$v.editedItem.enrolled.$dirty) return errors;
      !this.$v.editedItem.enrolled.required &&
        errors.push("Inscritos es requerido.");
      !this.$v.editedItem.enrolled.enrolledCantBeGreaterThanSlots &&
        errors.push("Inscritos no puede ser mayor a cupos.");
      return errors;
    },
    costErrors() {
      let errors = [];
      if (!this.$v.editedItem.cost.$dirty) return errors;
      !this.$v.editedItem.cost.required && errors.push("Costo es requerido.");
      return errors;
    },
    durationErrors() {
      let errors = [];
      if (!this.$v.editedItem.duration.$dirty) return errors;
      !this.$v.editedItem.duration.required &&
        errors.push("Duracion es requerido.");
      return errors;
    },
    imgUrlErrors() {
      let errors = [];
      if (!this.$v.editedItem.imgUrl.$dirty) return errors;
      !this.$v.editedItem.imgUrl.required &&
        errors.push("URL imagen es requerido.");
      return errors;
    },
    descriptionErrors() {
      let errors = [];
      if (!this.$v.editedItem.description.$dirty) return errors;
      !this.$v.editedItem.description.required &&
        errors.push("Descripcion es requerido.");
      return errors;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    this.fetchCourses();
    this.editedItem = { ...this.defaultItem };
  },
  methods: {
    ...mapActions([
      "fetch_Courses",
      "delete_Course",
      "update_Course",
      "add_Course",
    ]),
    fetchCourses() {
      this.fetch_Courses();
    },
    editItem(item) {
      this.editedIndex = item.id;
      this.editedItem = { ...item.data };
      this.dialog = true;
    },
    deleteItem(id) {
      this.editedIndex = id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.delete_Course(this.editedIndex);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = null;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = null;
      });
    },
    save() {
      this.$v.$touch();
      if (this.editedIndex) {
        if (!this.$v.$invalid) {
          this.update_Course({ id: this.editedIndex, course: this.editedItem });
          this.close();
        }
      } else {
        if (!this.$v.$invalid) {
          this.add_Course(this.editedItem);
          this.close();
        }
      }
    },
  },
};
</script>
