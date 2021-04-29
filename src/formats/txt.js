function generateTextTable(table) {
  let result = "";
  for (let rowid = 0; rowid < table.rows.length; rowid++) {
    let row = table.rows[rowid];
    let line = [];
    for (let columnid = 0; columnid < table.columns.length; columnid++) {
      let column = table.columns[columnid];
      let columnwidth = column.width / 6.5;
      let words = [];
      if (table.cells[rowid][columnid].content) {
        let tempwords = [];
        let ind = 0;
        for (let i = 0; i < table.cells[rowid][columnid].content.length; i++) {
          let ch = table.cells[rowid][columnid].content[i];
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

      if (columnid == table.columns.length - 1) {
        if (rowid == 0) {
          result += "┬";
          for (let i = 0; i < columnwidth; i++) result += "─";
          result += "┐\r\n";
        } else if (rowid == table.rows.length - 1) {
          result += "┴";
          for (let i = 0; i < columnwidth; i++) result += "─";
          result += "┘";
        } else {
          result += "┼";
          for (let i = 0; i < columnwidth; i++) result += "─";
          result += "┤\r\n";
        }
      } else {
        if (columnid == 0) {
          if (rowid == 0) {
            result += "┌";
          } else if (rowid == table.rows.length - 1) {
            result += "└";
          } else {
            result += "├";
          }
        } else {
          if (rowid == 0) {
            result += "┬";
          } else if (rowid == table.rows.length - 1) {
            result += "┴";
          } else {
            result += "┼";
          }
        }
        for (let i = 0; i < columnwidth; i++) result += "─";
      }
      for (var word of words) {
        if (!cell[index]) cell[index] = "";
        if ((cell[index] + word).length > columnwidth + 1 || word == "\n")
          index++;
        if (!cell[index]) cell[index] = "";
        if (word != "\n") cell[index] += word;
      }
      line[columnid] = { cell, columnwidth };
    }

    if (rowid == table.rows.length - 1) break;
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
        let leftoffset = Math.ceil((col.columnwidth - cellline.length) / 2);
        result += "│";
        for (let i = 0; i < leftoffset; i++) result += " ";
        result += cellline;
        for (let i = 0; i < col.columnwidth - leftoffset - cellline.length; i++)
          result += " ";
      }
      result += "│\r\n";
    }
  }
  return result;
}

export default {
  generateTextTable,
};
