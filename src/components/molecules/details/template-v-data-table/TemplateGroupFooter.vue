<template>
    <tr v-if="isOpen" class="background-color-transparent">
        <v-icon color="maincolor" class="mx-4 icon-style-big" @click="isOpenCreation = true" :ripple="false">mdi-plus-circle</v-icon>

        <key-creation :selected-group="group" :isOpen="isOpenCreation" v-on:closeCreation="close"></key-creation>
    </tr>
</template>

<script lang="ts">
import Vue from "vue";
import KeyCreation from "@/components/molecules/cards/overlay/KeyCreation.vue";

export default Vue.extend({
    name: 'template-group-footer',
    components: {KeyCreation},
    props: {
      isOpen: Boolean,
      group: {},
    },
    data() {
        return {
          isOpenCreation: false,
        }
    },
    methods: {
        close() {
          this.isOpenCreation = false;
        }
    }
});
</script>