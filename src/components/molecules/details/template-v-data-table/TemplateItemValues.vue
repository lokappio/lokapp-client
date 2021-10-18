<template>
  <!-- SAVE VALUE WHEN INPUT IS UNFOCUSED (Blur) -->
  <v-text-field
      :id="inputId"
      v-if="$store.getters.actualRole.canWriteValue"
      v-model="item[header.value]"
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

export default Vue.extend({
  name: "template-item-values",
  props: ["header", "item", "projectId", "refreshEverything"],
  computed: {
    inputId(): string {
      console.log(this.item[this.header.value]);
      console.log(this.header);

      let id: string = this.item.keyId.toString() + this.header.value.toString();
      if (this.item.quantity) {
        id += this.item.quantity;
      }

      return id;
    }
  },
  methods: {
    reportError(error: string): void {
      this.$notify(error);
      this.$eventBus.$emit(EventEnum.ERROR_ACTION);
    },
    /*createValue(keyId, newValue, languageId, quantity) {
      this.$service.values.createValue(this.projectId, keyId, {valueName: newValue, languageId: languageId, quantity: quantity})
          .catch(() => {
            this.reportError(this.$t("errors.unknown_error"));
          });
    },*/
    updateValue(newValueObject) {
      this.$service.values.updateValue(this.projectId, newValueObject)
          .catch(() => {
            this.reportError(this.$t("errors.unknown_error"));
          });
    },
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    saveValue(): Promise<void> {
      this.updateValue(this.item[this.header.value]);
    }
    /*saveValue(): Promise<void> {
      this.$service.values.getSpecificValue(this.projectId, {keyId: this.item.keyId, languageId: this.item.languageId})
          .then((values) => {
            const indexValue = values.findIndex((element) => element.quantity === this.item.quantity);
            if (indexValue === -1) {
              this.reportError(this.$t("errors.unknown_error"));
              return;
            }

            if (this.item[this.header.value] != null) {
              if (indexValue === -1) {
                this.createValue(keyId, newValue, languageId, quantity);
              } else {
                values[indexValue].valueName = newValue;
                this.updateValue(values[indexValue]);
              }
            }
          })
          .catch(() => {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
          });
    }*/
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