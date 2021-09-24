<template>
  <v-text-field
      :id="inputId"
      v-if="$store.getters.actualRole.canWriteValue"
      v-model="item[header.value]"
      @blur="saveValue(item.keyId, item.quantity, header.value, item[header.value])"
      @keydown.enter.tab="blurInput"
      single-line
  >
  </v-text-field>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import SpecificValue from "@/data/models/api/SpecificValue";
import Vue from "vue";

export default Vue.extend({
  name: "template-item-values",
  props: ["header", "item", "projectId", "refreshEverything", "items", "getActualLineIndex"],
  computed: {
    inputId(): string { return this.item.keyId.toString() + this.item.quantity.toString()},
  },
  methods: {
    changeValueFromTable(keyId, quantity, value, languageId) {
      const indexToChange = this.getActualLineIndex(keyId, quantity);
      this.items[indexToChange][value.languageId.toString()] = value.valueName;
      this.$set(this.items[indexToChange], languageId.toString(), value.valueName);
    },
    reportError(error) {
      this.$notify(error);
      this.$eventBus.$emit(EventEnum.ERROR_ACTION);
    },
    deleteValue(value) {
      this.$service.values.deleteValue(this.projectId, value)
          .catch(() => {
            this.reportError(this.$t("errors.unknown_error"));
          });
    },
    createValue(keyId, newValue, languageId, quantity) {
      this.$service.values.createValue(this.projectId, keyId, {valueName: newValue, languageId: languageId, quantity: quantity})
          .then((response) => {
            const value = SpecificValue.map(response.data);
            this.changeValueFromTable(keyId, quantity, value, languageId);
          }).catch(() => {
        this.reportError(this.$t("errors.unknown_error"));
      });
    },
    updateValue(newValueObject) {
      this.$service.values.updateValue(this.projectId, newValueObject)
          .then((response) => {
            const value = SpecificValue.map(response.data);
            this.changeValueFromTable(value.keyId, value.quantity, value, value.languageId);
          }).catch(() => {
        this.reportError(this.$t("errors.unknown_error"));
      });
    },
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    saveValue(keyId, quantity, languageId, newValue): Promise {
      console.log("save");

      this.$service.values.getSpecificValue(this.projectId, {keyId: keyId, languageId: languageId})
          .then((values) => {
            const indexValue = values.findIndex((element) => element.quantity === quantity);

            if (newValue === "") {
              if (values.length <= 0) {
                return;
              }
              if (indexValue === -1) {
                this.reportError(this.$t("errors.unknown_error"));
                return;
              }
              this.deleteValue({keyId: keyId, valueId: values[indexValue].valueId});

            } else if (newValue != null) {
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