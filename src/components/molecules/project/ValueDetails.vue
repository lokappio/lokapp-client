<template>
  <div>
    <span class="title-h2 primary--text">{{ selectedItem.group.name }}/{{ selectedItem.key.name }}</span>
    <div>
      <div v-for="value in values" v-bind:key="value.id" class="my-4">
        <div>{{ value.name || "--" }}</div>
        <div>
          <span class="text-caption">{{ dateToDateTimeString(value.updatedAt) }}</span>
          <span class="text-caption mx-2">|</span>
          <span :class="getClass(value) + ' text-caption'">{{ value.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import Value, {TranslationStatus} from "@/data/models/api/Value";
import {translationItem} from "@/data/models/types/TranslationTypes";
import {dateToDateTimeString} from "@/helpers/date";

export default Vue.extend({
  name: "value-details",
  methods: {
    dateToDateTimeString,
    getValues() {
      const item = this.selectedItem as translationItem;

      // Loading values from props first
      this.values = item.key.values.filter(value => value.languageId === this.selectedLanguageId)
          .filter(value => !item.key.isPlural || value.quantityString === item.quantity)
          .sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1);

      // Then, loading values from API in order to get the latest values
      this.$service.values.getValuesByKeyId(item.key.id)
          .then(values => {
            this.values = values
                .filter(value => value.languageId === this.selectedLanguageId)
                .filter(value => !item.key.isPlural || value.quantityString === item.quantity)
                .sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1);
          });
    },
    getClass(value: Value): string {
      if (value.status === TranslationStatus.VALIDATED) {
        return "green--text";
      } else if (value.status === TranslationStatus.INVALIDATED) {
        return "red--text";
      } else {
        return "";
      }
    }
  },
  data() {
    return {
      values: [] as Value[]
    }
  },
  mounted() {
    this.getValues();
  },
  watch: {
    async selectedItem() {
      this.getValues();
    },
    async selectedLanguageId() {
      this.getValues();
    }
  },
  props: {
    selectedItem: {},
    selectedLanguageId: Number,
  },
});
</script>

<style scoped lang="scss">

</style>
