
<template>

    <v-card color="white" class="pa-4 pa-md-7 card-style-project">
        <v-container>

            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <span class="title-h2">
                    {{ $t("download_project.title") }}
                    </span>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeDownloadProject" color="black" class="float-right">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>

            <template v-if="!isDownloadFinished">
                <v-row class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('download_project.platform_target') }}</span>
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
                                    <v-icon color="white">
                                        mdi-menu-down
                                    </v-icon>
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
                        <action-button block :loading="loading" :handler="downloadProjectWithPlatform" :text="$t('download_project.generate_files')"/>
                    </v-col>
                </v-row>
            </template>

            <template v-else>
                <v-row v-if="files.length === 0" class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <p class="title-h3">{{ $t('download_project.no_file_to_download') }}</p>
                    </v-col>
                </v-row>
                <v-container v-else class="mt-1 pt-0 file-list-style">
                    <v-row v-for="file in files" :key="file.name" class="mt-3 pb-0 mb-0">
                        <v-col cols="10" class="py-0 px-0">
                            <span class="text-2">{{ file.name }}</span>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-icon @click="copyFile(file)" color="maincolor">
                            mdi-content-copy
                        </v-icon>
                        <v-icon @click="downloadFile(file)" color="maincolor">
                            mdi-download
                        </v-icon>
                    </v-row>
                </v-container>
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="downloadEverything" :text="$t('download_project.download_everything')"/>
                    </v-col>
                </v-row>
            </template>

        </v-container>
    </v-card>

</template>

<script>
import { EXPORT_CONFIGURATION } from "@/data/services/export/export_configuration";
import ActionButton from "@/components/molecules/buttons/ActionButton";
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import JSZip from 'jszip';
import FileSaver from 'file-saver';

export default (
    'download-project-card', {
    components: {
        ActionButton
    },
    data() {
        return {
            platforms: this.setPlatforms(),
            activePlatformId: 0,
            loading: false,
            isDownloadFinished: false,
            files: []
        };
    },
    methods: {
        setPlatforms() {
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
        closeDownloadProject() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        },
        getActualPlatformName() {
            return this.platforms[this.activePlatformId].name;
        },
        downloadProjectWithPlatform() {
            this.$eventBus.$emit(EventEnum.DOWNLOAD_PROJECT, this.platforms[this.activePlatformId].name);
        },
        copyFile(file) {
            const el = document.createElement('textarea');
            el.value = file.content;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.$notify(this.$t("success.copy"));
        },
        downloadFile(file) {
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
            })
        },
        downloadFinished(platform, files) {
            if (files.length > 1) {
                this.$notify(this.$t("success.files_generated"));
            }
            this.isDownloadFinished = true;
            this.files = files;
            switch (platform) {
                case EXPORT_CONFIGURATION.PLATFORMS.ANDROID:
                    this.files.forEach((file) => {
                        file.name = "strings_" + file.language + ".xml";
                    });
                    break;
                case EXPORT_CONFIGURATION.PLATFORMS.IOS:
                    this.files.forEach((file) => {
                        if (file.plural === false) {
                            file.name = "Localizable_" + file.language + ".strings";
                        } else {
                            file.name = "Localizable_" + file.language + ".stringsdict";
                        }
                    });
                    break;
                case EXPORT_CONFIGURATION.PLATFORMS.WEB:
                    this.files.forEach((file) => {
                        file.name = file.language + ".json";
                    });
                    break;
                default:
                    break;
            }
        }
    },
    mounted() {
        this.$eventBus.$on(EventEnum.DOWNLOAD_IS_FINISHED, this.downloadFinished);
    },
    beforeDestroy() {
        this.$eventBus.$off(EventEnum.DOWNLOAD_IS_FINISHED, this.downloadFinished);
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .card-project-style.v-sheet.v-card{
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