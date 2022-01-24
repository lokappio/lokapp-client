<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project" width="100%">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <span class="title-h2">{{ $t("download_project.title") }}</span>
                </v-col>

                <v-col cols="1" class="pr-0">
                    <v-icon @click="() => closeDialog()" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <v-row class="mt-4 pb-0 mb-0">
                <v-col cols="12" class="pb-0 px-0">
                    <span class="title-h3">{{ $t("download_project.platform_target") }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" class="pb-0 pt-0 px-0">
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
                <v-row v-if="files.length === 0" class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <p class="title-h3">{{ $t("download_project.no_file_to_download") }}</p>
                    </v-col>
                </v-row>

                <v-row v-else v-for="file in files" justify="space-between" align="center" :key="file.name" class="mt-1 pt-0 file-list-style">
                    <v-col cols="auto" class="py-0 px-0">
                        <span class="text-2">{{ file.name }}</span>
                    </v-col>

                    <v-col cols="auto">
                        <v-icon @click="() => copyFile(file)" color="maincolor">mdi-content-copy</v-icon>
                        <v-icon @click="() => downloadFile(file)" color="maincolor">mdi-download</v-icon>
                    </v-col>
                </v-row>


                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :handler="downloadEverything" :text="$t('download_project.download_everything')"/>
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

export default Vue.extend({
    name: "download-project-card",
    props: {
        dialogOpened: Boolean
    },
    data() {
        return {
            isGenerated: false,
            selectedPlatform: Platform.ANDROID,
            files: [] as TranslationFile[]
        };
    },
    watch: {
        selectedPlatform: {
            immediate: true,
            handler: function() {this.generateFiles();}
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
        platforms(): { id: number; name: string }[] {
            return Object.values(Platform).map((platform, index) => {
                return {id: index, name: platform};
            });
        }
    },
    methods: {
        generateFiles(): void {
            const filesData: FileData[] = this.$service.export.exportDatas(this.selectedPlatform);
            this.isGenerated = true;

            switch (this.selectedPlatform) {
                case Platform.ANDROID:
                    this.files = filesData.map((file) => {
                        return {
                            name: `strings_${file.language}.xml`,
                            content: file.content
                        };
                    });
                    break;
                case Platform.IOS:
                    this.files = filesData.map((file) => {
                        return {
                            name: file.plural ? `Localizable_${file.language}.stringsdict` : `Localizable_${file.language}.strings`,
                            content: file.content
                        };
                    });
                    break;
                case Platform.WEB:
                    this.files = filesData.map((file) => {
                        return {
                            name: `${file.language}.json`,
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
            this.$notify(this.$t("success.copy").toString());
        },
        downloadFile(file: TranslationFile): void {
            Export.downloadFile(file.content, file.name);
        },
        downloadEverything() {
            Export.downloadEverything(this.files);
        },
        closeDialog() {
            this.$emit("close", false);
        }
    }
});
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.card-project-style.v-sheet.v-card {
    border-radius: 20px;
}

.card-style-project {
    border-radius: 20px !important;
    width: 400px;
}

.file-list-style {
    max-height: 300px;
    overflow-y: auto;
}
</style>