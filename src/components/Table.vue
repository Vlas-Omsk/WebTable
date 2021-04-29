<template>
  <div class="table" ref="table">
    <div class="table__free-space" @click="selectAll"></div>
    <div class="table__row-headers-wrapper">
      <div
        class="table__scroll table__scroll-withoutScrollbar table__row-headers-scroll"
        ref="row_headers_scroll"
      >
        <div class="table__row-headers">
          <div
            v-for="(_, rowid) of table.rows"
            :key="rowid"
            :style="rowStyle(rowid)"
            @mousedown="
              selectionStart({
                row: rowid,
                column: $event.shiftKey ? table.columns.length - 1 : 0,
                ev: $event,
              });
              selectionMove({
                row: rowid,
                column: table.columns.length - 1,
                ev: $event,
              });
            "
            @mousemove="
              selectionMove({
                row: rowid,
                column: table.columns.length - 1,
                ev: $event,
              })
            "
            class="table__header table__row-header"
          >
            {{ rowid + 1 }}
            <div
              class="table__row-header-resizer"
              @mousedown="rowResizeStart(rowid, $event)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="table__column-headers-wrapper" ref="column_headers">
      <div
        class="table__scroll table__scroll-withoutScrollbar"
        ref="column_headers_scroll"
      >
        <div class="table__column-headers">
          <div
            v-for="(_, columnid) of table.columns"
            :key="columnid"
            :style="columnStyle(columnid)"
            @mousedown="
              selectionStart({
                row: $event.shiftKey ? table.rows.length - 1 : 0,
                column: columnid,
                ev: $event,
              });
              selectionMove({
                row: table.rows.length - 1,
                column: columnid,
                ev: $event,
              });
            "
            @mousemove="
              selectionMove({
                row: table.rows.length - 1,
                column: columnid,
                ev: $event,
              })
            "
            class="table__header table__column-header"
          >
            {{ numToLetters(columnid) }}
            <div
              class="table__column-header-resizer"
              @mousedown="columnResizeStart(columnid, $event)"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div class="table__scroll" @scroll="contentScroll">
      <div class="table__content">
        <div
          v-for="(row, rowid) of table.rows"
          :key="rowid"
          :style="rowStyle(rowid)"
          class="table__row"
        >
          <div
            v-for="(cell, columnid) of table.columns"
            :key="columnid"
            :style="columnStyle(columnid)"
            class="table__cell"
          >
            <Cell
              :selection="selection"
              :rowid="rowid"
              :columnid="columnid"
              :table="table"
              :focused="focused"
              @selectionStart="selectionStart"
              @selectionMove="selectionMove"
              @startEditing="clearSelection(1)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cell from "@/components/Cell";
import DisableScroll from "@/disableScroll";
import Events from "@/events";
import { selectionRange } from "@/events";

