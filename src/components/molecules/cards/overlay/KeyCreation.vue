
<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-key-creation">

        <v-container>

            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="px-0">
                    <p class="title-h2">
                    {{ $t("key_creation.title") }}
                    </p>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeKeyCreation" color="black" class="float-right">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>

            <keyboard-events :enter="createNewKey"/>
            <v-form ref="formCreateKey">

                <!-- Key name -->
                <v-row class="mt-2 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('key_creation.key_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="keyNameRules" class="custom-text-field" background-color="#F2F3F7" v-model="keyName" :label="$t('key_creation.key_name_label')" solo flat required></v-text-field>
                    </v-col>
                </v-row>

                <!-- Group -->
                <v-row class="mt-1 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('key_creation.group_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0 pb-0 mb-0">
                    <v-col cols="12" class="py-0 px-0">
                        <v-menu class="py-0 mb-0" bottom close-on-click>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                class="ml-0" 
                                color="maincolor"
                                dark
                                v-bind="attrs"
                                v-on="on">
                                    {{ getActualGroupName() }}
                                    <v-icon color="white">
                                        mdi-menu-down
                                    </v-icon>
                                </v-btn>
                            </template>
                            <v-list class="set-scrollbar">
                                <v-list-item v-for="group in groups" :key="group.id">
                                    <v-list-item-title class="set-cursor-pointer" @click="activeGroupId = group.id"><span>{{ group.name }}</span></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row class="mt-4" v-if="activeGroupId === -1">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="groupNameRules" class="custom-text-field" background-color="#F2F3F7" v-model="groupName" :label="$t('key_creation.group_name_label')" solo flat required autofocus></v-text-field>
                    </v-col>
                </v-row>

                <!-- Is a plural key -->
                <v-row class="mt-0 pb-0 mb-0">
                    <v-col cols="12" class="py-0 px-0">
                        <v-checkbox class="custom-checkbox" hide-details="true" v-model="isPlural" :label="$t('key_creation.is_plural')"></v-checkbox>
                    </v-col>
                </v-row>

                <!-- Language Traduction -->
                <v-row v-if="languages.length > 0" class="mt-0 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <p class="title-h2">{{ $t('key_creation.traductions_title') }}</p>
                    </v-col>
                </v-row>
                <v-container v-if="languages.length > 0" class="pt-4 mt-0 ml-1 overflow-container-languages">
                    <v-row class="pb-2" v-for="language in languages" :key="language.id">
                        <v-col cols="12" class="pa-0">
                            <v-text-field class="black-caret" background-color="#F2F3F7" v-model="language.tradValue" :label="language.name" filled flat hide-details="true"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>

                <!-- ValidateButton -->
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="createNewKey" :text="$t('key_creation.validate_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
  
</template>

<script>
import ActionButton from "@/components/molecules/buttons/ActionButton";
import Key from "@/data/models/api/Key";
import {keyNameRules} from "@/data/rules/KeyRules";
import Group from "@/data/models/api/Group";
import { PLURAL_DEFAULT } from "@/data/models/PluralTemplate";
import { groupNameRules } from "@/data/rules/GroupRules";
import CardEnum from "@/data/models/Card.enum";
import EventEnum from "@/data/enum/event-bus.enum";
import KeyboardEvents from "../../KeyboardEvents.vue";

