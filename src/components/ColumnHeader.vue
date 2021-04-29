<template>
  <div
    ref="columnheader"
    @mousedown="mousedown"
    @mousemove="mousemove"
    class="table__header column-header"
  >
    {{ numToLetters(columnid) }}
    <div
      class="column-header__resizer"
      ref="header_resizer"
      @mousedown="resizeStart"
    ></div>
  </div>
</template>

<script>
import ETable from "@/etable";
import { table } from "@/etable";
import Events from "@/events";
import { numToLetters } from "@/static";

export default {
  props: {
    columnid: {
      type: Number,
      required: true,
    },
  },
  methods: {
    numToLetters,
    mousedown(e) {
      ETable.selectionStart({
        row: e.shiftKey ? table.rows.length - 1 : 0,
        column: this.columnid,
        ev: e,
      });
      ETable.selectionMove({
        row: table.rows.length - 1,
        column: this.columnid,
        ev: e,
      });
    },
    mousemove(e) {
      ETable.selectionMove({
        row: table.rows.length - 1,
        column: this.columnid,
        ev: e,
      });
    },
    resizeStart(e) {
      ETable.columnResizeStart(this.columnid, e);
    },
    columnsizechanged(e) {
      if (e.column == this.columnid && this.$refs.columnheader) {
        this.$refs.columnheader.style.width = e.value + "px";
      }
    },
  },
  created() {
    Events.on("columnsizechanged", this.columnsizechanged);
  },
  mounted() {
    this.columnsizechanged({
      column: this.columnid,
      value: table.columns[this.columnid].width,
    });

    this.$refs.columnheader.addEventListener("touchstart", this.mousedown);
    this.$refs.header_resizer.addEventListener("touchstart", this.resizeStart);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.column-header {
  border-right: $header_border;
  overflow: hidden;
  &:last-child {
    margin-right: 50px;
  }
  &__resizer {
    &::after {
      position: absolute;
      content: " ";
      top: 0;
      left: 0;
      height: 100%;
      width: 12px;
      transform: translateX(-50%);
      cursor: col-resize;
    }
    position: absolute;
    height: 100%;
    right: 0;
  }
}
</style>
