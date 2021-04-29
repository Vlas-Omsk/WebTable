<template>
  <div
    ref="rowheader"
    @mousedown="mousedown"
    @mousemove="mousemove"
    class="table__header row-header"
  >
    {{ rowid + 1 }}
    <div class="row-header__resizer" @mousedown="resizeStart"></div>
  </div>
</template>

<script>
import ETable from "@/etable";
import { table } from "@/etable";
import Events from "@/events";

export default {
  props: {
    rowid: {
      type: Number,
      required: true,
    },
  },
  methods: {
    mousedown(e) {
      ETable.selectionStart({
        row: this.rowid,
        column: e.shiftKey ? table.columns.length - 1 : 0,
        ev: e,
      });
      ETable.selectionMove({
        row: this.rowid,
        column: table.columns.length - 1,
        ev: e,
      });
    },
    mousemove(e) {
      ETable.selectionMove({
        row: this.rowid,
        column: table.columns.length - 1,
        ev: e,
      });
    },
    resizeStart(e) {
      ETable.rowResizeStart(this.rowid, e);
    },
    rowsizechanged(e) {
      if (e.row == this.rowid && this.$refs.rowheader) {
        this.$refs.rowheader.style.height = e.value + "px";
      }
    },
  },
  created() {
    Events.on("rowsizechanged", this.rowsizechanged);
  },
  mounted() {
    this.rowsizechanged({
      row: this.rowid,
      value: table.rows[this.rowid].height,
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.row-header {
  border-bottom: $header_border;
  overflow: hidden;
  &:last-child {
    margin-bottom: 50px;
  }
  &__resizer {
    &::after {
      position: absolute;
      content: " ";
      left: 0;
      bottom: 0;
      width: 100%;
      height: 12px;
      transform: translateY(50%);
      cursor: row-resize;
    }
    position: absolute;
    width: 100%;
    bottom: 0;
  }
}
</style>
