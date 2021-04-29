<template>
  <div
    class="cell"
    ref="editor"
    @keydown="onKeyPress"
    @blur="onUnfocus"
    @dblclick="onFocus(false)"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    :class="{ 'cell-editing': isEditing }"
    :contenteditable="isEditing"
    autofocus
    v-text="content"
  ></div>
</template>

<script>
import Events from "@/events";
import { selectionRange, selection, table } from "@/etable";
import { disableScroll, enableScroll } from "@/static";
import ETable from "@/etable";
import { isLetter, selectElementContents, isOnVisibleSpace } from "@/static";

export default {
  props: {
    rowid: {
      type: Number,
      required: true,
    },
    columnid: {
      type: Number,
      required: true,
    },
    focused: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
      content: null,
      isTouchEnd: false,
    };
  },
  methods: {
    onMouseDown(e) {
      if (!this.isEditing)
        ETable.selectionStart({
          row: this.rowid,
          column: this.columnid,
          ev: e,
        });
    },
    onMouseMove(e) {
      ETable.selectionMove({
        row: this.rowid,
        column: this.columnid,
        ev: e,
      });
    },
    onTouchStart(e) {
      this.isTouchEnd = false;
      let scrollOffset = {
        top: ETable.getViewer().scrollTop,
        left: ETable.getViewer().scrollLeft,
      };
      setTimeout(() => {
        let top = ETable.getViewer().scrollTop,
          left = ETable.getViewer().scrollLeft;
        if (this.isTouchEnd == true) return;
        if (
          scrollOffset.top + 10 >= top &&
          scrollOffset.top - 10 <= top &&
          scrollOffset.left + 10 >= left &&
          scrollOffset.left - 10 <= left
        ) {
          disableScroll(ETable.getViewer());
          this.onMouseDown(e);
        }
      }, 500);
    },
    onTouchEnd(e) {
      this.isTouchEnd = true;
      enableScroll(ETable.getViewer());
    },
    onFocus(movetoend = false) {
      this.isEditing = true;
      selectionRange.unshift({ row: this.rowid, column: this.columnid });
      ETable.clearSelection(1, true);
      ETable.setAnyCellEditig(true);
      setTimeout(() => {
        this.$refs.editor.focus();
        selectElementContents(this.$refs.editor, movetoend);
      }, 10);
    },
    onUnfocus(e) {
      ETable.setAnyCellEditig(false);
      this.updateContent();
      this.isEditing = false;
    },
    onKeyPress(e) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.updateContent();
        this.isEditing = false;
        return;
      }
    },
    getCell() {
      return ETable.getCell(this.rowid, this.columnid);
    },
    globalKeyPress(e) {
      if (!this.focused) {
        return;
      }
      if (
        !e.ctrlKey &&
        isLetter(e.key) &&
        !this.isEditing &&
        this.isSelected(this.rowid, this.columnid) &&
        this.isStartCell()
      ) {
        this.content = this.content ? this.content + e.key : e.key;
        this.onFocus(true);
      }
    },
    updateContent() {
      this.content = this.$refs.editor.innerText;
      this.getCell().content = this.content;
      Events.broadcast("cellchanged", {});
    },
    isStartCell() {
      return (
        selection.start.row == this.rowid &&
        selection.start.column == this.columnid
      );
    },
    isSelected(row, column) {
      if (
        row < 0 ||
        row >= table.rows.length ||
        column < 0 ||
        column >= table.columns.length
      )
        return false;

      for (let select of selectionRange) {
        if (select == null) return true;
        else if (select.column == undefined && select.row == row) return true;
        else if (select.row == undefined && select.column == column)
          return true;
        else if (select.row == row && select.column == column) return true;
        else if (
          select.startColumn <= column &&
          select.endColumn >= column &&
          select.startRow <= row &&
          select.endRow >= row
        )
          return true;
      }
      return false;
    },
    onSelectionSelectionChanged() {
      if (!this.$refs.editor) return;
      //if (!isOnVisibleSpace(this.$refs.editor)) return;
      if (!this.isSelected(this.rowid, this.columnid)) {
        this.$refs.editor.style.border = null;
        this.$refs.editor.style.boxSizing = null;
        this.$refs.editor.style.background = null;
        return;
      }
      this.$refs.editor.style.boxSizing = "border-box";
      let border = "2px solid green";
      if (!this.isSelected(this.rowid - 1, this.columnid))
        this.$refs.editor.style.borderTop = border;
      else this.$refs.editor.style.borderTop = null;
      if (!this.isSelected(this.rowid, this.columnid + 1))
        this.$refs.editor.style.borderRight = border;
      else this.$refs.editor.style.borderRight = null;
      if (!this.isSelected(this.rowid + 1, this.columnid))
        this.$refs.editor.style.borderBottom = border;
      else this.$refs.editor.style.borderBottom = null;
      if (!this.isSelected(this.rowid, this.columnid - 1))
        this.$refs.editor.style.borderLeft = border;
      else this.$refs.editor.style.borderLeft = null;
      if (!this.isStartCell()) this.$refs.editor.style.background = "lightgrey";
      else this.$refs.editor.style.background = null;
    },
    columnsizechanged(e) {
      if (e.column == this.columnid && this.$refs.editor) {
        this.$refs.editor.style.width = e.value + "px";
      }
    },
    cellchanged(e) {
      if (e.row == this.rowid && e.column == this.columnid) {
        this.content = e.value.content;
      }
    },
    tablechanged(e) {
      this.content = this.getCell().content;
    },
  },
  created() {
    Events.on("columnsizechanged", this.columnsizechanged);
    Events.on("keydown", this.globalKeyPress);
    Events.on("selectionchanged", this.onSelectionSelectionChanged);
    Events.on("cellchanged", this.cellchanged);
    Events.on("tablechanged", this.tablechanged);
  },
  mounted() {
    this.columnsizechanged({
      column: this.columnid,
      value: table.columns[this.columnid].width,
    });

    this.content = this.getCell().content;
    this.onSelectionSelectionChanged();

    this.$refs.editor.addEventListener("touchstart", this.onTouchStart);
    this.$refs.editor.addEventListener("touchend", this.onTouchEnd);
  },
};
</script>

<style lang="scss" scoped>
.cell {
  width: 100%;
  height: 100%;
  cursor: cell;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  overflow: hidden;

  &-editing {
    cursor: text;
  }

  white-space: pre-wrap;
  word-break: break-word;
  border: none;
  padding: 0;
  resize: none;
}
</style>
