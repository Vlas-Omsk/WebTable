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
import SaveFile from "@/popups/SaveFile";
import Options from "@/popups/Options";
import Events from "@/events";
import ETable from "@/etable";
import { selection } from "@/etable";
import { loadFileAsync } from "@/static";
import Config from "@/config";

// formats
import json from "@/formats/json";
import csv from "@/formats/csv";

function loadCsv(e) {
  Events.broadcast("openpopup", {
    component: Options,
    data: {
      width: 360,
      options: [
        {
          label: "Delimiter:",
          input: Config.get("delimiter") ? Config.get("delimiter") : ";",
        },
        { label: "Column width:", input: "100" },
        { label: "Row height:", input: "20" },
      ],
      apply: {
        label: "Load",
        click() {
          Config.set("delimiter", this.options[0].input);
          e.getContentAsync((content) => {
            csv.load(this.options[0].input, content, e.name, {
              row: {
                height: this.options[2].input,
              },
              column: {
                width: this.options[1].input,
              },
            });
          });
        },
      },
    },
  });
}

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
            loadFileAsync((e) => {
              switch (e.ext) {
                case "json":
                  e.getContentAsync(json.load);
                  break;
                case "csv":
                  loadCsv(e);
                  break;
                default:
                  console.log("Invalid file type");
                  break;
              }
            });
          },
        },
        {
          label: "Save",
          click() {
            Events.broadcast("openpopup", { component: SaveFile });
          },
          hotkey: ["Ctrl", "S"],
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
          hotkey: ["Ctrl", "K"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Add row before selected",
          click() {
            ETable.addRow(selection.start.row);
          },
          hotkey: ["Ctrl", "I"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Delete selected row",
          click() {
            ETable.deleteRow(selection.start.row);
          },
          hotkey: ["Ctrl", "U"],
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
          hotkey: ["Ctrl", "L"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Add column before selected",
          click() {
            ETable.addColumn(selection.start.column);
          },
          hotkey: ["Ctrl", "J"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Delete selected column",
          click() {
            ETable.deleteColumn(selection.start.column);
          },
          hotkey: ["Ctrl", "O"],
          isDisabled: this.isDisabled,
        },
      ],
      edittab: [
        {
          label: "Select all",
          click() {
            ETable.selectAll();
          },
          hotkey: ["Ctrl", "A"],
        },
        {
          type: "delimiter",
        },
        {
          label: "Clear",
          click() {
            ETable.clearSelected();
          },
          hotkey: ["Delete"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Copy",
          click() {
            ETable.copy();
          },
          hotkey: ["Ctrl", "C"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Paste",
          click() {
            ETable.paste();
          },
          hotkey: ["Ctrl", "V"],
          isDisabled: this.isDisabled,
        },
        {
          label: "Cut",
          click() {
            ETable.cut();
          },
          hotkey: ["Ctrl", "X"],
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
