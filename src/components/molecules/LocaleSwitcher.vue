<template>
  <div class="custom-select mt-2 pl-2">
    <span class="white--text set-cursor-pointer" v-for="item in items" :key="item.value" @click="switchLocale(item.value)">
      {{ $i18n.locale === item.value ? item.selected : item.text }} 
      <span class="black--text" v-if="item !== items[items.length - 1]">/</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {getLocales} from "@/data/enum/locales.enum";

export default Vue.extend({
  name: "locale-switcher",
  created() {
    if (localStorage.locale) {
      this.$i18n.locale = localStorage.locale;
    }
    this.actual = this.$i18n.locale;
  },
  data() {
    return {
      items: getLocales(),
      actual: null
    }
  },
  methods: {
    switchLocale(locale: string) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        localStorage.locale = locale;
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.custom-select {
  text-align: center;
  width: 100%;
}
.set-cursor-pointer {
  cursor: pointer;
}
</style>