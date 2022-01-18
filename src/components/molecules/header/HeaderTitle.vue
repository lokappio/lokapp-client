<template>
  <div>
    <p><span class="title-h1">{{ $t("header.greetings") + " " }}</span><span class="title-h1 pseudo-color">{{ name }}</span></p>
    <p v-if="displayDescription" class="text-1">{{ $t("header.greetings_description") }}</p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: 'header-title',
    props: ['displayDescription'],
    computed: {
      name(): string {
        return this.$store.getters.appUser?.username ?? this.$store.getters.appUser?.email ?? ""
      }
    },
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

    .pseudo-color {
        color: #02188C;
    }
</style>