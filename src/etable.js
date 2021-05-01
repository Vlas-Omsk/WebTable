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
  resizingColumnLeft = -1,
  viewer = null;

function init() {
  Events.on("tablechanged", tableChanged);
  Events.on("mousemove", resizeMove);
  Events.on("touchmove", resizeMove);
  Events.on("mouseup", resizeEnd);
  Events.on("touchend", resizeEnd);
  Events.on("touchmove", selectionTouchMove);

  let localTable = localStorage.getItem("table");
  if (localTable) {
    localTable = JSON.parse(localTable);
    Events.broadcast("tablechanged", { table: localTable });
  } else {
    for (let i = 0; i < 50; i++) {
      table.rows.push(copyObject(table.default.row));
    }
    for (let i = 0; i < 50; i++) {
      table.columns.push(copyObject(table.default.column));
    }
  }

  Events.on("tablechanged", moveTableToLocalStorage);
  Events.on("cellchanged", moveTableToLocalStorage);
  Events.on("rowsizechanged", moveTableToLocalStorage);
  Events.on("columnsizechanged", moveTableToLocalStorage);
}

function setViewer(v) {
  viewer = v;
}

function getViewer() {
  return viewer;
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

function moveTableToLocalStorage() {
  localStorage.setItem("table", JSON.stringify(table));
}

// table
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

function addRow(rowid) {
  table.rows.splice(rowid, 0, copyObject(table.default.row));
  table.cells.splice(rowid, 0, []);
  Events.broadcast("cellchanged", {
    predicate(row, column) {
      return row >= rowid;
    },
  });
  for (let i = rowid; i < table.rows.length; i++)
    Events.broadcast("rowsizechanged", {
      row: i,
      value: table.rows[i].height,
    });
}

function deleteRow(rowid) {
  table.rows = table.rows.filter((_, i) => i != rowid);
  table.cells = table.cells.filter((_, i) => i != rowid);
  Events.broadcast("cellchanged", {
    predicate(row, column) {
      return row >= rowid;
    },
  });
  for (let i = rowid; i < table.rows.length; i++)
    Events.broadcast("rowsizechanged", {
      row: i,
      value: table.rows[i].height,
    });
}

function addColumn(columnid) {
  table.columns.splice(columnid, 0, copyObject(table.default.column));
  for (let row = 0; row < table.rows.length; row++) {
    table.cells[row].splice(columnid, 0, { content: null });
  }
  Events.broadcast("cellchanged", {
    predicate(row, column) {
      return column >= columnid;
    },
  });
  for (let i = columnid; i < table.columns.length; i++)
    Events.broadcast("columnsizechanged", {
      column: i,
      value: table.columns[i].width,
    });
}

function deleteColumn(columnid) {
  table.columns = table.columns.filter((_, i) => i != columnid);
  for (let row = 0; row < table.rows.length; row++) {
    table.cells[row] = table.cells[row].filter((_, i) => i != columnid);
  }
  Events.broadcast("cellchanged", {
    predicate(row, column) {
      return column >= columnid;
    },
  });
  for (let i = columnid; i < table.columns.length; i++)
    Events.broadcast("columnsizechanged", {
      column: i,
      value: table.columns[i].width,
    });
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
    var height =
      (e.clientY ? e.clientY : e.touches[0].clientY) - resizingRowTop;
    if (height > 5) table.rows[resizingRowId].height = height;
    Events.broadcast("rowsizechanged", {
      row: resizingRowId,
      value: height,
    });
  }
  if (resizingColumnId != -1) {
    var width =
      (e.clientX ? e.clientX : e.touches[0].clientX) - resizingColumnLeft;
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

function selectionTouchMove(e) {
  let component = document.elementFromPoint(
    e.touches[0].clientX,
    e.touches[0].clientY
  );
  if (!component || !isSelecting) return;
  component = component.__vue__;
  if (!component) return;

  if (component.$options._componentTag == "Cell")
    selectionMove({
      row: component.rowid,
      column: component.columnid,
      ev: e,
    });
  else if (component.$options._componentTag == "RowHeader")
    selectionMove({
      row: component.rowid,
      column: table.columns.length - 1,
      ev: e,
    });
  else if (component.$options._componentTag == "ColumnHeader")
    selectionMove({
      row: table.rows.length - 1,
      column: component.columnid,
      ev: e,
    });
}

function clearSelection(index = 0, usererender = false) {
  while (selectionRange.length > index) selectionRange.pop();
  if (usererender == true) Events.broadcast("selectionchanged", null);
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

//clipboard
const clipboard = { value: null, __value: null };

if (navigator.clipboard) {
  Object.defineProperty(clipboard, "value", {
    get() {
      return navigator.clipboard.readText();
    },
    set(text) {
      navigator.clipboard.writeText(text).then(null, function() {
        console.log("clipboard write failed");
      });
    },
  });
} else {
  Object.defineProperty(clipboard, "value", {
    get() {
      return new Promise((resolve, reject) => resolve(clipboard.__value));
    },
    set(text) {
      clipboard.__value = text;
    },
  });
}

function copyCell(start, row, column, cpb) {
  if (!table.cells[row][column]) return;
  cpb.cells.push({
    row: row - start.row,
    column: column - start.column,
    cell: table.cells[row][column],
  });
}

function getCopyObj() {
  let cpb = { cells: [] };
  let start = selection.start;
  for (let cell of getSelectedCells())
    copyCell(start, cell.row, cell.column, cpb);
  return cpb;
}

function copy() {
  clipboard.value = JSON.stringify(getCopyObj());
}

function pasteCell(start, row, column, cell) {
  while (table.rows.length <= start.row + row)
    table.rows.push(copyObject(table.default.row));
  while (table.columns.length <= start.column + column)
    table.columns.push(copyObject(table.default.column));
  if (!table.cells[start.row + row]) table.cells[start.row + row] = [];
  setCell(start.row + row, start.column + column, cell);
  selectionRange.push({
    row: start.row + row,
    column: start.column + column,
  });
}

function pasteFromObj(cpb) {
  if (!selection.start || !cpb || !cpb.cells) return;
  clearSelection(0);
  for (let data of cpb.cells) {
    pasteCell(selection.start, data.row, data.column, data.cell);
  }
  Events.broadcast("selectionchanged", null);
}

function paste() {
  clipboard.value.then((value) => {
    pasteFromObj(JSON.parse(value));
  });
}

function cut() {
  copy();
  clearSelected();
}

export default {
  setViewer,
  getViewer,
  init,

  clearSelected,
  getCell,
  setCell,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn,

  rowResizeStart,
  columnResizeStart,
  resizeMove,
  resizeEnd,

  selectionStart,
  selectionMove,
  clearSelection,
  selectAll,
  getSelectedCells,

  getCopyObj,
  pasteFromObj,
  copy,
  paste,
  cut,
};
