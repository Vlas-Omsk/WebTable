export let selectionRange = [];

let events = {
  mouseup: [],
  mousemove: [],
  mousedown: [],
  keydown: [],
  selectionchanged: [],
  callfunction: [],
  tablechanged: [],
  tableloaded: [],
  aftertableloaded: [],
  openpopup: [],
  closepopup: [],
  cellchanged: [],
};

function on(event, callback) {
  if (events[event]) events[event].push(callback);
}
function off(event, callback) {
  events[event].filter((cb) => cb !== callback);
}
function clear() {
  for (let e in events) events[e] = [];
}
function broadcast(event, evObject) {
  events[event].forEach((callback) => callback && callback(evObject));
}

document.addEventListener("mousemove", function(e) {
  broadcast("mousemove", e);
});
document.addEventListener("mouseup", function(e) {
  broadcast("mouseup", e);
});
document.addEventListener("mousedown", function(e) {
  broadcast("mousedown", e);
});
document.addEventListener("keydown", function(e) {
  broadcast("keydown", e);
});

export default {
  on,
  off,
  clear,
  broadcast,
};
