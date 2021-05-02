<template>
  <table>
    <tr>
      <td class="popup__text">Columns:</td>
      <td style="padding-right: 10px;">
        <input type="text" class="popup__control input" v-model="columns" />
      </td>
      <td class="popup__text">Rows:</td>
      <td>
        <input type="text" class="popup__control input" v-model="rows" />
      </td>
    </tr>
    <tr>
      <td class="popup__text">Column width:</td>
      <td style="padding-right: 10px;">
        <input type="text" class="popup__control input" v-model="columnwidth" />
      </td>
      <td class="popup__text">Row height:</td>
      <td>
        <input type="text" class="popup__control input" v-model="rowheight" />
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <div class="popup__container">
          <div class="button" @click="$emit('close')">
            Cancel
          </div>
          <div class="button green" @click="create">
            Create
          </div>
        </div>
      </td>
    </tr>
  </table>
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
