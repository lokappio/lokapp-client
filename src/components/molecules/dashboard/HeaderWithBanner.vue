
<template>
    <v-container v-if="projectDetail === undefined" class="pa-0 full-contain full-width-container">
        <v-row class="ma-0 row-header">
            
            <!-- HeaderTitle -->
            <v-col cols="12" md="6" class="title-height">
                <v-btn class="mr-5 ml-2 rounded-button-style icon-color" @click="$store.commit('SET_OPEN_CARD', CardEnum.MANAGE_PROFILE)" color="white" icon>
                    <v-icon large class="icon-color">mdi-account</v-icon>
                </v-btn>
                <header-title displayDescription="true"/>
            </v-col>
            
            <!-- HeaderSearchbar -->
            <v-col cols="12" md="6" class="pt-1 pr-0 search-bar-height">
                <v-text-field solo v-model="searchValue" :label="$t('common.search_label')"></v-text-field>
            </v-col>
        
            <!-- HeaderBanner -->
            <v-col v-if="$vuetify.breakpoint.mdAndUp" md="12" lg="10" class="pa-0 banner-height">
                <HeaderBanner/>
            </v-col>

        </v-row>
    </v-container>

    <v-container v-else class="pa-0 full-contain full-width-container">
        <v-row class="ma-0 row-header">
            
            <!-- HeaderTitle -->
            <v-col cols="11" class="title-height">
                <v-btn class="mr-5 ml-2 rounded-button-style icon-color" @click="$store.commit('SET_OPEN_CARD', CardEnum.MANAGE_PROFILE)" color="white" icon>
                    <v-icon large class="icon-color">
                        mdi-account
                    </v-icon>
                </v-btn>
                <header-title/>
            </v-col>
            <v-col cols="1" class="justify-end title-height">
                <invitations-button/>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>
import HeaderTitle from "@/components/molecules/header/HeaderTitle";
import HeaderBanner from "@/components/molecules/header/HeaderBanner";
import InvitationsButton from "@/components/molecules/buttons/InvitationsButton.vue";
import Vue from "vue";
import CardEnum from "@/data/models/Card.enum";

export default Vue.extend({
    name: 'header-banner',
    components: {
        HeaderTitle,
        HeaderBanner,
        InvitationsButton
    },
    props: ['projectDetail'],
    data() {
        return {
            CardEnum,
            searchValue: ""
        }
    },
    destroyed() {
        this.$store.commit("SET_SEARCH_PROJECT", "");
    },
    watch: {
        searchValue(value) {
            this.$store.commit("SET_SEARCH_PROJECT", value);
        }
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .full-width-container {
        max-width: 100%;
    }
    .row-header {
        height: 100%;
    }
    .title-height {
        height: 50%;
    }
    .search-bar-height {
        height: 50%;
    }
    .banner-height {
        height: 50%;
    }
    .icon-color {
        background-color: #02188C;
        color: white;
    }
    .rounded-button-style {
        height: 50px !important;
        width: 50px !important;
        border-radius: 50%;
        float: left;
    }
@media #{map-get($display-breakpoints, 'sm-and-down')} {
    .title-height {
        height: 60%;
    }
    .search-bar-height {
        height: 40%;
    } 
}
</style>