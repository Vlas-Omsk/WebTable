<template>
  <div class="tools" ref="root">
    <div class="tools__container">
      <DropdownButton
        title="Table"
        :items="[
          {
            label: 'Create',
            click() {
              openpopup();
            },
          },
          {
            label: 'Open',
            click() {
              $emit('open', null);
            },
          },
          {
            label: 'Save',
            click() {
              $emit('save', null);
            },
          },
        ]"
      />
      <DropdownButton
        title="Edit"
        :items="[
          {
            label: 'Select all',
            click() {
              call('selectAll');
            },
          },
          {
            label: 'Clear',
            click() {
              call('clearSelected');
            },
          },
        ]"
      />
      <DropdownButton
        title="Window"
        :items="[
          {
            label: 'Show text table preview',
            click() {
              $emit('isTextTableViewerShowedChanged', null);
            },
          },
        ]"
      />
    </div>
  </div>
</template>

<script>
import DropdownButton from "@/components/DropdownButton";
import CreateTable from "@/popups/CreateTable";
import Events from "@/events";

export default {
  components: {
    DropdownButton,
  },
  methods: {
    call(name) {
      Events.broadcast("callfunction", name);
    },
    openpopup() {
      Events.broadcast("openpopup", { component: CreateTable });
    },
  },
  mounted() {
    this.$emit("load", { target: this.$refs.root });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.tools {
  display: flex;
  align-items: center;
  border-bottom: $border;
  box-sizing: border-box;

  &__container {
    display: flex;
    justify-items: center;
    align-content: center;
    margin: 0 20px;
  }
}
</style>
