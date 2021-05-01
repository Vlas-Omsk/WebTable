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
import ChangeSize from "@/popups/ChangeSize";
import Events from "@/events";
import ETable from "@/etable";
import { selection } from "@/etable";
import json from "@/formats/json";
import Config from "@/config";

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
        {
          label: "Change size",
          click() {
            Events.broadcast("openpopup", { component: ChangeSize });
          },
        },
        {
          type: "delimiter",
        },
        {
          label: "Add row after selected",
          click() {
            ETable.addRow(selection.start.row + 1);
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Add row before selected",
          click() {
            ETable.addRow(selection.start.row);
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Delete selected row",
          click() {
            ETable.deleteRow(selection.start.row);
          },
          isDisabled: this.isDisabled,
        },
        {
          type: "delimiter",
        },
        {
          label: "Add column after selected",
          click() {
            ETable.addColumn(selection.start.column + 1);
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Add column before selected",
          click() {
            ETable.addColumn(selection.start.column);
          },
          isDisabled: this.isDisabled,
        },
        {
          label: "Delete selected column",
          click() {
            ETable.deleteColumn(selection.start.column);
          },
          isDisabled: this.isDisabled,
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
          type: "delimiter",
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
          type: "checkbox",
          label: "Show text table preview",
          click() {
            Config.set(
              "isTextTableViewerShowed",
              !Config.get("isTextTableViewerShowed")
            );
          },
          isChecked() {
            return Config.get("isTextTableViewerShowed");
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
