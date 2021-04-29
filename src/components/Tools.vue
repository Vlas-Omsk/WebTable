<template>
  <div class="tools" ref="root">
    <div class="tools__container">
      <DropdownButton title="Table" :items="tabletab" />
      <DropdownButton title="Edit" :items="edittab" />
      <DropdownButton title="Window" :items="windowtab" />
    </div>
  </div>
</template>

<script>
import DropdownButton from "@/components/DropdownButton";
import CreateTable from "@/popups/CreateTable";
import Events from "@/events";
import ETable from "@/etable";
import { selection } from "@/etable";
import json from "@/formats/json";

export default {
  components: {
    DropdownButton,
  },
  data() {
    return {
      tabletab: [
        {
          label: "Create",
          click() {
            Events.broadcast("openpopup", { component: CreateTable });
          },
        },
        {
          label: "Open",
          click() {
            json.load();
          },
        },
        {
          label: "Save",
          click() {
            json.save();
          },
        },
      ],
      edittab: [
        {
          label: "Select all",
          click() {
            ETable.selectAll();
          },
        },
        {
          label: "Clear",
          click() {
            ETable.clearSelected();
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Copy",
          click() {
            ETable.copy();
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Paste",
          click() {
            ETable.paste();
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Cut",
          click() {
            ETable.cut();
          },
          isDisabled: this.isDisabled,
        },
      ],
      windowtab: [
        {
          label: "Show text table preview",
          click() {
            Events.broadcast("textTableViewerShowedChanged", null);
          },
        },
      ],
    };
  },
  methods: {
    isDisabled() {
      return !selection.start;
    },
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
