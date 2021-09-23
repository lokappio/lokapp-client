<template>
    <tr v-if="isOpen" class="background-color-transparent">
        <v-icon color="maincolor" class="mx-4 icon-style-big" @click="openKeyCreationWithName(group)" :ripple="false">mdi-plus-circle</v-icon>
    </tr>
</template>

<script>
export default ('template-group-footer', {
    props: ['isOpen', 'group', 'openKeyCreationWithName']
});
</script>