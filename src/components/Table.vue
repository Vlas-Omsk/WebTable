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
    <div class="table__scroll" ref="table_viewer" @scroll="contentScroll">
      <div class="table__content">
        <CellRow
          v-for="(_, rowid) of table.rows"
          :key="rowid"
          :rowid="rowid"
          :focused="focused"
          @cellEditingStart="isCellEditing = true"
          @cellEditingEnd="isCellEditing = false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RowHeader from "@/components/RowHeader";
import ColumnHeader from "@/components/ColumnHeader";
import CellRow from "@/components/CellRow";
import SaveFile from "@/popups/SaveFile";
import Events from "@/events";
import { table, selection, selectionRange } from "@/etable";
import ETable from "@/etable";
import { disableScroll, isAnyParentContains, copyObject } from "@/static";

export default {
  components: {
    RowHeader,
    ColumnHeader,
    CellRow,
  },
  data() {
    return {
      focused: true,
      isCellEditing: false,
      table,
    };
  },
  methods: {
    selectAll: ETable.selectAll,
    contentScroll(e) {
      this.$refs.column_headers_scroll.scrollTo(e.target.scrollLeft, 0);
      this.$refs.row_headers_scroll.scrollTo(0, e.target.scrollTop);
    },
    select(row, column, shift) {
      let start = {
        row: selection.start.row + row,
        column: selection.start.column + column,
      };
      if (
        start.row >= 0 &&
        start.row < table.rows.length &&
        start.column >= 0 &&
        start.column < table.columns.length
      ) {
        if (!shift) {
          selection.start = start;
          selectionRange.unshift({
            row: selection.start.row,
            column: selection.start.column,
          });
          ETable.clearSelection(1, true);
        } else {
          if (!selection.start.save) {
            selection.start.save = copyObject(selection.start);
            selection.start.index = selectionRange.length;
          }
          selection.start.row = start.row;
          selection.start.column = start.column;
          ETable.selectionMove({
            move: true,
            row: selection.start.save.row,
            column: selection.start.save.column,
          });
        }
      }
    },
    keyPress(e) {
      // global
      if (e.ctrlKey && e.code == "KeyS") {
        Events.broadcast("openpopup", { component: SaveFile });
        e.preventDefault();
      }

      // table
      if (!this.focused || this.isCellEditing) return;
      if (e.ctrlKey && e.code == "KeyA") ETable.selectAll();
      else if (e.code == "Delete") ETable.clearSelected();
      else if (e.code == "ArrowUp") {
        if (e.ctrlKey) this.select(-selection.start.row, 0, e.shiftKey);
        else this.select(-1, 0, e.shiftKey);
      } else if (e.code == "ArrowDown") {
        if (e.ctrlKey)
          this.select(
            table.rows.length - selection.start.row - 1,
            0,
            e.shiftKey
          );
        else this.select(+1, 0, e.shiftKey);
      } else if (e.code == "ArrowLeft") {
        if (e.ctrlKey) this.select(0, -selection.start.column, e.shiftKey);
        else this.select(0, -1, e.shiftKey);
      } else if (e.code == "ArrowRight") {
        if (e.ctrlKey)
          this.select(
            0,
            table.columns.length - selection.start.column - 1,
            e.shiftKey
          );
        else this.select(0, +1, e.shiftKey);
      } else if (e.ctrlKey) {
        if (e.code == "KeyI") {
          ETable.addRow(selection.start.row);
          e.preventDefault();
        } else if (e.code == "KeyK") {
          ETable.addRow(selection.start.row + 1);
          e.preventDefault();
        } else if (e.code == "KeyJ") {
          ETable.addColumn(selection.start.column);
          e.preventDefault();
        } else if (e.code == "KeyL") {
          ETable.addColumn(selection.start.column + 1);
          e.preventDefault();
        } else if (e.code == "KeyU") {
          ETable.deleteRow(selection.start.row);
          e.preventDefault();
        } else if (e.code == "KeyO") {
          ETable.deleteColumn(selection.start.column);
          e.preventDefault();
        }
      }
    },
    globalMouseUp(e) {
      this.focused = isAnyParentContains(e.target, [this.$refs.table]);
    },
    handleCopy(e) {
      if (this.focused && !this.isCellEditing) {
        e.preventDefault();
        e.clipboardData.setData(
          "text/plain",
          JSON.stringify(ETable.getCopyObj())
        );
      }
    },
    handlePaste(e) {
      if (this.focused && !this.isCellEditing) {
        e.preventDefault();
        ETable.pasteFromObj(JSON.parse(e.clipboardData.getData("text/plain")));
      }
    },
    handleCut(e) {
      if (this.focused && !this.isCellEditing) {
        this.handleCopy(e);
        ETable.clearSelected();
      }
    },
  },
  created() {
    Events.on("keydown", this.keyPress);
    Events.on("mouseup", this.globalMouseUp);
    Events.on("copy", this.handleCopy);
    Events.on("paste", this.handlePaste);
    Events.on("cut", this.handleCut);
  },
  mounted() {
    disableScroll(this.$refs.column_headers_scroll);
    disableScroll(this.$refs.row_headers_scroll);

    ETable.setViewer(this.$refs.table_viewer);
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
