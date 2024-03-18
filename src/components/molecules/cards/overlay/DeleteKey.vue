<template>
  <v-card color="white" width="100%" class="pa-4 pa-md-7 custom-cards">
    <!-- Title and close -->
    <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>

    <v-card-title class="title-style d-flex justify-space-around">{{ $t("key_delete.title") }}</v-card-title>

    <!-- Confirmation text -->
    <v-card-text class="pb-0">
      <div class="field text-center">{{ $t("key_delete.description_1", {"value": this.item.key.name}) }}</div>
      <div class="field text-center">{{ $t("key_delete.description_2") }}</div>
    </v-card-text>

    <!-- Buttons -->
    <v-card-actions class="mt-0 pt-0">
      <v-container class="py-0">
        <v-row class="mt-2 pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <action-button block :loading="loading" :handler="deleteKey" :text="$t('key_delete.confirm_button').toString()"/>
          </v-col>
        </v-row>
        <v-row class="mt-2 pb-0">
          <v-col cols="12" class="pb-0 px-0 text-center">
            <v-btn text @click="closeOverlay" color="primary">{{ $t('key_delete.cancel_button').toString() }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>

  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {TranslationItem} from "@/data/models/types/TranslationTypes";

export default Vue.extend({
  name: "DeleteKey",
  props: {item: {}, dialogOpened: Boolean},
  data() {
    return {
      loading: false
    };
  },
  methods: {
    closeOverlay(): void {
      this.$emit("close");
    },
    deleteKey() {
      this.loading = true;

      this.$service.keys.deleteKey((this.item as TranslationItem).key.id)
          .then(() => this.$emit("deletedKey"))
          .catch((error) => this.$notify(this.$t(error).toString(), {color: "red"}))
          .finally(() => this.loading = false);
    }
  }
});
</script>