<template>
  <!-- SAVE VALUE WHEN INPUT IS UNFOCUSED (Blur) -->
  <v-text-field
      :id="inputId"
      v-if="canWriteValue"
      v-model="item[header.value].name"
      @blur="saveValue()"
      @keydown.enter="blurInput"
      @keydown.tab="blurInput"
      single-line
  >
  </v-text-field>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";

export default Vue.extend({
  name: "template-item-values",
  props: {
    header: {},
    item: translationItem,
    projectId: Number,
  },
  computed: {
    inputId(): string {
      let id: string = this.item.key.id + this.header.value.toString();
      if (this.item.quantity) {
        id += this.item.quantity;
      }

      return id;
    },
    canWriteValue(): boolean {
      return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteValue : false;
    }
  },
  methods: {
    reportError(error: string): void {
      this.$notify(error);
    },
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    saveValue(): Promise<void> {
      return this.$service.values.updateValue(this.item[this.header.value])
          .catch(() => {
            this.reportError(this.$t("errors.unknown_error"));
          });
    }
  }
});
</script>

<style lang="scss" scoped>
.span-with-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
  max-width: 360px;
  width: 100%;
}

.empty-value {
  width: 300px;
  background-color: #F6F6F6;
}
</style>