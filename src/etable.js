import Events from "@/events";
import { copyObject } from "@/static";

export let selectionRange = [],
  selection = {},
  isSelecting = false,
  table = {
    default: {
      row: {
        height: 20,
      },
      column: {
        width: 100,
      },
    },
    rows: [],
    columns: [],
    cells: [],
  };

let resizingRowId = -1,
  resizingRowTop = -1,
  resizingColumnId = -1,
  resizingColumnLeft = -1;

function init() {
  Events.on("tablechanged", tableChanged);
  Events.on("mousemove", resizeMove);
  Events.on("mouseup", resizeEnd);
  for (let i = 0; i < 50; i++) {
    table.rows.push(copyObject(table.default.row));
  }
  for (let i = 0; i < 50; i++) {
    table.columns.push(copyObject(table.default.column));
  }
}

function tableChanged(e) {
  table.default = e.table.default;
  table.rows = e.table.rows;
  table.columns = e.table.columns;
  table.cells = e.table.cells;

  for (let i = 0; i < table.rows.length; i++)
    Events.broadcast("rowsizechanged", {
      row: i,
      value: table.rows[i].height,
    });
  for (let i = 0; i < table.columns.length; i++)
    Events.broadcast("columnsizechanged", {
      column: i,
      value: table.columns[i].width,
    });
}

function clearSelected() {
  for (let cell of getSelectedCells())
    setCell(cell.row, cell.column, { content: null });
}

function setCell(row, column, value) {
  table.cells[row][column] = value;
  Events.broadcast("cellchanged", { row, column, value });
}

function getCell(row, column) {
  if (!table.cells[row] || !table.cells[row][column]) {
    if (!table.cells[row]) table.cells[row] = [];
    table.cells[row][column] = {
      content: null,
    };
  }
  return table.cells[row][column];
}

//resize
function rowResizeStart(rowid, e) {
  resizingRowId = rowid;
  resizingRowTop = e.target.parentElement.getBoundingClientRect().top;
}

function columnResizeStart(columnid, e) {
  resizingColumnId = columnid;
  resizingColumnLeft = e.target.parentElement.getBoundingClientRect().left;
}

function resizeMove(e) {
  if (resizingRowId != -1) {
    var height = e.clientY - resizingRowTop;
    if (height > 5) table.rows[resizingRowId].height = height;
    Events.broadcast("rowsizechanged", {
      row: resizingRowId,
      value: height,
    });
  }
  if (resizingColumnId != -1) {
    var width = e.clientX - resizingColumnLeft;
    if (width > 5) table.columns[resizingColumnId].width = width;
    Events.broadcast("columnsizechanged", {
      column: resizingColumnId,
      value: width,
    });
  }
}

function resizeEnd(e) {
  resizingRowId = -1;
  resizingColumnId = -1;
  isSelecting = false;
}

//selection
function selectionStart(e) {
  if (resizingRowId != -1 || resizingColumnId != -1) return;
  if (e.ev.shiftKey) {
    e.move = true;
    selectionMove(e);
    return;
  }
  isSelecting = true;
  if (!e.ev.ctrlKey && !e.ev.shiftKey) clearSelection();
  selectionRange.push({ row: e.row, column: e.column });
  e.index = selectionRange.length;
  selection.start = e;
  Events.broadcast("selectionchanged", null);
}

function selectionMove(e) {
  if (isSelecting || e.move) {
    selection.end = e;
    let minY = Math.min(selection.start.row, e.row);
    let maxY = Math.max(selection.start.row, e.row);
    let minX = Math.min(selection.start.column, e.column);
    let maxX = Math.max(selection.start.column, e.column);
    clearSelection(selection.start.index);
    if (minY == maxY && minX == 0 && maxX == table.columns.length - 1) {
      selectionRange.push({ row: minY });
    } else if (minX == maxX && minY == 0 && maxY == table.rows.length - 1) {
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
}

function clearSelection(index = 0) {
  while (selectionRange.length > index) selectionRange.pop();
}

function selectAll() {
  clearSelection();
  selectionStart({
    row: 0,
    column: 0,
    ev: {},
  });
  selectionRange.push(null);
  isSelecting = false;
  Events.broadcast("selectionchanged", null);
}

function getSelectedCells() {
  let start = selection.start;
  let result = [];
  for (let select of selectionRange) {
    if (select == null) {
      for (let row = 0; row < table.rows.length; row++)
        for (let col = 0; col < table.columns.length; col++)
          result.push({ row, column: col });
      break;
    } else if (select.column == undefined && select.row == start.row) {
      for (let col = 0; col < table.columns.length; col++)
        result.push({ row: start.row, column: col });
    } else if (select.row == undefined && select.column == start.column) {
      for (let row = 0; row < table.rows.length; row++)
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
}

export default {
  init,

  clearSelected,
  getCell,
  setCell,

  rowResizeStart,
  columnResizeStart,
  resizeMove,
  resizeEnd,

  selectionStart,
  selectionMove,
  clearSelection,
  selectAll,
  getSelectedCells,
};
