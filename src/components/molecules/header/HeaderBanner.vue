
<template>
    <v-container class="pa-0 banner-container full-contain">
        <v-row class="ma-0 full-contain banner-container">
            <!-- Text -->
            <v-col cols="6" class="pa-8 pr-0 col-style">
                <span class="title-h2 banner-title-style">
                    {{ $t("header.banner_title") }}
                </span>
            </v-col>

            <!-- Picture -->
            <v-col class="pa-0 col-style" cols="6">
                <img class="background-banner" src="Banner/BannerBackground.svg"/>
                <img class="men-style" src="Banner/Man.svg"/>
                <img class="women-style" src="Banner/Women.svg"/>
            </v-col>

        </v-row>
    </v-container>
</template>

<script>

export default (
    'header-banner', {
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

    .banner-container {
        border-radius: 20px;
        background-color: #02188C;
        max-width: 100%;
    }
    .col-style {
        max-width: 50%;
        position: relative;
        height: 100%;
    }
    .background-banner {
        width: 100%;
        height: 100%;
    }
    .men-style {
        position: absolute;
        bottom: 0px;
        left: 10%;
    }
    .women-style {
        position: absolute;
        bottom: 0px;
        left: 40%;
    }
    .banner-title-style {
        position: absolute;
        left: 5%;
        top: 45%;
        color: #FAF8F9;
    }
@media #{map-get($display-breakpoints, 'lg-and-down')} {
    .banner-title-style {
        position: absolute;
        left: 5%;
        top: 30%;
        color: #FAF8F9;
    }
}

</style>