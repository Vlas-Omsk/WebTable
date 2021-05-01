import Events from "@/events";

let cfg = {};

load();
Events.on("configchanged", save);

function save() {
  localStorage.setItem("config", JSON.stringify(cfg));
}

function load() {
  let json = JSON.parse(localStorage.getItem("config"));
  if (json) cfg = json;
  changed();
}

function set(name, value) {
  cfg[name] = value;
  changed();
}

function get(name) {
  return cfg[name];
}

function changed() {
  Events.broadcast("configchanged", cfg);
}

function onchanged(callback) {
  Events.on("configchanged", callback);
  callback(cfg);
}

export default { set, get, save, load, changed, onchanged };
