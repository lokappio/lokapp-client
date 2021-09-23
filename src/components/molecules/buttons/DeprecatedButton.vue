

<template>
    
    <div class="full-div-center-text">
        <span class="deprecated-button-style set-cursor-pointer" @click="handler">
            {{text}}
        </span>
    </div>
  
</template>

<script>

export default (
    'deprecated-button', {
    props: {
        block: Boolean,
        handler: Function,
        text: String,
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .full-div-center-text {
        width: 100%;
        height: 100%;
        text-align: center;
        height: 55;
        margin: auto;
    }
    .deprecated-button-style {
        color: red;
    }
    .set-cursor-pointer {
        cursor: pointer;
    }
</style>