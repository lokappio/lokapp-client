<template>
  <v-overlay v-if="isOpen">
    <v-card color="white" class="pa-4 pa-md-7 card-style-key-creation">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="px-0">
                    <p class="title-h2">{{ $t("key_creation.title") }}</p>
                </v-col>

                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeKeyCreation()" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <v-form ref="formCreateKey">
                <!-- Key name -->
                <v-row class="mt-2 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('key_creation.key_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="keyNameRules" class="custom-text-field" background-color="#F2F3F7" v-model="newKey.name" :label="$t('key_creation.key_name_label')" solo flat required></v-text-field>
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
                                    {{ currentGroup.name }}
                                    <v-icon color="white">mdi-menu-down</v-icon>
                                </v-btn>
                            </template>
                            <v-list class="set-scrollbar">
                                <v-list-item v-for="group in groups" :key="group.id">
                                    <v-list-item-title class="set-cursor-pointer" @click="currentGroup = group"><span>{{ group.name }}</span></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row class="mt-4" v-if="currentGroup.id === -1">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="groupNameRules" class="custom-text-field" background-color="#F2F3F7" v-model="groupName" :label="$t('key_creation.group_name_label')" solo flat required autofocus></v-text-field>
                    </v-col>
                </v-row>

                <!-- Is a plural key -->
                <v-row class="mt-0 pb-0 mb-0">
                    <v-col cols="12" class="py-0 px-0">
                        <v-checkbox class="custom-checkbox" hide-details="true" v-model="newKey.isPlural" :label="$t('key_creation.is_plural')"></v-checkbox>
                    </v-col>
                </v-row>

                <!-- ValidateButton -->
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="createKeyWithGroup" :text="$t('key_creation.validate_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
  </v-overlay>
</template>

<script lang="ts">
import {keyNameRules} from "@/data/rules/KeyRules";
import {groupNameRules} from "@/data/rules/GroupRules";
import Vue from "vue";
import Key from "@/data/models/api/Key";
import Project from "@/data/models/api/Project";
import Group from "@/data/models/api/Group";

export default Vue.extend({
    name: 'key-creation',
    props: {
      selectedGroup: Group,
      isOpen: Boolean
    },
    created() {
        this.loadData();
    },
    data: function() {
        const emptyGroup = Group.empty(this.$t("key_creation.new_group").toString());

        return {
            //DATA
            groups: [emptyGroup],
            currentGroup: emptyGroup,
            newKey: Key.empty(),
            groupName: "",

            //RULES
            keyNameRules: keyNameRules(this.$t("rules.required").toString(), this.$t("rules.key_name_length").toString(), this.$t("rules.snake_case_only").toString()),
            groupNameRules: groupNameRules(this.$t("rules.required").toString(), this.$t("rules.group_name_length").toString(), this.$t("rules.snake_case_only").toString()),

            //UI
            loading: false,
            isBlockButton: true,
            snackbarError: false,
            errorText: "",
        }
    },
    computed: {
      currentProject(): Project {
        return this.$store.state.currentProject;
      },
    },
    watch: {
      'newKey.name': function() {
        this.newKey.name = this.newKey.name.replaceAll(" ", "_");
      }
    },
    methods: {
        loadData(): void {
            this.currentProject.groups.forEach((group) => this.groups.push(group));
            this.currentGroup = this.selectedGroup ?? this.groups[0];
        },
        closeKeyCreation() {
          this.$emit('closeCreation', false)
        },
        async createKeyWithGroup(): Promise<void> {
            if (this.$refs.formCreateKey.validate() === true) {
                this.loading = true;

                if(this.currentGroup.id === -1) this.currentGroup.name = this.groupName;

                let data: {group: Group | null; key: Key};
                try {
                  data = await this.$service.keys.createKeyWithGroup(this.currentGroup.id === -1, this.currentGroup, this.newKey);
                  this.$store.commit("ADD_PROJECT_KEY", data);
                  this.closeKeyCreation();
                } catch(e) {
                  this.$notify(this.$t(e).toString());
                }

                this.loading = false;
            }
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