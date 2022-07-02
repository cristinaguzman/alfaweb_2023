<template>
  <v-container>
    <h1 class="mb-2">Listado de Cursos</h1>
    <v-alert dense type="red accent-4" v-if="!getCourses.length">
      No tenemos la lista de los cursos para mostrar
    </v-alert>
    <v-row v-if="getCourses.length">
      <v-col
        v-for="course in getCourses"
        :key="course.id"
        cols="12"
        md="4"
        sm="6"
      >
        <v-card>
          <v-img
            height="250px"
            class="white--text align-end"
            :src="course.data.imgUrl"
          >
            <v-card-title
              v-text="course.data.name"
              class="grey darken-1"
            ></v-card-title>
          </v-img>

          <v-card-text>
            <div class="font-weight-bold ml-8 mb-2">Informacion</div>

            <v-timeline align-top dense>
              <v-timeline-item color="purple" small>
                <div>
                  <div class="font-weight-normal">
                    Costo: <strong>${{ course.data.cost }}</strong>
                  </div>
                  <div>Duracion: {{ course.data.duration }}</div>
                </div>
              </v-timeline-item>
              <v-timeline-item color="green" small>
                <div>
                  <div class="font-weight-normal">
                    Cupos: {{ course.data.slots }}
                  </div>
                  <div>Completado: {{ course.data.state ? "Si" : "No" }}</div>
                </div>
              </v-timeline-item>
              <v-timeline-item color="purple" small>
                <div>
                  <div class="font-weight-normal">Fecha registro:</div>
                  <div>
                    {{ convertTimestamp(course.data.date) }}
                  </div>
                </div>
              </v-timeline-item>
              <v-timeline-item color="green" small>
                <div>
                  <div class="font-weight-normal">
                    Description: {{ course.data.description }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Home",
  data: () => ({}),
  mounted() {
    this.fetchCourses();
  },
  methods: {
    ...mapActions(["fetch_Courses"]),
    fetchCourses() {
      this.fetch_Courses();
    },
    convertTimestamp(timestamp) {
      let date = timestamp.toDate();
      let mm = date.getMonth();
      let dd = date.getDate();
      let yyyy = date.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    },
  },
  computed: {
    ...mapGetters(["getCourses"]),
  },
};
</script>
