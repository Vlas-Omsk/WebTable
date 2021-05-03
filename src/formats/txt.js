import ETable from "@/etable";
import { table, selectionRange } from "@/etable";

const eol = "\n";
const invisible_symbols = ["\r", "\n"];

function getLength(text) {
  let length = 0;
  for (let ch of text) if (invisible_symbols.indexOf(ch) == -1) length++;
  return length;
}

function generateTextTable(symbols, useSelect = false) {
  let result = "";
  function generateLine(width, symbol) {
    for (let i = 0; i < width; i++) result += symbol;
  }
  let selectionRect;
  if (useSelect == true && selectionRange.length > 0) {
    selectionRect = {
      startRow: selectionRange[0].row,
      endRow: selectionRange[0].row,
      startColumn: selectionRange[0].column,
      endColumn: selectionRange[0].column,
    };
    if (selectionRange.length >= 2) {
      let select = selectionRange[1];
      if (select == null) {
        selectionRect = {
          startRow: 0,
          endRow: table.rows.length - 1,
          startColumn: 0,
          endColumn: table.columns.length - 1,
        };
      } else if (select.column == undefined && select.row != undefined) {
        selectionRect = {
          startRow: select.row,
          endRow: select.row,
          startColumn: 0,
          endColumn: table.columns.length - 1,
        };
      } else if (select.row == undefined && select.column != undefined) {
        selectionRect = {
          startRow: 0,
          endRow: table.rows.length - 1,
          startColumn: select.column,
          endColumn: select.column,
        };
      } else if (select.row != undefined && select.column != undefined) {
        selectionRect = {
          startRow: select.row,
          endRow: select.row,
          startColumn: select.column,
          endColumn: select.column,
        };
      } else {
        selectionRect = select;
      }
    }
  } else {
    selectionRect = {
      startRow: 0,
      endRow: table.rows.length - 1,
      startColumn: 0,
      endColumn: table.columns.length - 1,
    };
  }
  for (
    let rowid = selectionRect.startRow;
    rowid <= selectionRect.endRow;
    rowid++
  ) {
    let row = table.rows[rowid];
    let line = [];
    for (
      let columnid = selectionRect.startColumn;
      columnid <= selectionRect.endColumn;
      columnid++
    ) {
      let column = table.columns[columnid];
      let columnwidth = column.width / 6.5;
      let words = [];
      let ocell = ETable.getCell(rowid, columnid);
      if (ocell.content) {
        let tempwords = [];
        let ind = 0;
        for (let i = 0; i < ocell.content.length; i++) {
          let ch = ocell.content[i];
          if (!tempwords[ind]) tempwords[ind] = "";
          if (ch == " ") tempwords[ind++] += ch;
          else if (ch == "\n") tempwords[ind++] += ch;
          else {
            tempwords[ind] += ch;
          }
        }
        let wordind = 0;
        for (let wind = 0; wind < tempwords.length; wind++) {
          let w = tempwords[wind];
          if (w.length > columnwidth || w.indexOf("\n") != -1) {
            if (!words[wordind]) words[wordind] = "";
            if (
              w.indexOf("\n") != -1 &&
              (words[wordind] + w).length > columnwidth
            ) {
              wordind++;
            }
            for (let ch of w) {
              if (ch == "\n") {
                words[++wordind] = "\n";
                wordind++;
              }
              if (!words[wordind]) words[wordind] = "";
              if (words[wordind].length > columnwidth) wordind++;
              if (!words[wordind]) words[wordind] = "";
              if (ch != "\n") words[wordind] += ch;
            }
          } else {
            if (!words[wordind]) words[wordind] = "";
            if ((words[wordind] + w).length > columnwidth) wordind++;
            if (!words[wordind]) words[wordind] = "";
            words[wordind] += w;
          }
        }
      }
      let cell = [];
      let index = 0;

      if (columnid == selectionRect.endColumn) {
        if (rowid == selectionRect.startRow) {
          if (columnid == selectionRect.startColumn) result += symbols[2];
          else result += symbols[3];
          generateLine(columnwidth, symbols[0]);
          result += symbols[4] + eol;
        } else {
          if (columnid == selectionRect.startColumn) result += symbols[5];
          else result += symbols[6];
          generateLine(columnwidth, symbols[0]);
          result += symbols[7] + eol;
        }
      } else {
        if (columnid == selectionRect.startColumn) {
          if (rowid == selectionRect.startRow) {
            result += symbols[2];
          } else {
            result += symbols[5];
          }
        } else {
          if (rowid == selectionRect.startRow) {
            result += symbols[3];
          } else {
            result += symbols[6];
          }
        }
        generateLine(columnwidth, symbols[0]);
      }
      for (var word of words) {
        if (!cell[index]) cell[index] = "";
        if ((cell[index] + word).length > columnwidth + 1 || word == "\n")
          index++;
        if (!cell[index]) cell[index] = "";
        if (word != "\n") cell[index] += word;
      }
      line[columnid - selectionRect.startColumn] = { cell, columnwidth };
    }

    //cell draw
    let maxheight = 0;
    for (let col of line)
      if (col.cell.length > maxheight) maxheight = col.cell.length;

    for (let lineind = 0; lineind < maxheight; lineind++) {
      for (let col of line) {
        let topoffset = Math.ceil((maxheight - col.cell.length) / 2);
        let cellline = "";
        if (lineind >= topoffset && col.cell[lineind - topoffset])
          cellline = col.cell[lineind - topoffset];
        let leftoffset = Math.ceil((col.columnwidth - getLength(cellline)) / 2);
        result += symbols[1];
        generateLine(leftoffset, symbols[11]);
        result += cellline;
        generateLine(
          col.columnwidth - leftoffset - getLength(cellline),
          symbols[11]
        );
      }
      result += symbols[1] + eol;
    }

    if (rowid == selectionRect.endRow) {
      for (let col = 0; col < line.length; col++) {
        if (col == 0) {
          result += symbols[8];
          generateLine(line[col].columnwidth, symbols[12]);
          if (col == line.length - 1) result += symbols[10];
        } else if (col == line.length - 1) {
          result += symbols[9];
          generateLine(line[col].columnwidth, symbols[12]);
          result += symbols[10];
        } else {
          result += symbols[9];
          generateLine(line[col].columnwidth, symbols[12]);
        }
      }
    }
  }
  return result;
}

export default {
  generateTextTable,
};
