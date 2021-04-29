<template>
  <div id="app">
    <Table :table="table" />
  </div>
</template>

<script>
import Table from "@/components/Table";
import Events from "@/events";

export default {
  name: "App",
  components: {
    Table,
  },
  data() {
    return {
      table: {
        default: {
          row: {
            height: 20,
          },
          column: {
            width: 100,
          },
        },
        rows: [
          {
            height: 20,
          },
          {
            height: 20,
          },
          {
            height: 20,
          },
          {
            height: 20,
          },
          {
            height: 20,
          },
          {
            height: 20,
          },
        ],
        columns: [],
        cells: [
          [],
          [
            {
              content: "1col 2row",
            },
          ],
        ],
      },
    };
  },
  methods: {
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
  },
  created() {
    for (let i = 0; i < 40; i++) {
      this.table.cells[0].push({
        content: i + "col 1row",
      });
      this.table.columns.push(this.copyObject(this.table.default.column));
      this.table.rows.push(this.copyObject(this.table.default.row));
    }
  },
  destroyed() {
    Events.clear();
  },
};
</script>

<style lang="scss">
* {
  user-select: none;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  width: 100%;
  height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}
</style>
