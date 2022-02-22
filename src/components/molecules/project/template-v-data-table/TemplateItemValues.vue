<template>
  <!-- SAVE VALUE WHEN INPUT IS UNFOCUSED (Blur) -->
  <v-text-field
      :id="inputId"
      v-if="canWriteValue"
      v-model="updatedValue.name"
      @blur="saveValue()"
      @keydown.enter="blurInput"
      @keydown.tab="blurInput"
      single-line
  >
    <template v-slot:append>
      <v-progress-circular v-if="loading" size="20" indeterminate color="primary"></v-progress-circular>
      <v-icon v-else color="primary" size="20">{{ inputIcon }}</v-icon>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Value from "@/data/models/api/Value";
import {DataTableHeader} from "vuetify";

export default Vue.extend({
  name: "template-item-values",
  props: {
    header: {},
    item: {},
    projectId: Number,
  },
  data() {
    return {
      inputIcon: "",
      loading: false,
      updatedValue: Object.assign(Value.map({}), (this.item as translationItem).languages[(this.header as DataTableHeader).value])
    }
  },
  computed: {
    inputId(): string {
      let id: string = (this.item as translationItem).key.id + (this.header as DataTableHeader).value.toString();
      if ((this.item as translationItem).quantity) {
        id += (this.item as translationItem).quantity;
      }

      return id;
    },
    canWriteValue(): boolean {
      return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteValue : false;
    }
  },
  methods: {
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    saveValue(): Promise<any> {
      const previousWasEmpty = (this.item as translationItem).languages[(this.header as DataTableHeader).value].name == "" ? this.updatedValue.name !== "" : true;

      if(this.updatedValue.name != null && previousWasEmpty && this.updatedValue.name != (this.item as translationItem).languages[(this.header as DataTableHeader).value].name) {
        this.loading = true;

        return this.$service.values.updateValue(this.updatedValue)
            .then(() => {
              this.$emit("valueSaved", this.updatedValue);
              this.loading = false;
              this.inputIcon = "mdi-check";
              setTimeout(() => this.inputIcon = "", 1000);
            })
            .catch(() => {
              this.updatedValue = Object.assign(Value.map({}), (this.item as translationItem).languages[(this.header as DataTableHeader).value]);
              this.loading = false;
              this.$notify(this.$t("errors.update_value").toString(), {color: "red"});
            });
      }
    }
  }
});
</script>