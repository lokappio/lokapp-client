<template>
  <div class="left-nav-bar mx-5">
    <v-img
        class="logo-style set-cursor-pointer"
        src="/assets/img/logo-white.svg"
        :min-height=20
        :min-width=20
        :max-height=50
        :max-width="50"
        @click="redirectToDashboard"
        contain
    />

    <div class="custom-select">
        <span class="white--text set-cursor-pointer" v-for="item in items" :key="item.value" @click="switchLocale(item.value)">
          {{ $i18n.locale === item.value ? item.selected : item.text }}
          <span class="black--text" v-if="item !== items[items.length - 1]">/</span>
        </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {getLocales} from "@/data/enum/locales.enum";

export default Vue.extend({
  name: "left-nav-bar",
  data() {
    return {
      items: getLocales(),
      actual: null
    };
  },
  created() {
    if (localStorage.locale) {
      this.$i18n.locale = localStorage.locale;
    }
    this.actual = this.$i18n.locale;
  },
  methods: {
    redirectToDashboard() {
      this.$router.push("/dashboard");
    },
    switchLocale(locale: string) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        localStorage.locale = locale;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.left-nav-bar {
  height: 100%;
  position: relative;
  margin-left: 10px;
}

.custom-select {
  position: absolute;
  bottom: 0;
}
</style>