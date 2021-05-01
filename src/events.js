let events = {
  mouseup: [],
  mousemove: [],
  mousedown: [],
  keydown: [],
  touchstart: [],
  touchmove: [],
  touchend: [],
  copy: [],
  paste: [],
  cut: [],

  //
  selectionchanged: [],
  rowsizechanged: [],
  columnsizechanged: [],
  cellchanged: [],
  tablechanged: [],

  //
  configchanged: [],
  openpopup: [],
  closepopup: [],
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
  //setTimeout(() => {
  events[event].forEach((callback) => callback && callback(evObject));
  //});
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
document.addEventListener("touchstart", function(e) {
  broadcast("touchstart", e);
});
document.addEventListener("touchmove", function(e) {
  broadcast("touchmove", e);
});
document.addEventListener("touchend", function(e) {
  broadcast("touchend", e);
});
document.addEventListener("copy", function(e) {
  broadcast("copy", e);
});
document.addEventListener("paste", function(e) {
  broadcast("paste", e);
});
document.addEventListener("cut", function(e) {
  broadcast("cut", e);
});
document.addEventListener("load", function(e) {
  broadcast("load", e);
});

export default {
  on,
  off,
  clear,
  broadcast,
};
