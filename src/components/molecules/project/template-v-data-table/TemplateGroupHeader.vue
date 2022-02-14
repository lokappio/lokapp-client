<template>
  <td :colspan="headers.length" class="my-custom-group-header">
    <template>
      <v-row align="center">
        <v-col cols="auto">
          <v-icon color="primary" @click="toggle">
            {{ isOpen ? "mdi-chevron-down" : "mdi-chevron-right" }}
          </v-icon>
        </v-col>

        <v-col>
          <span v-if="isActive === false" @click="canUpdateGroup">{{ currGroup.name }}</span>

          <v-text-field
              v-else
              v-model="updateName"
              single-line
              hide-details
              autofocus
              v-on:keydown.esc="cancelUpdates"
              v-on:keydown.enter="saveGroup"
              append-icon="mdi-close"
              @click:append="cancelUpdates"
              :rules="groupNameRules"
              class="custom-group-text-field">
          </v-text-field>
        </v-col>
      </v-row>
    </template>
  </td>
</template>

<script lang="ts">
import {groupNameRules} from "@/data/rules/GroupRules";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Group from "@/data/models/api/Group";

export default Vue.extend({
  name: "template-group-header",
  props: {
    headers: {},
    groupId: Number,
    items: Array,
    isOpen: Boolean,
    toggle: Function
  },
  data() {
    return {
      isActive: false,
      updateName: "",
      groupNameRules: groupNameRules()
    };
  },
  computed: {
    currGroup(): Group {
      return (this.items as translationItem[])[0].group;
    }
  },
  watch: {
    currGroup: {
      immediate: true,
      handler: function () {
        this.updateName = this.currGroup.name;
      }
    }
  },
  methods: {
    canUpdateGroup() {
      if(!this.currGroup.isDefault) this.isActive = this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteGroup : false;
    },
    updateGroup() {
      this.currGroup.name = this.updateName;

      this.items.forEach((item) => (item as translationItem).group.name = this.currGroup.name);
      this.isActive = false;
    },
    cancelUpdates() {
      this.isActive = false;
      this.updateName = this.currGroup.name;
    },
    saveGroup() {
      this.$service.groups.updateGroup(this.groupId, this.updateName)
          .then(() => this.updateGroup())
          .catch((error) => this.$notify(this.$t(error).toString()));
    }
  }
});
</script>

<style lang="scss" scoped>
.my-custom-group-header {
  border-radius: 10px !important;
}

.my-custom-group-header span {
  margin-left: 16px;
  font-family: Nobile;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 18px;
  letter-spacing: 0.05em;
  color: #000000;
}

.custom-group-text-field {
  width: 500px;
}
</style>