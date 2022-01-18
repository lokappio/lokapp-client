<template>
    <v-btn class="button-action-style" height="55" :block="block" color="maincolor" @click="handler">
        <v-progress-circular v-if="loading" color="white" indeterminate></v-progress-circular>
        <div v-else>
          <div class="title-h3 button-action-text">{{ text }}</div>
          <v-icon v-if="addIcon" color="white" class="pl-2">mdi-plus-circle</v-icon>
        </div>
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
@import '~vuetify/src/styles/styles.sass';
    .button-action-text {
        color: white;
        margin-bottom: 0px;
    }
    .button-action-style {
        border-radius: 10px;
    }
</style>