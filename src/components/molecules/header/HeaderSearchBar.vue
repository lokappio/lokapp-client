
<template>
    <v-container>
        <v-row v-if="noRing === undefined">
            <v-col cols="2" class="pa-0 pr-2">
                <invitations-button/>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="10" class="pa-0">
                <v-text-field solo v-model="searchValue" :label="$t('common.search_label')">
                    <template v-slot:append>
                        <v-btn class="mr-0 small-button-style icon-color" color="white" icon>
                            <v-icon class="icon-color">
                                mdi-magnify
                            </v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="pa-0">
                <v-text-field solo v-model="searchValue" :label="$t('common.search_label')">
                    <template v-slot:append>
                        <v-btn class="mr-0 small-button-style icon-color" color="white" icon>
                            <v-icon class="icon-color">
                                mdi-magnify
                            </v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import EventEnum from "@/data/enum/event-bus.enum";
import InvitationsButton from "@/components/molecules/buttons/InvitationsButton.vue";

export default (
    'header-search-bar', {
    components: {
        InvitationsButton
    },
    data: function() {
        return {
            searchValue: ""
        }
    },
    props: ['noRing'],
    methods: {
        changeValue() {
            this.$eventBus.$emit(EventEnum.FILTER_PROJECTS_LIST, this.searchValue);
            this.$eventBus.$emit(EventEnum.FILTER_KEYS, this.searchValue);
        }
    },
    watch: {
        searchValue: function() {
            this.changeValue();
        }
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .toolbar-style {
        border-radius: 10px !important;
        width: 100%;
    }
    .small-button-style {
        height: 40px !important;
        width: 40px !important;
        border-radius: 7px;
    }
    .icon-color {
        background-color: #02188C;
        color: white;
    }
    .rounded-button-style {
        height: 50px !important;
        width: 50px !important;
        border-radius: 50%;
    }
</style>