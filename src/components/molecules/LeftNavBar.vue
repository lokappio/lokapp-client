<template>
    <div class="left-nav-bar mt-10">
        <v-img
            class="logo-style set-cursor-pointer"
            src="/assets/img/logo-white.svg"
            :min-height=20
            :min-width=20
            :max-height=50
            @click="redirectToDashboard"
            contain>
        </v-img>

        <locale-switcher class="locale-switcher"/>
    </div>
</template>

<script>
import LocaleSwitcher from "@/components/molecules/LocaleSwitcher.vue";
import Vue from "vue";

export default Vue.extend({
    name: 'left-nav-bar',
    components: {LocaleSwitcher},
    methods: {
        redirectToDashboard() {
            this.$router.push("/dashboard");
        }
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .left-nav-bar {
        width: 8vw;
        height: 94vh;
        float: left;
        position: relative;
    }
    .set-cursor-pointer {
        cursor: pointer;
    }
    .locale-switcher {
        position: absolute;
        bottom: 0;
    }
</style>