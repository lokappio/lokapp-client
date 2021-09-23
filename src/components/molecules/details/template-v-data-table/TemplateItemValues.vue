<template>
    <v-edit-dialog
        :return-value="item[header.value]"
        @save="saveValue(item.keyId, item.quantity, header.value, item[header.value])">
            <div :class="{'py-2 empty-value': !item[header.value] || item[header.value].length === 0}">
                <p class="ma-0 pa-0 span-with-overflow">{{ item[header.value] }}</p>
            </div>
            <template v-if="$store.getters.actualRole.canWriteValue" v-slot:input>
                <v-text-field
                    v-model="item[header.value]"
                    single-line>
                </v-text-field>
            </template>
    </v-edit-dialog>
</template>

<script>
import EventEnum from "@/data/enum/event-bus.enum";
import SpecificValue from "@/data/models/api/SpecificValue";

export default ('template-item-values', {
    props: ['header', 'item', 'projectId', 'refreshEverything', 'items', 'getActualLineIndex'],
    methods: {
        changeValueFromTable(keyId, quantity, value, languageId) {
            const indexToChange = this.getActualLineIndex(keyId, quantity);
            this.items[indexToChange][value.languageId.toString()] = value.valueName;
            this.$set(this.items[indexToChange], languageId.toString(), value.valueName);
        },
        reportError(error) {
            this.$notify(error);
            this.$eventBus.$emit(EventEnum.ERROR_ACTION);
        },
        deleteValue(value) {
            this.$service.values.deleteValue(this.projectId, value)
            .catch(() => {
                this.reportError(this.$t("errors.unknown_error"));
            });
        },
        createValue(keyId, newValue, languageId, quantity) {
            this.$service.values.createValue(this.projectId, keyId, {valueName: newValue, languageId: languageId, quantity: quantity})
            .then((response) => {
                const value = SpecificValue.map(response.data);
                this.changeValueFromTable(keyId, quantity, value, languageId);
            }).catch(() => {
                this.reportError(this.$t("errors.unknown_error"));
            });
        },
        updateValue(newValueObject) {
            this.$service.values.updateValue(this.projectId, newValueObject)
            .then((response) => {
                const value = SpecificValue.map(response.data);
                this.changeValueFromTable(value.keyId, value.quantity, value, value.languageId);
            }).catch(() => {
                this.reportError(this.$t("errors.unknown_error"));
            });
        },
        saveValue(keyId, quantity, languageId, newValue) {
            if (newValue === "") {
                //Value need to be deleted
                this.$service.values.getSpecificValue(this.projectId, { keyId: keyId, languageId: languageId })
                .then((values) => {
                    if (values.length <= 0) {
                        return;
                    }
                    //Find the value with good quantity
                    const indexValueToDelete = values.findIndex((element) => element.quantity === quantity);
                    if (indexValueToDelete === -1) {
                        this.reportError(this.$t("errors.unknown_error"));
                        return;
                    }
                    this.deleteValue({keyId: keyId, valueId: values[indexValueToDelete].valueId});
                }).catch(() => {
                    this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
                });
            } else if (newValue != null) {
                //Check if value exists on backend
                this.$service.values.getSpecificValue(this.projectId, { keyId: keyId, languageId: languageId })
                .then((values) => {
                    const indexValueToUpdate = values.findIndex((element) => element.quantity === quantity);
                    
                    if (indexValueToUpdate === -1) {
                        this.createValue(keyId, newValue, languageId, quantity);
                    } else {
                        values[indexValueToUpdate].valueName = newValue;
                        this.updateValue(values[indexValueToUpdate]);
                    }
                }).catch(() => {
                    this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
                });
            }
        },
    }
});
</script>

<style lang="scss" scoped>
    .span-with-overflow {
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        white-space: nowrap;
        max-width: 360px;
        width: 100%;
    }
    .empty-value {
        width: 300px;
        background-color: #F6F6F6;
    }
</style>