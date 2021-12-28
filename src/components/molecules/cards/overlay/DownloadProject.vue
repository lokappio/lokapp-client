<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project" width="100%">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <span class="title-h2">{{ $t("download_project.title") }}</span>
                </v-col>

                <v-col cols="1" class="pr-0">
                    <v-icon @click="() => this.$emit('close', false)" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <template v-if="!isDownloadFinished">
                <v-row class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t("download_project.platform_target") }}</span>
                    </v-col>
                </v-row>

                <v-row class="mt-0 mb-4">
                    <v-col cols="12" class="pb-0 pt-0 px-0">
                        <v-menu class="py-0 mb-0" bottom close-on-click>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    class="ml-0"
                                    color="maincolor"
                                    dark
                                    v-bind="attrs"
                                    v-on="on">
                                    {{ getActualPlatformName() }}
                                    <v-icon color="white">mdi-menu-down</v-icon>
                                </v-btn>
                            </template>

                            <v-list>
                                <v-list-item v-for="platform in platforms" :key="platform.id">
                                    <v-list-item-title @click="activePlatformId = platform.id">{{ platform.name }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>

                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="generateFiles" :text="$t('download_project.generate_files')"/>
                    </v-col>
                </v-row>
            </template>

            <template v-else>
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
                        <action-button block :loading="loading" :handler="downloadEverything" :text="$t('download_project.download_everything')"/>
                    </v-col>
                </v-row>
            </template>
        </v-container>
    </v-card>

</template>

<script lang="ts">
import {EXPORT_CONFIGURATION} from "@/data/services/export/export_configuration";
import ActionButton from "@/components/molecules/buttons/ActionButton";
import JSZip from "jszip";
import FileSaver from "file-saver";
import Vue from "vue";
import {FileData, TranslationFile} from "@/data/models/types/export";

export default Vue.extend({
    name: "download-project-card",
    components: {
        ActionButton
    },
    props: {
        dialogOpened: Boolean
    },
    data() {
        return {
            platforms: this.setPlatforms(),
            activePlatformId: 0,
            loading: false,
            isDownloadFinished: false,
            files: [] as TranslationFile[]
        };
    },
    methods: {
        setPlatforms(): [] {
            const res = [];
            let i = 0;
            Object.values(EXPORT_CONFIGURATION.PLATFORMS).forEach((platform) => {
                res.push({
                    id: i,
                    name: platform
                });
                i++;
            });
            return res;
        },
        getActualPlatformName() {
            return this.platforms[this.activePlatformId].name;
        },
        generateFiles(): void {
            const filesData: FileData[] = this.$service.export.exportDatas(this.getActualPlatformName());
            this.$notify(this.$t("success.files_generated").toString());
            this.isDownloadFinished = true;

            switch (this.getActualPlatformName()) {
                case EXPORT_CONFIGURATION.PLATFORMS.ANDROID:
                    this.files = filesData.map((file) => {
                        return {
                            name: "strings_" + file.language + ".xml",
                            content: file.content
                        }
                    });
                    break;
                case EXPORT_CONFIGURATION.PLATFORMS.IOS:
                    this.files = filesData.map((file) => {
                        return {
                            name: file.plural ? "Localizable_" + file.language + ".stringsdict" : "Localizable_" + file.language + ".strings",
                            content: file.content
                        }
                    });
                    break;
                case EXPORT_CONFIGURATION.PLATFORMS.WEB:
                    this.files = filesData.map((file) => {
                        return {
                            name: file.language + ".json",
                            content: file.content
                        }
                    });
                    break;
                default:
                    break;
            }
        },
        copyFile(file: TranslationFile) {
            const el = document.createElement("textarea");
            el.value = file.content;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            this.$notify(this.$t("success.copy").toString());
        },
        async downloadFile(file: TranslationFile): Promise<void> {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file.content));
            element.setAttribute('download', file.name);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        downloadEverything() {
            const zip = new JSZip();
            this.files.forEach((file) => {
                zip.file(file.name, file.content);
            });
            zip.generateAsync({type: "blob"})
                .then((content) => {
                    FileSaver.saveAs(content, "archive-lokapp.zip");
                }).catch((err) => {
                console.log("Error while zipping");
                console.log(err);
            });
        },
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