export default {
  components: {
    Cell,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      resizingRowId: -1,
      resizingRowTop: -1,
      resizingColumnId: -1,
      resizingColumnLeft: -1,
      isSelecting: false,
      selection: {},
      clipboard: {},
      focused: true,
    };
  },
  methods: {
    rowStyle(rowid) {
      let height =
        rowid < this.table.rows.length
          ? this.table.rows[rowid].height
          : this.table.default.row.height;
      return {
        height: height + "px",
      };
    },
    columnStyle(columnid) {
      let width =
        columnid < this.table.columns.length
          ? this.table.columns[columnid].width
          : this.table.default.column.width;
      return {
        width: width + "px",
      };
    },
    __letterByNum(num) {
      switch (num + 1) {
        case 1:
          return "A";
        case 2:
          return "B";
        case 3:
          return "C";
        case 4:
          return "D";
        case 5:
          return "E";
        case 6:
          return "F";
        case 7:
          return "G";
        case 8:
          return "H";
        case 9:
          return "I";
        case 10:
          return "J";
        case 11:
          return "K";
        case 12:
          return "L";
        case 13:
          return "M";
        case 14:
          return "N";
        case 15:
          return "O";
        case 16:
          return "P";
        case 17:
          return "Q";
        case 18:
          return "R";
        case 19:
          return "S";
        case 20:
          return "T";
        case 21:
          return "U";
        case 22:
          return "V";
        case 23:
          return "W";
        case 24:
          return "X";
        case 25:
          return "Y";
        case 26:
          return "Z";
      }
    },
    numToLetters(num) {
      let nums = [0];
      for (let o = 1; o <= num; o++) {
        nums[0] += 1;
        for (let ind = 0; ind < nums.length; ind++) {
          if (nums[ind] > 25) {
            if (nums.length > ind + 1) nums[ind + 1] += 1;
            else nums[ind + 1] = 0;
            nums[ind] = 0;
          }
        }
      }
      let result = "";
      for (let num of nums) {
        result = this.__letterByNum(num) + result;
      }
      return result;
    },
    rowResizeStart(rowid, e) {
      this.resizingRowId = rowid;
      this.resizingRowTop = e.target.parentElement.getBoundingClientRect().top;
    },
    columnResizeStart(columnid, e) {
      this.resizingColumnId = columnid;
      this.resizingColumnLeft = e.target.parentElement.getBoundingClientRect().left;
    },
    resizeMove(e) {
      if (this.resizingRowId != -1) {
        var height = e.clientY - this.resizingRowTop;
        if (height > 5) this.table.rows[this.resizingRowId].height = height;
      }
      if (this.resizingColumnId != -1) {
        var width = e.clientX - this.resizingColumnLeft;
        if (width > 5) this.table.columns[this.resizingColumnId].width = width;
      }
    },
    resizeEnd(e) {
      this.resizingRowId = -1;
      this.resizingColumnId = -1;

      // mouseup
      this.isSelecting = false;
      var current = e.target;
      while (current != this.$refs.table && current) {
        current = current.parentElement;
      }
      if (!current) this.focused = false;
      else this.focused = true;
    },
    contentScroll(e) {
      this.$refs.column_headers_scroll.scrollTo(e.target.scrollLeft, 0);
      this.$refs.row_headers_scroll.scrollTo(0, e.target.scrollTop);
    },
    selectionStart(e) {
      if (this.resizingRowId != -1 || this.resizingColumnId != -1) return;
      if (e.ev.shiftKey) {
        e.move = true;
        this.selectionMove(e);
        return;
      }
      this.isSelecting = true;
      if (!e.ev.ctrlKey && !e.ev.shiftKey) this.clearSelection();
      selectionRange.push({ row: e.row, column: e.column });
      e.index = selectionRange.length;
      this.selection.start = e;
      Events.broadcast("selectionchanged", null);
    },
    selectionMove(e) {
      if (this.isSelecting || e.move) {
        this.selection.end = e;
        let minY = Math.min(this.selection.start.row, e.row);
        let maxY = Math.max(this.selection.start.row, e.row);
        let minX = Math.min(this.selection.start.column, e.column);
        let maxX = Math.max(this.selection.start.column, e.column);
        this.clearSelection(this.selection.start.index);
        if (
          minY == maxY &&
          minX == 0 &&
          maxX == this.table.columns.length - 1
        ) {
          selectionRange.push({ row: minY });
        } else if (
          minX == maxX &&
          minY == 0 &&
          maxY == this.table.rows.length - 1
        ) {
          selectionRange.push({ column: minX });
        } else {
          selectionRange.push({
            startRow: minY,
            endRow: maxY,
            startColumn: minX,
            endColumn: maxX,
          });
        }
        Events.broadcast("selectionchanged", null);
      }
    },
    clearSelection(index = 0) {
      while (selectionRange.length > index) selectionRange.pop();
    },
    selectAll() {
      this.clearSelection();
      this.selectionStart({
        row: 0,
        column: 0,
        ev: {},
      });
      selectionRange.push(null);
      this.isSelecting = false;
      Events.broadcast("selectionchanged", null);
    },
    getSelectedCells() {
      let start = this.selection.start;
      let result = [];
      for (let select of selectionRange) {
        if (select == null) {
          for (let row = 0; row < this.table.rows.length; row++)
            for (let col = 0; col < this.table.columns.length; col++)
              result.push({ row, column: col });
          break;
        } else if (select.column == undefined && select.row == start.row) {
          for (let col = 0; col < this.table.columns.length; col++)
            result.push({ row: start.row, column: col });
        } else if (select.row == undefined && select.column == start.column) {
          for (let row = 0; row < this.table.rows.length; row++)
            result.push({ row, column: start.column });
        } else if (select.row != undefined && select.column != undefined) {
          result.push({ row: select.row, column: select.column });
        } else {
          for (let row = select.startRow; row <= select.endRow; row++)
            for (let col = select.startColumn; col <= select.endColumn; col++)
              result.push({ row, column: col });
        }
      }
      return result;
    },
    copyObject(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    copyCell(start, row, column) {
      if (!this.table.cells[row][column]) return;
      // if (!this.clipboard.cells[row - start.row])
      //   this.clipboard.cells[row - start.row] = [];
      // this.clipboard.cells[row - start.row][
      //   column - start.column
      // ] = this.table.cells[row][column];
      this.clipboard.cells.push({
        row: row - start.row,
        column: column - start.column,
        cell: this.table.cells[row][column],
      });
    },
    copy() {
      this.clipboard.cells = [];
      let start = this.selection.start;
      for (let cell of this.getSelectedCells())
        this.copyCell(start, cell.row, cell.column);
      this.clipboard = this.copyObject(this.clipboard);
    },
    pasteCell(start, row, column, cell) {
      while (this.table.rows.length <= start.row + row)
        this.table.rows.push(this.copyObject(this.table.default.row));
      while (this.table.columns.length <= start.column + column)
        this.table.columns.push(this.copyObject(this.table.default.column));
      if (!this.table.cells[start.row + row])
        this.table.cells[start.row + row] = [];
      this.setCell(start.row + row, start.column + column, cell);
      selectionRange.push({
        row: start.row + row,
        column: start.column + column,
      });
    },
    paste() {
      let clipboardSave = this.copyObject(this.clipboard);
      this.clearSelection(0);
      for (let data of this.clipboard.cells) {
        this.pasteCell(this.selection.start, data.row, data.column, data.cell);
      }
      this.clipboard = clipboardSave;
      Events.broadcast("selectionchanged", null);
      Events.broadcast("tablechanged", null);
    },
    clearSelected() {
      for (let cell of this.getSelectedCells())
        this.setCell(cell.row, cell.column, { content: null });
      Events.broadcast("tablechanged", { content: null });
    },
    keyPress(e) {
      if (!this.focused) return;
      if (e.ctrlKey && e.code == "KeyA") this.selectAll();
      else if (e.ctrlKey && e.code == "KeyC") {
        if (this.selection.start) this.copy();
      } else if (e.ctrlKey && e.code == "KeyV") {
        if (this.selection.start && this.clipboard.cells) this.paste();
      } else if (e.code == "Delete") {
        this.clearSelected();
      }
    },
    setCell(row, column, value) {
      this.table.cells[row][column] = value;
      Events.broadcast("cellchanged", { row, column, value });
    },
  },
  created() {
    Events.on("mousemove", this.resizeMove);
    Events.on("mouseup", this.resizeEnd);
    Events.on("keydown", this.keyPress);
    Events.on("callfunction", (name) => {
      if (this[name]) this[name]();
    });
  },
  mounted() {
    DisableScroll.disableScroll(this.$refs.column_headers_scroll);
    DisableScroll.disableScroll(this.$refs.row_headers_scroll);
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
  grid-template-columns: 20px calc(100% - 20px);

  &__free-space {
    border-right: $table_border;
    border-bottom: $table_border;
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__row-headers-wrapper {
    grid-row: 2;
    border-right: $table_border;
    background: lightgrey;
  }
  &__row-headers-scroll {
    height: 100%;
  }
  &__row-header {
    border-bottom: $table_border;
    overflow: hidden;
  }
  &__row-header:last-child {
    margin-bottom: 50px;
  }
  &__row-header-resizer {
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  &__row-header-resizer::after {
    position: absolute;
    content: " ";
    left: 0;
    bottom: 0;
    width: 100%;
    height: 12px;
    transform: translateY(50%);
    cursor: row-resize;
  }

  &__column-headers-wrapper {
    grid-column: 2;
    border-bottom: $table_border;
    background: lightgrey;
  }
  &__column-headers {
    display: flex;
    width: fit-content;
  }
  &__column-header {
    border-right: $table_border;
    overflow: hidden;
  }
  &__column-header:last-child {
    margin-right: 50px;
  }
  &__column-header-resizer {
    position: absolute;
    height: 100%;
    right: 0;
  }
  &__column-header-resizer::after {
    position: absolute;
    content: " ";
    top: 0;
    left: 0;
    height: 100%;
    width: 12px;
    transform: translateX(-50%);
    cursor: col-resize;
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

  &__cell {
    border-left: $table_border;
    height: 100%;
    overflow: hidden;
  }
  &__cell:first-child {
    border-left: none;
  }
  &__cell:last-child {
    border-right: $table_border;
  }

  &__row {
    display: flex;
    border-top: $table_border;
  }
  &__row:first-child {
    border-top: none;
  }
  &__row:last-child {
    border-bottom: $table_border;
  }
}
</style>
