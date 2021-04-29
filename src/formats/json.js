import Events from "@/events";
import ETable from "@/etable";
import { table } from "@/etable";

function save() {
  downloadURI(
    "data:application/json," + encodeURIComponent(JSON.stringify(table)),
    "table.json"
  );
}

let input = document.createElement("input");
input.type = "file";
input.onchange = (e) => {
  let file = e.target.files[0];
  let reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = (readerEvent) => {
    let table = JSON.parse(readerEvent.target.result);
    Events.broadcast("tablechanged", { table });
  };
};
function load() {
  input.click();
}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  save,
  load,
};
