<template>
  <div
    class="cell"
    ref="editor"
    @keydown="onKeyPress"
    @blur="onUnfocus"
    @dblclick="onFocus(false)"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    :contenteditable="isEditing"
    :class="{ 'cell-editing': isEditing }"
    :style="selectionStyle"
    autofocus
  >
    <div class="cell__editor">
      <div>{{ cell.content ? cell.content : " " }}</div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";

export default {
  props: {
    table: {
      type: Object,
      required: true,
    },
    cell: {
      type: Object,
      required: true,
    },
    selection: {
      type: Object,
      required: true,
    },
    selectionMap: {
      type: Object,
      required: true,
    },
    rowid: {
      type: Number,
      required: true,
    },
    columnid: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isEditing: false,
    };
  },
  computed: {
    selectionStyle() {
      if (!this.isSelected(this.rowid, this.columnid)) return;
      let result = { "box-sizing": "border-box" };
      let border = "2px solid green";
      if (!this.isSelected(this.rowid - 1, this.columnid))
        result.borderTop = border;
      if (!this.isSelected(this.rowid, this.columnid + 1))
        result.borderRight = border;
      if (!this.isSelected(this.rowid + 1, this.columnid))
        result.borderBottom = border;
      if (!this.isSelected(this.rowid, this.columnid - 1))
        result.borderLeft = border;
      if (!this.isStartCell()) result.background = "lightgrey";
      return result;
    },
  },
  methods: {
    onMouseDown(e) {
      this.$emit("selectionStart", {
        row: this.rowid,
        column: this.columnid,
        ev: e,
      });
    },
    onMouseMove(e) {
      this.$emit("selectionMove", {
        row: this.rowid,
        column: this.columnid,
        ev: e,
      });
    },
    onMouseUp(e) {
      this.$emit("selectionEnd", {
        row: this.rowid,
        column: this.columnid,
        ev: e,
      });
    },
    onFocus(movetoend = false) {
      this.isEditing = true;
      this.$emit("startEditing");
      setTimeout(() => {
        this.$refs.editor.focus();
        this.selectElementContents(this.$refs.editor, movetoend);
      }, 10);
    },
    onUnfocus(e) {
      this.cell.content = e.target.innerText;
      this.isEditing = false;
    },
    onKeyPress(e) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.isEditing = false;
        return;
      }
    },
    isLetter(str) {
      return (
        str.length === 1 &&
        (str.match(/\d|\w|[а-яА-Я]/i) ||
          [
            "_",
            "-",
            "+",
            "=",
            "!",
            "@",
            "#",
            "$",
            "%",
            "^",
            "&",
            "*",
            "(",
            ")",
            "|",
            "\\",
            "[",
            "]",
            "{",
            "}",
            ",",
            ".",
            "?",
            "`",
            "~",
            "'",
            '"',
            ":",
            ";",
            "<",
            ">",
          ].indexOf(str) != -1)
      );
    },
    globalKeyPress(e) {
      if (
        !e.ctrlKey &&
        this.isLetter(e.key) &&
        !this.isEditing &&
        this.isSelected(this.rowid, this.columnid) &&
        this.isStartCell()
      ) {
        this.cell.content = this.cell.content
          ? this.cell.content + e.key
          : e.key;
        this.onFocus(true);
      }
    },
    selectElementContents(el, movetoend) {
      var range = document.createRange();
      range.selectNodeContents(el);
      if (movetoend) range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    isStartCell() {
      return (
        this.selection.start.row == this.rowid &&
        this.selection.start.column == this.columnid
      );
    },
    isSelected(row, column) {
      if (
        row < 0 ||
        row >= this.table.rows.length ||
        column < 0 ||
        column >= this.table.columns.length
      )
        return false;
      if (this.selectionMap.all == true) return true;
      else if (this.selectionMap.rows[row] == true) return true;
      else if (this.selectionMap.columns[column] == true) return true;
      else if (
        this.selectionMap.cells[row] &&
        this.selectionMap.cells[row][column] == true
      )
        return true;
      return false;
    },
  },
  created() {
    Events.on("keydown", this.globalKeyPress);
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
  &__editor {
    white-space: pre-wrap;
    word-break: break-word;
    border: none;
    padding: 0;
    resize: none;
  }
}
</style>
