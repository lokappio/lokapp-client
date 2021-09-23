
<template>
    <p v-if="displayDescription">
        <span class="title-h1">{{ $t("header.greetings") + " " }}</span>
        <span class="title-h1 pseudo-color">{{ pseudo}}</span>
        <span class="title-h1">,</span><br/>
        <span class="text-1">{{ $t("header.greetings_description") }}</span>
    </p>
    <p v-else class="pt-3">
        <span class="title-h1">{{ $t("header.greetings") + " " }}</span>
        <span class="title-h1 pseudo-color">{{ pseudo}}</span>
    </p>
</template>

<script>
import EventEnum from "@/data/enum/event-bus.enum";

export default (
    'header-title', {
    created() {
        this.refreshEverything();
    },
    data: function() {
        return {
            pseudo: "",
        }
    },
    props: ['displayDescription'],
    methods: {
        refreshUsername(username) {
            this.pseudo = username;
        },
        refreshEverything() {
            this.$service.user.getMe()
            .then(user => {
                if (user.username === null)
                    this.pseudo = user.email;
                else
                    this.pseudo = user.username;
            }).catch(() => {
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            })
        }
    },
    mounted() {
        this.$eventBus.$on(EventEnum.RELOAD_YOURSELF, this.refreshEverything);
        this.$eventBus.$on(EventEnum.REFRESH_BANNER_TITLE, this.refreshUsername);
    },
    beforeDestroy() {
        this.$eventBus.$off(EventEnum.RELOAD_YOURSELF, this.refreshEverything);
        this.$eventBus.$off(EventEnum.REFRESH_BANNER_TITLE, this.refreshUsername);
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

    .pseudo-color {
        color: #02188C;
    }
</style>