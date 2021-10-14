<template>
    <v-edit-dialog
        :return-value.sync="item.keys"
        @save="saveKey(item.keyId, item.keys)"
        @close="item.hasPluralChanged = false">
        <p v-if="item.quantity === null" class="pa-0 ma-0 span-keys-with-overflow">    {{ item.keys }} </p>
        <p v-else class="pa-0 ma-0 span-keys-with-overflow"> {{ customKeyName(item) }}</p>
        <template v-slot:input>
            <v-text-field
                v-model="item.keys"
                single-line
                :rules="keyNameRules">

                <template v-slot:append-outer>
                    <v-container>
                        <v-row>

                            <v-col cols="12" class="pa-0">
                                <!-- Button plural -->
                                <v-btn color="maincolor" @click="item.hasPluralChanged = !item.hasPluralChanged" class="mb-2 white--text">
                                    {{ (item.isPlural + item.hasPluralChanged)%2 === 1 ? $t("project_detail.plural_key") : $t("project_detail.simple_key") }}
                                </v-btn>

                                <!-- ButtonValid -->
                                <v-btn v-show="item.hasPluralChanged === true" @click="updatePluralKey(item)" color="maincolor" class="mb-2 ml-1">
                                    <v-icon color="white">
                                        mdi-check
                                    </v-icon>
                                </v-btn>
                            </v-col>

                            <v-col cols="12" class="pa-0">
                                <!-- ButtonDelete -->
                                <v-btn color="maincolor" @click="deleteKey(item.keyId)" class="mb-2 white--text">
                                    {{ $t("project_detail.delete_key_button") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>

            </v-text-field>
        </template>
    </v-edit-dialog>
</template>

<script>
import EventEnum from "@/data/enum/event-bus.enum";
import { keyNameRules } from "@/data/rules/KeyRules";
import Vue from "vue";

export default Vue.extend({
    name: 'template-item-keys',
    props: [
        'item',
        'projectId',
        'items',
        'resetKeys',
        'refreshEverything'
    ],
    data() {
        return {
            keyNameRules: keyNameRules(this.$t("rules.required"), this.$t("rules.key_name_length"), this.$t("rules.snake_case_only"))
        }
    },
    methods: {
        customKeyName(item) {
            return (item.keys + " [" + item.quantity + "]");
        },
        saveKey(keyId, newName) {
            this.$service.keys.updateKey(this.projectId, keyId, newName)
            .then((response) => {
                this.items.forEach((item) => {
                    if (item.keyId === keyId) {
                        item.keys = response.data.name;
                    }
                });
            }).catch((error) => {
                this.hasPluralChanged = false;
                if (!error.response) {
                    return;
                }
                switch (error.response.status) {
                    case 422:
                        this.notify(this.$t("errors.key_name_already_exists"));
                        break;
                    case 403:
                        this.$notify(this.$t("errors.unauthorized"));
                        break;
                    case 404:
                        this.notify(this.$t("errors.not_existing_key"));
                        break;
                    default:
                        this.notify(this.$t("errors.unknown_error"));
                        break;
                }
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            });
        },
        updatePluralKey(item) {
            this.$service.keys.updateKeyPlural(this.projectId, item.keyId, !item.isPlural)
            .catch((error) => {
                if (!error.response) {
                    return;
                }
                switch (error.response.status) {
                    case 403:
                        this.$notify(this.$t("errors.unauthorized"));
                        break;
                    case 404:
                        this.notify(this.$t("errors.not_existing_key"));
                        break;
                    default:
                        this.notify(this.$t("errors.unknown_error"));
                        break;
                }
            }).finally(() => {
                this.hasPluralChanged = false;
                this.resetKeys();
                this.refreshEverything();
            });
        },
        deleteKey(keyId) {
            this.$service.keys.deleteKey(this.projectId, keyId)
            .then(() => {
                let actualKey;
                while ((actualKey = this.items.findIndex((element) => element.keyId === keyId)) != -1) {
                    this.items.splice(actualKey, 1);
                }
            }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 404:
                            this.$notify(this.$t("errors.not_existing_key"));
                            break;
                        case 403:
                            this.$notify(this.$t("errors.unauthorized"));
                            break;
                        default:
                            this.$notify(this.$t("errors.unknown_error"));
                            break;
                    }
                }
                this.refreshEverything();
            });
        },
    }
});
</script>

<style lang="scss" scoped>
    .span-keys-with-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        white-space: nowrap;
        max-width: 48vw;
        width: 100%;
    }
</style>