<template>
  <div class="popup-body">
    <div class="popup-body__text">Columns:</div>
    <input
      type="text"
      class="popup-body__input"
      style="grid-column: 2; margin-right: 10px"
      v-model="columns"
    />
    <div class="popup-body__text" style="grid-row: 2">
      Rows:
    </div>
    <input
      type="text"
      class="popup-body__input"
      style="grid-column: 2; grid-row: 2; margin-right: 10px"
      v-model="rows"
    />

    <div class="popup-body__text" style="grid-column: 3">Column width:</div>
    <input
      type="text"
      class="popup-body__input"
      style="grid-column: 4"
      v-model="columnwidth"
    />
    <div class="popup-body__text" style="grid-column: 3; grid-row: 2">
      Row height:
    </div>
    <input
      type="text"
      class="popup-body__input"
      style="grid-column: 4; grid-row: 2"
      v-model="rowheight"
    />

    <div class="popup-body__container">
      <div class="button" style="margin-right: 10px" @click="$emit('close')">
        Cancel
      </div>
      <div class="button green" @click="create">
        Create
      </div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";
import { copyObject } from "@/static";

export default {
  data() {
    return {
      columns: 10,
      rows: 10,
      columnwidth: 100,
      rowheight: 20,
    };
  },
  methods: {
    create() {
      let table = {
        default: {
          row: {
            height: this.rowheight,
          },
          column: {
            width: this.columnwidth,
          },
        },
        rows: [],
        columns: [],
        cells: [],
      };
      for (let i = 0; i < this.rows; i++) {
        table.rows.push(copyObject(table.default.row));
      }
      for (let i = 0; i < this.columns; i++) {
        table.columns.push(copyObject(table.default.column));
      }
      Events.broadcast("tablechanged", { table });
      this.$emit("close");
    },
  },
};
</script>
