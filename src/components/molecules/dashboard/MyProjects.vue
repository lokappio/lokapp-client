
<template>
    <v-container class="my-projects-container full-contain">

        <!-- Header -->
        <v-row class="ma-0 align-center title-row-style">
            <p class="ma-0 ml-4">
                <span class="title-h2">{{ this.$t('dashboard.all_projects_title') }}</span> <br/>
                <span class="text-2 grey-color">{{ this.$tc("dashboard.last_update", timerUpdate, {count: timerUpdate}) }}</span>
            </p>
        </v-row>

        <!-- Projects -->
        <v-row class="ma-0 projects-row-style">
            <v-container class="full-contain projects-container-style">

                <!-- If Projects Loaded -->
                <template v-if="displayCards.length">
                    <v-row justify="center" justify-sm="start" class="py-auto project-row-style">
                        <v-col
                            v-for="card in displayCards.slice().reverse()"
                            :key="card.id"
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                            xl="2"
                            class="project-card-col">
                            <project-small :project="card"/>
                        </v-col>
                        <v-col
                            cols="12"
                            sm="6"
                            md="4"
                            lg="3"
                            xl="2"
                            class="project-card-col">
                            <project-small/>
                        </v-col>
                    </v-row>
                </template>

                <!-- Else -->
                <template v-else>
                    <v-row align-content="end" justify="center" class="middle-row my-0 mx-auto">
                        <p><span class="title-h3">{{ $t("dashboard.no_project_in_dashboard") }}</span></p>
                    </v-row>
                    <!-- Button -->
                    <v-row align-content="start" justify="center" class="middle-row my-0 mx-auto">
                        <v-col cols="4">
                            <action-button :loading="loading" block :handler="openCreateProjectCard" :text="text" addIcon/>
                        </v-col>
                    </v-row>
                </template>
            </v-container>
        </v-row>
    </v-container>
</template>

<script>
import ProjectSmall from "../cards/ProjectSmall.vue";
import ActionButton from "../buttons/ActionButton";
import CardEnum from "@/data/models/Card.enum";
import { Vue, Component } from "vue-property-decorator";
import EventEnum from "@/data/enum/event-bus.enum";

@Component({
    components: { 
        ProjectSmall,
        ActionButton
    },
})
export default class MyProjects extends Vue {
    name = 'my-projects'
    created() {
        this.refreshProjectList();
    }
    data() {
        return {
            cards: [],
            displayCards: [],
            searchBarValue: "",
            timerUpdate: 0,
            totalSecondes: 0,

            timer: null,

            loading: false,
            text: this.$t("dashboard.add_project")
        }
    }
    openCreateProjectCard() {
        this.$store.commit('SET_OPEN_CARD', CardEnum.CREATE_PROJECT);
    }
    refreshProjectList() {
        this.$service.projects.getProjects()
        .then(projects => {
            this.cards = projects;
            this.displayCards = projects;
            this.searchBarValue = "";
            this.updateMyTimer();
        }).catch(() => {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
        });
    }
    filterProjectList(searchValue) {
        this.searchBarValue = searchValue;
        this.displayCards = [];
        for (let index = 0; index < this.cards.length; index++) {
            const element = this.cards[index];
            if (element.name.toUpperCase().indexOf(searchValue.toUpperCase()) > -1)
                this.displayCards.push(element);
        }
    }
    updateMyTimer() {
        this.totalSecondes = 0;
        this.timerUpdate = 0;
        clearInterval(this.timer);
        this.timer = setInterval( () => {
            this.timerUpdate = Math.floor(++this.totalSecondes / 60);
        }, 1000 );
    }
    mounted() {
        this.$eventBus.$on(EventEnum.RELOAD_YOURSELF, this.refreshProjectList);
        this.$eventBus.$on(EventEnum.FILTER_PROJECTS_LIST, this.filterProjectList);
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    
    .my-projects-container {
        max-width: 100%;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }
    .title-row-style {
        height: 15%;
        width: 100%;
    }
    .projects-row-style {
        height: 85%;
        width: 100%;
    }
    .projects-container-style {
        max-width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .middle-row {
        height: 50%;
    }
    .project-row-style {
        height: 130px;
    }
    .project-card-col {
        height: 120px;
        padding: 0px;
        padding-right: 10px;
        padding-left: 10px;
        margin-bottom: 10px;
        margin-top: 15px;
        border-radius: 5px;
    }
</style>