var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

function letterByNum(num) {
  return String.fromCharCode(65 + num);
}

export function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function numToLetters(num) {
  let nums = [0];
  for (let o = 1; o <= num; o++) {
    nums[0] += 1;
    for (let ind = 0; ind < nums.length; ind++) {
      if (nums[ind] > 25) {
        if (nums.length > ind + 1) nums[ind + 1] += 1;
        else nums[ind + 1] = 0;
        nums[ind] = 0;
      }
    }
  }
  let result = "";
  for (let num of nums) {
    result = letterByNum(num) + result;
  }
  return result;
}

export function isLetter(str) {
  return (
    str.length === 1 &&
    (str.match(/\d|\w|[а-яА-Я]/i) ||
      [
        "_",
        "-",
        "+",
        "=",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "|",
        "\\",
        "/",
        "[",
        "]",
        "{",
        "}",
        ",",
        ".",
        "?",
        "`",
        "~",
        "'",
        '"',
        ":",
        ";",
        "<",
        ">",
      ].indexOf(str) != -1)
  );
}

export function selectElementContents(el, movetoend) {
  var range = document.createRange();
  range.selectNodeContents(el);
  if (movetoend) range.collapse(false);
  var sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

export function disableScroll(el) {
  el.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  el.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  el.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  el.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function enableScroll(el) {
  el.removeEventListener("DOMMouseScroll", preventDefault, false); // older FF
  el.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  el.removeEventListener("touchmove", preventDefault, wheelOpt); // mobile
  el.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

export function isAnyParentContains(source, parents) {
  while (parents.indexOf(source) == -1 && source) {
    source = source.parentElement;
  }
  if (!source) return false;
  return true;
}

export function isOnVisibleSpace(element) {
  var bodyHeight = window.innerHeight;
  var bodyWidth = window.innerWidth;
  var elemRect = element.getBoundingClientRect();
  if (
    elemRect.bottom < 0 ||
    elemRect.top > bodyHeight ||
    elemRect.right < 0 ||
    elemRect.left > bodyWidth
  )
    return false;
  return true;
}
