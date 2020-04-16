<template>
  <v-card
    :id="'note-' + note.id"
    class="note ma-2"
    :class="note.color"
    @dblclick="open"
    :dark="dark"
  >
    <v-card-title class="py-2 pt-3 pr-0">
      <v-layout row>
        <div class="blue--text pr-1">
          <strong>#{{ note.id }}</strong>
        </div>
        <h4>{{ note.title }}</h4>
        <v-spacer></v-spacer>
        <v-btn small class="pr-6" icon @click="edit">
          <v-icon size="18">mdi-pencil</v-icon>
        </v-btn>
      </v-layout>
    </v-card-title>
    <v-divider></v-divider>
    <NoteTags class="px-2" :note-color="note.color" :tags="note.tags" />
    <v-card-text v-html="note.description"></v-card-text>
  </v-card>
</template>
<script>
import NoteTags from "./NoteTags.vue";

export default {
  name: "Note",
  components: {
    NoteTags
  },
  props: {
    note: Object
  },
  methods: {
    edit() {
      this.$store.dispatch("EditNote", this.note);
    },

    open() {
      this.$store.dispatch("VisualizeNote", this.note);
    }
  },
  computed: {
    dark() {
      const darkMode = this.$store.state.AppStore.darkMode && this.note.color == "";
      return darkMode ? true : !!this.note.color.includes("white--text");
    }
  }
};
</script>

<style lang="scss" scoped>
.note {
  cursor: pointer;
  transition: 0.1s;
  animation: show-note 200ms ease-in-out;
  user-select: none;

  &__button {
    border-radius: 0;
    min-width: 10px !important;
    max-height: 10px !important;
    margin: 0;
  }

  &:hover {
    opacity: 0.8;
  }

  @keyframes show-note {
    0% {
      transform: translateY(30%);
    }

    100% {
      transform: translateY(0);
    }
  }

  .v-card__text img {
    width: 100%;
  }

  .tag {
    border-radius: 5% !important;
    z-index: 0;
  }
}
</style>