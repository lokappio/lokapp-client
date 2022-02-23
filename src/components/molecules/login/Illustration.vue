
<template>
    <v-row class="illustration-fullscreen-row">
        <v-img class="illustration-fullscreen-row" src="illustration/bg.svg">
            <v-container fluid class="illustration-fullscreen-row">
                
                <div class="red-circle image-manage">
                    <v-img contain src="illustration/red_circle.svg"></v-img>
                </div>

                <div class="flags image-manage">
                    <v-img contain src="illustration/flags.svg"></v-img>
                </div>

                <div class="phone image-manage">
                    <v-img contain src="illustration/phone.svg"></v-img>
                </div>

                <div class="formats image-manage">
                    <v-img contain src="illustration/formats.svg"></v-img>
                </div>

            </v-container>
        </v-img>
    </v-row>
</template>

<script>

export default (
  'illustration', {
  
})
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';
    .illustration-fullscreen-row {
        height: 100vh;
    }
    .logo {
        background-color: transparent;
    }
    .page-name {
        font-size:22px;
        letter-spacing:0.05em;
    }
    .image-manage {
        float: left;
        position: absolute;
        z-index: 1000;
    }
    .red-circle {
        left: 79px;
        top: 65px;
    }
    .phone {
        left: 84px;
        top: 333px;
    }
    .flags {
        left: 321px;
        top: 117px;
    }
    .formats {
        left: 375px;
        top: 495px;
    }

@media #{map-get($display-breakpoints, 'md-only')} {
    .red-circle {
        left: 40px;
        top: 65px;
        width: 100px;
    }
    .phone {
        left: 10px;
        top: 333px;
        width: 500px;
    }
    .flags {
        left: 248px;
        top: 185px;
        width: 200px;
    }
    .formats {
        left: 275px;
        top: 475px;
        width: 300px;
    }
}
@media #{map-get($display-breakpoints, 'lg-only')} {
    .red-circle {
        left: 40px;
        top: 65px;
        width: 100px;
    }
    .phone {
        left: 50px;
        top: 233px;
        width: 500px;
    }
    .flags {
        left: 288px;
        top: 85px;
        width: 200px;
    }
    .formats {
        left: 325px;
        top: 375px;
        width: 300px;
    }
}
@media #{map-get($display-breakpoints, 'xl-only')} {
    .red-circle {
        left: 100px;
        top: 65px;
        width: 200px;
    }
    .phone {
        left: 200px;
        top: 333px;
        width: 750px;
    }
    .flags {
        left: 500px;
        top: 47px;
        width: 400px;
    }
    .formats {
        left: 620px;
        top: 525px;
        width: 500px;
    }
}
</style>