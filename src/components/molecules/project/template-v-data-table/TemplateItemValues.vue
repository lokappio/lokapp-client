<template>
  <v-text-field
      :id="inputId"
      class="my-3"
      :readonly="isSourceLanguage || !canWriteValue"
      v-model="updatedValue.name"
      @blur="saveValue()"
      @keydown.enter="blurInput"
      @keydown.tab="blurInput"
      @click="onValueClicked()"
      single-line
      hide-details
  >
    <template v-slot:append>
      <v-progress-circular v-if="loading" size="20" indeterminate color="primary"></v-progress-circular>
      <v-icon v-else color="primary" size="20">{{ inputIcon }}</v-icon>
      <v-icon v-if="!loading && inputIcon === ''&& !isSourceLanguage" :color="statusColor">{{ statusIcon }}</v-icon>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import {TranslationItem} from "@/data/models/types/TranslationTypes";
import Value, {TranslationStatus} from "@/data/models/api/Value";
import {DataTableHeader} from "vuetify";
import {LanguageAccess} from "@/data/models/api/Language";

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
      updatedValue: {} as Value
    }
  },
  mounted() {
    this.updatedValue = Object.assign(Value.map({}), this.getValue()); // Object assign to create a copy and avoid reference
  },
  watch: {
    // Item can be changed by parent component
    item() {
        this.updatedValue = Object.assign(Value.map({}), this.getValue()); // Object assign to create a copy and avoid reference
    }
  },
  computed: {
    inputId(): string {
      let id: string = (this.item as TranslationItem).key.id + (this.header as DataTableHeader).value.toString();
      if ((this.item as TranslationItem).quantity) {
        id += (this.item as TranslationItem).quantity;
      }

      return id;
    },
    canWriteValue(): boolean {
      return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteValue : false;
    },
    statusIcon(): string {
      return this.updatedValue.status === TranslationStatus.VALIDATED ? "mdi-check" : this.updatedValue.status === TranslationStatus.INVALIDATED ? "mdi-alert-circle-outline" : "";
    },
    statusColor(): string {
      return this.updatedValue.status === TranslationStatus.VALIDATED ? "green" : this.updatedValue.status === TranslationStatus.INVALIDATED ? "red" : "";
    },
    isSourceLanguage(): boolean {
      const value = (this.item as TranslationItem).languages[(this.header as DataTableHeader).value];
      return value ? value.languageAccess === LanguageAccess.source : false;
    },
  },
  methods: {
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    getValue(): Value {
      const item = this.item as TranslationItem;
      const languageId = parseInt((this.header as DataTableHeader).value);
      if (this.isSourceLanguage) {
        // If it's a source language, we must show a validated values to the user
        return (item.key.values.filter(value => value.languageId == languageId)
            .filter(value => value.status === TranslationStatus.VALIDATED && (!item.key.isPlural || value.quantityString === item.quantity)))[0] || Value.map({
          languageId: languageId,
          name: "",
          id: item.languages[languageId].id,
        });
      } else {
        return item.languages[languageId];
      }
    },
    saveValue(): Promise<any> {
      if (this.isSourceLanguage) {
        return Promise.resolve();
      }

      const previousValue = (this.item as TranslationItem).languages[(this.header as DataTableHeader).value]
      const previousWasEmpty = previousValue.name == "" ? this.updatedValue.name !== "" : true;

      if (this.updatedValue.name != null && previousWasEmpty && this.updatedValue.name != previousValue.name) {
        this.loading = true;

        return this.$service.values.updateValue(this.updatedValue)
            .then(() => {
              this.updatedValue.status = TranslationStatus.MODIFIED;
              this.$emit("valueSaved", this.updatedValue);
              this.loading = false;
              this.inputIcon = "mdi-check";
              setTimeout(() => this.inputIcon = "", 1000);
            })
            .catch(() => {
              this.updatedValue = Object.assign(Value.map({}), (this.item as TranslationItem).languages[(this.header as DataTableHeader).value]);
              this.loading = false;
              this.$notify(this.$t("errors.update_value").toString(), {color: "red"});
            });
      }
    },
    onValueClicked(): void {
      this.$emit("valueClicked", this.item, this.updatedValue.languageId);
    }
  }
});
</script>