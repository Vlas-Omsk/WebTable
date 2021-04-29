<template>
  <div class="createtable">
    <div class="createtable__text">Columns:</div>
    <input
      type="text"
      class="createtable__input"
      style="grid-column: 2; margin-right: 10px"
      v-model="columns"
    />
    <div class="createtable__text" style="grid-row: 2">
      Rows:
    </div>
    <input
      type="text"
      class="createtable__input"
      style="grid-column: 2; grid-row: 2; margin-right: 10px"
      v-model="rows"
    />

    <div class="createtable__text" style="grid-column: 3">Column width:</div>
    <input
      type="text"
      class="createtable__input"
      style="grid-column: 4"
      v-model="columnwidth"
    />
    <div class="createtable__text" style="grid-column: 3; grid-row: 2">
      Row height:
    </div>
    <input
      type="text"
      class="createtable__input"
      style="grid-column: 4; grid-row: 2"
      v-model="rowheight"
    />

    <div class="createtable__container">
      <div class="button" style="margin-right: 10px" @click="close">
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
    close() {
      Events.broadcast("closepopup", null);
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
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
        table.rows.push(this.copyObject(table.default.row));
      }
      for (let i = 0; i < this.columns; i++) {
        table.columns.push(this.copyObject(table.default.column));
      }
      Events.broadcast("tableloaded", { table });
      Events.broadcast("closepopup", null);
    },
  },
};
</script>

<style lang="scss" scoped>
.createtable {
  display: grid;
  row-gap: 5px;
  &__column {
    display: flex;
    flex-direction: column;
  }
  &__row {
    display: flex;
    align-items: flex-end;
    margin: 5px 0;
    width: 100%;
  }
  &__text {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 5px;
    font-size: 14px;
  }
  &__input {
    border: 1px solid #dadce0;
    border-radius: 4px;
    box-sizing: border-box;
    color: #3c4043;
    padding: 6px 8px;
    font-size: 14px;
  }
  &__container {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
    grid-column: 1 / 5;
  }
}
</style>
