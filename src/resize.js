let listeners = [];

export function resized() {
  listeners.forEach((obj) => {
    obj.callback(selectionRange);
  });
}

export function onResized(id, callback) {
  listeners.push({
    id,
    callback,
  });
}
