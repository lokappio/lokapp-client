<template>
    <v-container fluid class="full-screen-container px-0 py-3">
    <keyboard-events :escape="closePopup"></keyboard-events>
        <v-overlay absolute :value="$store.getters.openCard !== CardEnum.NONE" class="my-overlay">
            <profile-manager v-if="$store.getters.openCard === CardEnum.MANAGE_PROFILE"/>
            <language-delete v-if="$store.getters.openCard === CardEnum.DELETE_LANGUAGE"/>
        </v-overlay>

        <left-nav-bar/>

        <v-card class="card-style-content background-color-white px-6 pt-16 mr-0 ml-auto">
            <v-container class="ma-0 pa-0 full-contain card-container">
                <!-- Header with banner-->
                <v-row class="ma-0 mb-4 row-header-style">
                    <header-banner/>
                </v-row>

                <!-- Content -->
                <v-row class="ma-0 row-content-style">
                    <my-projects/>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { Vue } from "vue-property-decorator";
import MyProjects from "@/components/molecules/dashboard/MyProjects.vue";
import HeaderBanner from "@/components/molecules/dashboard/HeaderWithBanner.vue";
import LeftNavBar from "@/components/molecules/LeftNavBar.vue";
import CardEnum from "@/data/models/Card.enum";
import ProfileManager from "@/components/molecules/cards/overlay/ProfileManager.vue";
import LanguageDelete from "@/components/molecules/cards/overlay/LanguageDelete.vue";
import EventEnum from "@/data/enum/event-bus.enum";
import KeyboardEvents from "@/components/molecules/KeyboardEvents.vue";

export default Vue.extend ({
    data() {
        return {
            CardEnum
        }
    },
    components: {
        MyProjects,
        HeaderBanner,
        LeftNavBar,
        ProfileManager,
        LanguageDelete,
        KeyboardEvents
    },
    metaInfo() {
        return {
            title: "Lokapp",
            titleTemplate: null
        }
    },
    methods: {
        errorGetSomething() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
            this.$notify(this.$t("errors.unknown_error"), {timeout: -1, dismissable: true});
        },
        closePopup() {
            if (this.$store.getters.openCard !== CardEnum.NONE) {
                this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
            }
        }
    },
    mounted() {
        this.$eventBus.$on(EventEnum.ERROR_GET_SOMETHING, this.errorGetSomething);
    },
    beforeDestroy() {
        this.$eventBus.$off(EventEnum.ERROR_GET_SOMETHING, this.errorGetSomething);
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .full-screen-container {
        background-color: #02188C;
        width: 100vw;
        height: 100vh;
    }
    .card-style-content {
        width: 92vw;
        height: 100%;
        border-top-left-radius: 15px !important;
        border-bottom-left-radius: 15px !important;
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }
    .card-container {
        border-bottom-left-radius: 0px !important;
        max-width: 100%;
    }
    .row-header-style {
        height: 35%;
        width: 100%;
    }
    .row-banniere-style {
        height: 40%;
        width: 100%;
    }
    .row-content-style {
        background-color: #FAF8F9;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        height: calc(65% - 4 * 4px);
        width: 100%;
    }
</style>