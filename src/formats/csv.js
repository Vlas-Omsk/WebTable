import Events from "@/events";
import { table } from "@/etable";
import ETable from "@/etable";
import { copyObject } from "@/static";

const eol = "\n";
const escape_symbols = ['"', "\r", "\n"];

function getString(delimiter) {
  let result = "";
  for (let rowid = 0; rowid < table.rows.length; rowid++) {
    for (let columnid = 0; columnid < table.columns.length; columnid++) {
      let content = ETable.getCell(rowid, columnid).content;
      if (
        content &&
        (Array.from(content).filter((ch) => escape_symbols.indexOf(ch) != -1)
          .length != 0 ||
          content.indexOf(delimiter) != -1)
      ) {
        content = content.replace('"', '""');
        result += '"' + content + '"';
      } else {
        result += content ? content : "";
      }
      if (columnid != table.columns.length - 1) result += delimiter;
    }
    if (rowid != table.rows.length - 1) result += eol;
  }
  return result;
}

function load(delimiter, content, name, table_default) {
  let table = {
    name,
    default: table_default,
    rows: [],
    columns: [],
    cells: [[{ content: "" }]],
  };
  let columnid = 0,
    rowid = 0,
    inBrackets = false;

  for (let ch = 0; ch < content.length; ch++) {
    if (content[ch] == '"') {
      if (!inBrackets) inBrackets = true;
      else if (inBrackets) {
        if (content[ch + 1] == '"') {
          ch++;
          table.cells[rowid][columnid].content += '"';
        } else {
          inBrackets = false;
        }
      }
    } else if (
      ch + delimiter.length <= content.length &&
      content.substr(ch, delimiter.length) == delimiter &&
      inBrackets == false
    ) {
      ch += delimiter.length - 1;
      table.cells[rowid][++columnid] = { content: "" };
    } else if (content[ch] == "\n" && inBrackets == false) {
      table.cells[++rowid] = [{ content: "" }];
      columnid = 0;
    } else {
      table.cells[rowid][columnid].content += content[ch];
    }
  }

  for (let row of table.cells) {
    while (table.columns.length < row.length)
      table.columns.push(copyObject(table.default.column));
    table.rows.push(copyObject(table.default.row));
  }

  Events.broadcast("tablechanged", { table });
}

// function loadOld(delimiter, content, name, table_default) {
//   let lines = content.split("\n");
//   let table = {
//     name,
//     default: table_default,
//     rows: [],
//     columns: [],
//     cells: [],
//   };

//   for (let lineid = 0; lineid < lines.length; lineid++) {
//     let line = lines[lineid];
//     let inBrackets = false;
//     let cells = [""];
//     let cellidx = 0;

//     for (let ch = 0; ch < line.length; ch++) {
//       if (line[ch] == '"') {
//         if (!inBrackets) inBrackets = true;
//         else if (inBrackets) {
//           if (line[ch + 1] == '"') {
//             ch++;
//             cells[cellidx] += '"';
//           } else {
//             inBrackets = false;
//           }
//         }
//       } else if (line[ch] == delimiter && inBrackets == false) {
//         cells[++cellidx] = "";
//       } else {
//         cells[cellidx] += line[ch];
//       }
//     }

//     table.rows.push(copyObject(table.default.row));
//     let idx = table.cells.push([]) - 1;
//     for (let cell of cells) table.cells[idx].push({ content: cell });
//   }

//   let columns = 0;
//   for (let row of table.cells) if (row.length > columns) columns = row.length;
//   for (let col = 0; col < columns; col++)
//     table.columns.push(copyObject(table.default.column));

//   Events.broadcast("tablechanged", { table });
// }

export default {
  getString,
  load,
};
