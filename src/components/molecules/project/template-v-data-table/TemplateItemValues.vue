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

export default Vue.extend({
  name: "template-item-values",
  props: {
    header: {},
    item: translationItem,
    projectId: Number,
  },
  data() {
    return {
      inputIcon: "",
      loading: false,
      updatedValue: Object.assign({}, this.item[this.header.value])
    }
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
    blurInput(): void {
      document.getElementById(this.inputId).blur();
    },
    saveValue(): Promise<any> {
      this.loading = true;

      return this.$service.values.updateValue(this.updatedValue)
          .then(() => {
            this.item[this.header.value] = Object.assign({},this.updatedValue);
            this.loading = false;
            this.inputIcon = "mdi-check";
            setTimeout(() => this.inputIcon = "", 1000);
          })
          .catch(() => {
            this.updatedValue = Object.assign({}, this.item[this.header.value]);
            this.loading = false;
            this.$notify(this.$t("errors.update_value").toString());
          })
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