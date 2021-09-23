<template>
    <div></div>
</template>

<script>

export default {
    created() {
        window.addEventListener('keyup', this.handler);
    },
    props: {
        enter: Function,
        escape: Function
    },
    methods: {
        handler(e) {
            switch (e.which) {
                case 13:
                    if (this.enter) {
                        this.enter();
                    }
                    break;
                case 27:
                    if (this.escape) {
                        this.escape();
                    }
                    break;
                default:
                    this.$emit('keyup', e);
                    break;
            }            
        },
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.handler);
    }
}
</script>

<style lang="scss" scoped>
    div {
        display: none;
    }
</style>
