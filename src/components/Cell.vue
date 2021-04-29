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
    autofocus
  >
    <div class="cell__editor">
      <div ref="editor_content">{{ content }}</div>
    </div>
  </div>
</template>

<script>
import Events from "@/events";
import { selectionRange } from "@/events";

export default {
  props: {
    table: {
      type: Object,
      required: true,
    },
    selection: {
      type: Object,
      required: true,
    },
    // selectionMap: {
    //   type: Array,
    //   required: true,
    // },
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
    };
  },
  methods: {
    onMouseDown(e) {
      if (!this.isEditing)
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
      this.updateContent(this.content);
      this.isEditing = false;
    },
    onKeyPress(e) {
      if (e.code === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.updateContent(this.content);
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
    getCell() {
      if (
        !this.table.cells[this.rowid] ||
        !this.table.cells[this.rowid][this.columnid]
      ) {
        if (!this.table.cells[this.rowid]) this.table.cells[this.rowid] = [];
        this.table.cells[this.rowid][this.columnid] = {
          content: null,
        };
      }
      return this.table.cells[this.rowid][this.columnid];
    },
    globalKeyPress(e) {
      if (!this.focused) {
        return;
      }
      if (
        !e.ctrlKey &&
        this.isLetter(e.key) &&
        !this.isEditing &&
        this.isSelected(this.rowid, this.columnid) &&
        this.isStartCell()
      ) {
        this.content = this.content ? this.content + e.key : e.key;
        this.onFocus(true);
      }
    },
    updateContent() {
      this.getCell().content = this.$refs.editor_content.innerText.trim();
      Events.broadcast("tablechanged", null);
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
  },
  created() {
    Events.on("keydown", this.globalKeyPress);
    Events.on("selectionchanged", this.onSelectionSelectionChanged);
    Events.on("cellchanged", (e) => {
      if (e.row == this.rowid && e.column == this.columnid)
        this.content = e.value.content;
    });
    Events.on(
      "aftertableloaded",
      () => (this.content = this.getCell().content)
    );
  },
  mounted() {
    this.content = this.getCell().content;
    this.onSelectionSelectionChanged();
  },
  destroyed() {
    Events.off("selectionchanged", this.onSelectionSelectionChanged);
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