export default (
    'key-creation', {
    components: {
        ActionButton,
        KeyboardEvents
    },
    created() {
        this.projectId = this.$store.getters.actualProjectId;
        this.groupId = this.$store.getters.actualGroupId;
        this.refreshKeyCreation();
    },
    data: function() {
        return {
            loading: false,
            groupName: "",
            keyName: "",
            keyNameRules: keyNameRules(this.$t("rules.required"), this.$t("rules.key_name_length"), this.$t("rules.snake_case_only")),
            groupNameRules: groupNameRules(this.$t("rules.required"), this.$t("rules.group_name_length"), this.$t("rules.snake_case_only")),
            isBlockButton: true,
            languages: [],
            activeGroupId: -1,
            snackbarError: false,
            errorText: "",
            isPlural: false,
            projectId: -1,
            groupId: -1
        }
    },
    methods: {
        refreshKeysList() {
            this.$eventBus.$emit(EventEnum.REFRESH_KEYS_LIST);
        },
        closeKeyCreation() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        },
        errorGetSomething() {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
        },
        errorAction() {
            this.$eventBus.$emit(EventEnum.ERROR_ACTION);
        },
        refreshKeyCreation() {
            this.loading = true;
            this.languages = [];
            this.groups = [
                {
                    id: -1,
                    name: this.$t("key_creation.new_group")
                },
            ];
            this.$service.languages.getLanguages(this.projectId)
            .then((languages) => {
                for (const language of Object.values(languages)) {
                    this.languages.push({
                        name: language.name,
                        id: language.id.toString(),
                        tradValue: ""
                    });
                }
            }).catch(() => {
                this.errorGetSomething();
            }).finally(() => {
                this.loading = false;
            });

            this.$service.groups.getGroups(this.projectId)
            .then((groups) => {
                for (const group of Object.values(groups)) {
                    this.groups.push({
                        id: group.id,
                        name: group.name
                    });
                }
                if (this.groupId >= 0) {
                    this.activeGroupId = this.groupId;
                } else {
                    this.activeGroupId = this.groups[this.groups.length - 1].id;
                }
            }).catch(() => {
                this.errorGetSomething();
            }).finally(() => {
                this.loading = false;
            });
        },
        createNewKey() {
            if (this.$refs.formCreateKey.validate() === true) {
                this.loading = true;
                let groupId = null;
                if (this.activeGroupId === -1) {
                    this.$service.groups.createGroup(this.projectId, this.groupName)
                    .then((response) => {
                        const newGroup = Group.map(response.data);
                        groupId = newGroup.id;
                        this.createKey(groupId);
                    }).catch((error) => {
                        if (error.response) {
                            switch (error.response.status) {
                                case 422:
                                    this.$notify(this.$t("errors.group_already_exists"));
                                    break;
                                case 403:
                                    this.$notify(this.$t("errors.unauthorized"));
                                    this.errorAction();
                                    break;
                                case 404:
                                    this.$notify(this.$t("errors.group_create_failed"));
                                    this.errorAction();
                                    break;
                                default:
                                    this.$notify(this.$t("errors.unknown_error"));
                                    break;
                            }
                            this.refreshKeyCreation();
                        }
                    });
                } else {
                    groupId = this.activeGroupId;
                    this.createKey(groupId);
                }
            }
        },
        setError(error) {
            this.errorText = error;
            this.snackbarError = true;
        },
        createKey(groupId) {
            this.$service.keys.createKey(this.projectId, this.keyName, groupId, this.isPlural)
            .then((response) => {
                const newKey = Key.map(response.data);
                this.loading = false;
                for (const language of Object.values(this.languages)) {
                    if (language.tradValue === null || language.tradValue === "") {
                        continue;
                    }
                    let quantityString = null;
                    if (this.isPlural === true) {
                        quantityString = PLURAL_DEFAULT;
                    } 
                    this.$service.values.createValue(
                        this.projectId, 
                        newKey.id, {
                            valueName: language.tradValue, 
                            languageId: language.id,
                            quantity: quantityString})
                    .catch(() => {
                        this.errorAction();
                    });
                }
            }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            this.$notify(this.$t("errors.key_name_already_exists"));
                            this.refreshKeysList();
                            break;
                        case 403:
                            this.$notify(this.$t("errors.unauthorized"));
                            this.errorAction();
                            break;
                        default:
                            this.$notify(this.$t("errors.unknown_error"));
                            this.errorAction();
                            break;
                    }
                    this.refreshKeyCreation();
                }
            }).finally(() => {
                this.closeKeyCreation();
                this.refreshKeysList();
                this.loading = false;
            });
        },
        getActualGroupName() {
            const element = this.groups.find((element) => element.id === this.activeGroupId);
            if (element != undefined)
                return element.name;
        },
        checkKeyName() {
            this.keyName = this.keyName.replaceAll(" ", "_");
        }
    },
    watch: {
        keyName: function() {
            this.checkKeyName();
        }
    }
})

</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .card-style-key-creation {
        border-radius: 20px !important;
        width: 400px;
    }
    .overflow-container-languages {
        max-height: 250px;
        overflow-y: scroll;
    }
    .custom-checkbox::v-deep .v-icon {
        color: black !important;
    }
    .custom-checkbox::v-deep .v-label {
        color: black !important;
    }
    .set-cursor-pointer {
        cursor: pointer;
    }
    //Display the scrollbar permanently on mac
    ::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .5);
        box-shadow: 0 0 1px rgba(255, 255, 255, .5);
    }
    .set-scrollbar {
        max-height: 400px;
        overflow-y: auto;
    }
    .black-caret {
        caret-color: black !important;
    }
</style>