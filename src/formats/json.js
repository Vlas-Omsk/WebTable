import Events from "@/events";
import { table } from "@/etable";

function getString() {
  return JSON.stringify(table);
}

function load(content) {
  Events.broadcast("tablechanged", { table: JSON.parse(content) });
}

export default {
  getString,
  load,
};
