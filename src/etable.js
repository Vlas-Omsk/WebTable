import Events from "@/events";
import { copyObject } from "@/static";

export let selectionMap,
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
  clearSelection();

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
function setMap(row, column) {
  if (row == null) selectionMap.columns[column] = true;
  if (column == null) selectionMap.rows[row] = true;
  if (!selectionMap.cells[row]) selectionMap.cells[row] = [];
  return (selectionMap.cells[row][column] = true);
}

function selectionStart(e) {
  if (resizingRowId != -1 || resizingColumnId != -1) return;
  if (e.ev.shiftKey) {
    e.move = true;
    selectionMove(e);
    return;
  }
  isSelecting = true;
  if (!e.ev.ctrlKey && !e.ev.shiftKey) clearSelection();
  setMap(e.row, e.column);
  e.savedState = copyObject(selectionMap);
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
    clearSelection(selection.start.savedState);
    if (minY == maxY && minX == 0 && maxX == table.columns.length - 1) {
      setMap(minY, null);
    } else if (minX == maxX && minY == 0 && maxY == table.rows.length - 1) {
      setMap(null, minX);
    } else {
      for (let row = minY; row <= maxY; row++)
        for (let col = minX; col <= maxX; col++) setMap(row, col);
    }
    Events.broadcast("selectionchanged", null);
  }
}

function clearSelection(savedState = null) {
  if (savedState) selectionMap = copyObject(savedState);
  else selectionMap = { all: false, rows: [], columns: [], cells: [] };
}

function selectAll() {
  clearSelection();
  selectionStart({
    row: 0,
    column: 0,
    ev: {},
  });
  selectionMap.all = true;
  isSelecting = false;
  Events.broadcast("selectionchanged", null);
}

function isSelected(row, column) {
  if (
    row < 0 ||
    row >= table.rows.length ||
    column < 0 ||
    column >= table.columns.length
  )
    return false;

  if (selectionMap.all == true) return true;
  else {
    if (selectionMap.rows[row] == true) return true;
    else if (selectionMap.columns[column] == true) return true;
    else if (selectionMap.cells[row] && selectionMap.cells[row][column] == true)
      return true;
  }

  return false;
}

function getSelectedCells() {
  let result = [];
  for (let row = 0; row < table.rows.length; row++) {
    for (let col = 0; col < table.columns.length; col++) {
      if (isSelected(row, col)) result.push({ row, column: col });
    }
  }

  return result;
}

export default {
  init,

  setMap,

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
  isSelected,
  getSelectedCells,
};
