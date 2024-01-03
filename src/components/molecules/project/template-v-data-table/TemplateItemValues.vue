<template>
  <v-container>
    <v-row class="d-flex align-center" >
      <v-col :cols="isSourceLanguage() ? 12 : 10" class="flex-grow-1 flex-shrink-1">
        <v-text-field
            :id="inputId"
            class="my-3"
            v-if="canWriteValue"
            :readonly="isSourceLanguage()"
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
          </template>
        </v-text-field>
      </v-col>
      <v-col v-if="!isSourceLanguage()" cols="2" class="flex-grow-0 flex-shrink-0">
        <v-chip small outlined :color="getStatusColor(updatedValue)">{{ $t('translation_status.' + updatedValue.status) }}</v-chip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Value, {LanguageAccess, TranslationStatus} from "@/data/models/api/Value";
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
    getStatusColor(value: Value): string {
      if (value.status === TranslationStatus.VALIDATED) {
        return "green";
      } else if (value.status === TranslationStatus.INVALIDATED) {
        return "red";
      } else {
        return "";
      }
    },
    getValue(): Value {
      const item = this.item as translationItem;
      const languageId = parseInt((this.header as DataTableHeader).value);
      if (this.isSourceLanguage()) {
        // If it's a source language, we must show a validated values to the user
        return (item.key.values.filter(value => value.languageId == languageId)
            .filter(value => value.status === TranslationStatus.VALIDATED))[0] || Value.map({
          languageId: languageId,
          name: "",
          id: item.languages[languageId].id,
        });
      } else {
        return item.languages[languageId];
      }
    },
    isSourceLanguage(): boolean {
      const value = (this.item as translationItem).languages[(this.header as DataTableHeader).value];
      return value ? value.languageAccess === LanguageAccess.source : false;
    },
    saveValue(): Promise<any> {
      if (this.isSourceLanguage()) {
        return Promise.resolve();
      }

      const previousValue = (this.item as translationItem).languages[(this.header as DataTableHeader).value]
      const previousWasEmpty = previousValue.name == "" ? this.updatedValue.name !== "" : true;

      if (this.updatedValue.name != null && previousWasEmpty && this.updatedValue.name != previousValue.name) {
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
    },
    onValueClicked(): void {
      this.$emit("valueClicked", this.item, this.updatedValue.languageId);
    }
  }
});
</script>