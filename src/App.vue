<template>
  <div id="app">
    <Tools
      @load="fuckingCss"
      @isTextTableViewerShowedChanged="
        isTextTableViewerShowed = !isTextTableViewerShowed
      "
      @save="save"
      @open="open"
    />
    <div class="container" ref="container">
      <Table
        :table="table"
        :style="tableStyle"
        :isOverlayVisible="isOverlayVisible"
      />
      <TextTableViewer :isShowed="isTextTableViewerShowed" :table="table" />
    </div>
    <Popup v-model="isOverlayVisible" />
  </div>
</template>

<script>
import Table from "@/components/Table";
import Tools from "@/components/Tools";
import TextTableViewer from "@/components/TextTableViewer";
import Popup from "@/components/Popup";
import Events from "@/events";
import json from "@/formats/json";

export default {
  name: "App",
  components: {
    Table,
    Tools,
    TextTableViewer,
    Popup,
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
        cells: [],
      },
      isOverlayVisible: false,
      isTextTableViewerShowed: false,
    };
  },
  computed: {
    tableStyle() {
      let width = this.isTextTableViewerShowed ? "calc(100% - 400px)" : "100%";
      return {
        width,
      };
    },
  },
  methods: {
    fuckingCss(e) {
      this.$refs.container.style.height =
        "calc(100% - " + e.target.offsetHeight + "px)";
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    save() {
      json.save(this.table);
    },
    open() {
      json.load();
    },
    tableloaded(e) {
      this.table = e.table;
      Events.broadcast("aftertableloaded", null);
    },
  },
  created() {
    Events.on("tableloaded", this.tableloaded);

    //temp
    for (let i = 0; i < 5; i++) {
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
  height: 100vh;
  flex-direction: column;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;
}

.container {
  display: flex;
}

.button {
  &:hover {
    background: #f8fcf9;
    border: 1px solid #c8e7d1 !important;
  }
  &:active {
    background: #dff2e4;
    border: 1px solid transparent !important;
    box-shadow: 0 2px 6px 2px rgba(60, 64, 67, 0.15);
  }
  border-radius: 4px;
  padding: 9px 24px 11px 24px;
  font-weight: 600;
  font-size: 14px;
  color: #188038;
  border: 1px solid #dadce0 !important;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s, border 0.2s, box-shadow 0.2s;

  &.green {
    &:hover {
      background: #2a8947;
    }
    &:active {
      background: #62a877;
      box-shadow: 0 2px 6px 2px rgba(52, 168, 83, 0.15);
    }
    box-shadow: 0 1px 3px 1px rgba(52, 168, 83, 0.15);
    background: #188038;
    color: #fff;
  }
}
</style>
