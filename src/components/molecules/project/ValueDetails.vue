<template>
  <div>
    <span class="title-h2 primary--text">{{ selectedItem.group.name }}/{{ selectedItem.key.name }}</span>
    <div>
      <div v-for="(value, index) in values" v-bind:key="value.id" class="my-4">
        <div v-if="index === 0">
          <div class="title-h3">{{ value.name || "--" }}</div>
          <div>
            <span class="text-caption">{{ dateToDateTimeString(value.updatedAt) }}</span>
            <span class="text-caption mx-2">|</span>
            <span :class="getClass(value) + ' text-caption'">{{ $t('translation_status.' + value.status) }}</span>
          </div>
          <div v-if="canWriteStatus" class="align-center align-content-center">
            <v-btn-toggle v-model="selectedStatus" color="primary" @change="toggleStatus">
              <v-btn depressed>{{ $t('translation_details.invalidate_button') }}</v-btn>
              <v-btn depressed>{{ $t('translation_details.validate_button') }}</v-btn>
            </v-btn-toggle>
          </div>
          <v-divider class="mt-4"></v-divider>
        </div>
        <div v-else>
          <div>{{ value.name || "--" }}</div>
          <div>
            <span class="text-caption">{{ dateToDateTimeString(value.updatedAt) }}</span>
            <span class="text-caption mx-2">|</span>
            <span :class="getClass(value) + ' text-caption'">{{ $t('translation_status.' + value.status) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import Value, {TranslationStatus} from "@/data/models/api/Value";
import {TranslationItem} from "@/data/models/types/TranslationTypes";
import {dateToDateTimeString} from "@/helpers/date";
import Language, {LanguageAccess} from "@/data/models/api/Language";
import Project from "@/data/models/api/Project";

export default Vue.extend({
  name: "value-details",
  methods: {
    dateToDateTimeString,
    getValues() {
      const item = this.selectedItem as TranslationItem;
      const project: Project = this.$store.state.currentProject;
      const language: Language = project.languages.find(language => language.id === this.selectedLanguageId);

      // Loading values from props first
      this.values = item.key.values.filter(value => value.languageId === this.selectedLanguageId)
          .filter(value => !item.key.isPlural || value.quantityString === item.quantity)
          .sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1);
      this.selectedStatus = this.values[0].status === TranslationStatus.VALIDATED ? 1 : this.values[0].status === TranslationStatus.INVALIDATED ? 0 : undefined;

      // Then, loading values from API in order to get the latest values
      this.$service.values.getValuesByKeyId(item.key.id)
          .then(values => {
            this.values = values
                .filter(value => value.languageId === this.selectedLanguageId)
                .filter(value => !item.key.isPlural || value.quantityString === item.quantity)
                .sort((a, b) => (a.updatedAt > b.updatedAt) ? -1 : 1).map(value => {
                  return {
                      ...value,
                      languageName: language.name,
                  }
                });
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
    },
    toggleStatus() {
      const newStatus = this.selectedStatus === 1 ? TranslationStatus.VALIDATED : this.selectedStatus === 0 ? TranslationStatus.INVALIDATED : TranslationStatus.MODIFIED;
      this.$service.values.updateValueStatus(this.values[0], newStatus)
          .then(() => {
            this.values[0].status = newStatus;
            // We updated the store to apply status changed to the line in the table
            this.$store.commit("UPDATE_PROJECT_VALUE", this.values[0]);
          });
    }
  },
  data() {
    return {
      values: [] as Value[],
      selectedStatus: undefined as number | undefined,
    }
  },
  computed: {
    canWriteStatus(): boolean {
      const item = this.selectedItem as TranslationItem;
      const isSourceLanguage = item.key.values.find(value => value.languageId === this.selectedLanguageId).languageAccess == LanguageAccess.source
      // Can't change the status if the language is a source language or if the user doesn't have the right to write status
      return !isSourceLanguage && (this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteStatus : false);
    },
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
