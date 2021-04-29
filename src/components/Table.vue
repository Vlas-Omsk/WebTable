<template>
  <div class="table" ref="table">
    <div class="table__free-space" @click="selectAll"></div>
    <div class="table__row-headers-wrapper">
      <div
        class="table__scroll table__scroll-withoutScrollbar table__row-headers-scroll"
        ref="row_headers_scroll"
      >
        <div class="table__row-headers">
          <RowHeader
            v-for="(_, rowid) of table.rows"
            :key="rowid"
            :rowid="rowid"
          />
        </div>
      </div>
    </div>
    <div class="table__column-headers-wrapper" ref="column_headers">
      <div
        class="table__scroll table__scroll-withoutScrollbar"
        ref="column_headers_scroll"
      >
        <div class="table__column-headers">
          <ColumnHeader
            v-for="(_, columnid) of table.columns"
            :key="columnid"
            :columnid="columnid"
          />
        </div>
      </div>
    </div>
    <div class="table__scroll" @scroll="contentScroll">
      <div class="table__content">
        <CellRow
          v-for="(_, rowid) of table.rows"
          :key="rowid"
          :rowid="rowid"
          :focused="focused"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RowHeader from "@/components/RowHeader";
import ColumnHeader from "@/components/ColumnHeader";
import CellRow from "@/components/CellRow";
import Events from "@/events";
import { table, selection, selectionMap } from "@/etable";
import ETable from "@/etable";
import { copyObject, disableScroll, isAnyParentContains } from "@/static";

export default {
  components: {
    RowHeader,
    ColumnHeader,
    CellRow,
  },
  data() {
    return {
      clipboard: {},
      focused: true,
      table,
    };
  },
  methods: {
    selectAll: ETable.selectAll,
    contentScroll(e) {
      this.$refs.column_headers_scroll.scrollTo(e.target.scrollLeft, 0);
      this.$refs.row_headers_scroll.scrollTo(0, e.target.scrollTop);
    },
    copyCell(start, row, column) {
      if (!table.cells[row][column]) return;
      // if (!this.clipboard.cells[row - start.row])
      //   this.clipboard.cells[row - start.row] = [];
      // this.clipboard.cells[row - start.row][
      //   column - start.column
      // ] = this.table.cells[row][column];
      this.clipboard.cells.push({
        row: row - start.row,
        column: column - start.column,
        cell: table.cells[row][column],
      });
    },
    copy() {
      this.clipboard.cells = [];
      let start = selection.start;
      for (let cell of ETable.getSelectedCells())
        this.copyCell(start, cell.row, cell.column);
      this.clipboard = copyObject(this.clipboard);
    },
    pasteCell(start, row, column, cell) {
      while (table.rows.length <= start.row + row)
        table.rows.push(copyObject(table.default.row));
      while (table.columns.length <= start.column + column)
        table.columns.push(copyObject(table.default.column));
      if (!table.cells[start.row + row]) table.cells[start.row + row] = [];
      ETable.setCell(start.row + row, start.column + column, cell);
      ETable.setMap(start.row + row, start.column + column);
    },
    paste() {
      let clipboardSave = copyObject(this.clipboard);
      ETable.clearSelection();
      for (let data of this.clipboard.cells) {
        this.pasteCell(selection.start, data.row, data.column, data.cell);
      }
      this.clipboard = clipboardSave;
      Events.broadcast("selectionchanged", null);
    },
    keyPress(e) {
      if (!this.focused) return;
      if (e.ctrlKey && e.code == "KeyA") ETable.selectAll();
      else if (e.ctrlKey && e.code == "KeyC") {
        if (selection.start) this.copy();
      } else if (e.ctrlKey && e.code == "KeyV") {
        if (selection.start && this.clipboard.cells) this.paste();
      } else if (e.code == "Delete") {
        ETable.clearSelected();
      }
    },
    globalMouseUp(e) {
      this.focused = isAnyParentContains(e.target, [this.$refs.table]);
    },
  },
  created() {
    Events.on("keydown", this.keyPress);
    Events.on("mouseup", this.globalMouseUp);
  },
  mounted() {
    disableScroll(this.$refs.column_headers_scroll);
    disableScroll(this.$refs.row_headers_scroll);
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.table {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 20px calc(100% - 20px);
  grid-template-columns: 40px calc(100% - 40px);
  transition: width 0.2s ease-in-out;

  &__free-space {
    border-right: $header_border;
    border-bottom: $header_border;
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__row-headers-wrapper {
    grid-row: 2;
    border-right: $header_border;
    background: lightgrey;
  }
  &__row-headers-scroll {
    height: 100%;
  }

  &__column-headers-wrapper {
    grid-column: 2;
    border-bottom: $header_border;
    background: lightgrey;
  }
  &__column-headers {
    display: flex;
    width: fit-content;
  }

  &__scroll {
    overflow: auto;
  }
  &__scroll-withoutScrollbar {
    scrollbar-width: none;
  }
  &__scroll-withoutScrollbar::-webkit-scrollbar {
    display: none;
  }
  &__content {
    display: flex;
    flex-direction: column;
    width: fit-content;
  }
}
</style>
