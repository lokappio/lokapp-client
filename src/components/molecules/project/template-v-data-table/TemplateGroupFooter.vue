<template>
    <div v-if="isOpen" class="background-color-transparent my-3">
        <v-icon color="primary" class="mx-4" size="32" @click="isOpenCreation = true" :ripple="false">mdi-plus-circle</v-icon>
        <key-creation :selected-group="currGroup" :isOpen="isOpenCreation" v-on:closeCreation="close"></key-creation>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import KeyCreation from "@/components/molecules/cards/overlay/KeyCreation.vue";
import {TranslationItem} from "@/data/models/types/TranslationTypes";
import Group from "@/data/models/api/Group";

export default Vue.extend({
    name: 'template-group-footer',
    components: {KeyCreation},
    props: {
      isOpen: Boolean,
      groupId: Number,
      items: []
    },
    data() {
        return {
          isOpenCreation: false,
        }
    },
    computed: {
      currGroup(): Group {
        return (this.items as TranslationItem[])[0].group;
      }
    },
    methods: {
        close() {
          this.isOpenCreation = false;
        }
    }
});
</script>