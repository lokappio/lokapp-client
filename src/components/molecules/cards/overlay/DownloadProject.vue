<template>
    <v-card color="white" class="pa-4 pa-md-7 custom-cards" width="100%">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <span class="title-h2">{{ $t("download_project.title") }}</span>
                </v-col>

                <v-col cols="1" class="pr-0">
                    <v-icon @click="() => closeDialog()" color="black">mdi-close</v-icon>
                </v-col>
            </v-row>

            <v-row class="mt-4 pb-0 mb-0">
                <v-col cols="12" class="pb-0 px-0">
                    <span class="title-h3">{{ $t("download_project.platform_target") }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" class="py-0 px-0 m-0">
                    <v-select
                        solo
                        background-color="primary"
                        dark
                        :items="platforms"
                        item-text="name"
                        v-model="selectedPlatform"
                    ></v-select>
                </v-col>
            </v-row>

            <template v-if="isGenerated">
                <v-row v-if="shouldShowPrefixCheckbox">
                    <v-col cols="12" class="px-0 py-0 my-0">
                        <v-checkbox
                            class="custom-checkbox"
                            hide-details="true"
                            v-model="prefixKeysWithGroupName">
                            <template v-slot:label>
                                <div>
                                    <p class="my-0" style="font-size: 0.85em; padding-top: 0.15em">
                                        {{ $t('download_project.prefix_keys_radio') }}</p>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" class="px-0 pt-0">
                        <v-checkbox
                            class="custom-checkbox"
                            hide-details="true"
                            v-model="downloadOnlyValidatedValues">
                            <template v-slot:label>
                                <div>
                                    <p class="my-0" style="font-size: 0.85em; padding-top: 0.15em">
                                        {{ $t('download_project.download_only_validated') }}</p>
                                </div>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>

                <v-row v-if="files.length === 0" class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <p class="title-h3">{{ $t("download_project.no_file_to_download") }}</p>
                    </v-col>
                </v-row>

                <v-row v-else v-for="file in files" justify="space-between" align="center" :key="file.name"
                       class="mt-1 pt-0">
                    <v-col cols="auto" class="py-0 px-0">
                        <span class="text-2">{{ file.name }} ({{ validatedValuesCount.get(file.language) }})</span>
                    </v-col>

                    <v-col cols="auto">
                        <v-icon @click="() => copyFile(file)" color="primary">mdi-content-copy</v-icon>
                        <v-icon @click="() => downloadFile(file)" color="primary">mdi-download</v-icon>
                    </v-col>
                </v-row>

                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :handler="downloadEverything"
                                       :text="$t('download_project.download_everything')"/>
                    </v-col>
                </v-row>
            </template>
        </v-container>
    </v-card>

</template>

<script lang="ts">
import Vue from "vue";
import {FileData, TranslationFile} from "@/data/models/types/export";
import {Platform} from "@/data/models/enums/project";
import Export from "@/data/helpers/export";
import store from "@/store";
import {TranslationStatus} from "@/data/models/api/Value";

export default Vue.extend({
    name: "download-project-card",
    props: {
        dialogOpened: Boolean
    },
    data() {
        return {
            isGenerated: false,
            selectedPlatform: Platform.ANDROID as Platform,
            prefixKeysWithGroupName: true,
            downloadOnlyValidatedValues: true,
            files: [] as TranslationFile[]
        };
    },
    watch: {
        selectedPlatform: {
            immediate: true,
            handler: function () {
                this.generateFiles();
            }
        },
        prefixKeysWithGroupName: {
            immediate: true,
            handler: function () {
                this.generateFiles();
            }
        },
        downloadOnlyValidatedValues: {
            immediate: true,
            handler: function () {
                this.generateFiles();
            }
        },
        dialogOpened(isOpened) {
            if (isOpened) {
                //ON RE-OPENED, RESET DATA
                this.files = [];
                this.isGenerated = false;
                this.selectedPlatform = Platform.ANDROID;

                this.generateFiles();
            }
        }
    },
    computed: {
        Platform() {
            return Platform
        },
        platforms(): { id: number; name: string }[] {
            return Object.values(Platform).map((platform, index) => {
                return {id: index, name: platform};
            });
        },
        shouldShowPrefixCheckbox(): boolean {
            return (this.selectedPlatform == Platform.IOS as Platform || this.selectedPlatform == Platform.ANDROID as Platform) === true;
        },
        validatedValuesCount(): Map<string, string> {
            const valueStatuses: Map<string, Map<TranslationStatus, number>> = store.getters.currentProject.valueStatuses()
            const valuesCount: number = store.getters.currentProject.valuesCount()
            const invalidatedValuesCount = new Map<string, string>()
            valueStatuses.forEach((statuses, language) => {
                const invalidatedValues = `${this.$t('translation_status.' + TranslationStatus.VALIDATED)} ${statuses.get(TranslationStatus.VALIDATED) ?? 0}/${valuesCount ?? 0}`
                invalidatedValuesCount.set(language, invalidatedValues)
            });
            return invalidatedValuesCount;
        }
    },
    methods: {
        generateFiles(): void {
            const filesData: FileData[] = this.$service.export.exportDatas(this.selectedPlatform, this.prefixKeysWithGroupName, this.downloadOnlyValidatedValues);
            this.isGenerated = true;

            switch (this.selectedPlatform) {
                case Platform.ANDROID:
                    this.files = filesData.map((file) => {
                        return {
                            name: `strings_${file.language}.xml`,
                            language: file.language,
                            content: file.content
                        };
                    });
                    break;
                case Platform.IOS:
                    this.files = filesData.map((file) => {
                        return {
                            name: file.plural ? `localizable_${file.language}.stringsdict` : `localizable_${file.language}.strings`,
                            language: file.language,
                            content: file.content
                        };
                    });
                    break;
                case Platform.WEB:
                    this.files = filesData.map((file) => {
                        return {
                            name: `${file.language}.json`,
                            language: file.language,
                            content: file.content
                        };
                    });
                    break;
                default:
                    break;
            }
        },
        copyFile(file: TranslationFile) {
            navigator.clipboard.writeText(file.content);
            this.$notify(this.$t("success.copy").toString(), {color: "primary"});
        },
        downloadFile(file: TranslationFile): void {
            Export.downloadFile(file.content, file.name);
        },
        downloadEverything() {
            Export.downloadEverything(this.files, this.selectedPlatform);
        },
        closeDialog() {
            this.$emit("close", false);
        }
    }
});
</script>