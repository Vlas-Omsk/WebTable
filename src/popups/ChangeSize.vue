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

    <div class="popup-body__container">
      <div class="button" style="margin-right: 10px" @click="$emit('close')">
        Cancel
      </div>
      <div class="button green" @click="change">
        Change
      </div>
    </div>
  </div>
</template>

<script>
import { table } from "@/etable";
import { copyObject } from "@/static";

export default {
  data() {
    return {
      rows: table.rows.length,
      columns: table.columns.length,
    };
  },
  methods: {
    change() {
      while (this.rows < table.rows.length) {
        table.rows.pop();
      }
      while (this.rows > table.rows.length) {
        table.rows.push(copyObject(table.default.row));
      }
      while (this.columns < table.columns.length) {
        table.columns.pop();
      }
      while (this.columns > table.columns.length) {
        table.columns.push(copyObject(table.default.column));
      }
      this.$emit("close");
    },
  },
};
</script>
