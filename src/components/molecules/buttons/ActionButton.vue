<template>
    <v-btn :loading="loading" dark class="button-action-style" depressed height="55" :block="block" color="primary" @click="handler">
          <div class="title-h3 white--text">{{ text }}</div>
          <v-icon v-if="addIcon" color="white" class="pl-2">mdi-plus-circle</v-icon>
    </v-btn>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    name: 'action-button',
    props: {
        loading: Boolean,
        block: Boolean,
        handler: Function,
        text: String,
        addIcon: Boolean
    }
})
</script>

<style lang="scss" scoped>
    .button-action-style {
        border-radius: 10px;
    }
</style>