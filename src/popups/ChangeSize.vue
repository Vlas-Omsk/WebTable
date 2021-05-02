<template>
  <table class="popup changesize">
    <tr>
      <td class="popup__text">Columns:</td>
      <td class="popup__control">
        <input type="text" class="popup__control input" v-model="columns" />
      </td>
    </tr>
    <tr>
      <td class="popup__text">Rows:</td>
      <td>
        <input type="text" class="popup__control input" v-model="rows" />
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <div class="popup__container">
          <div class="button" @click="$emit('close')">
            Cancel
          </div>
          <div class="button green" @click="change">
            Change
          </div>
        </div>
      </td>
    </tr>
  </table>
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

<style lang="scss" scoped>
.changesize {
  width: 360px;
}
</style>
