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
  switch (num + 1) {
    case 1:
      return "A";
    case 2:
      return "B";
    case 3:
      return "C";
    case 4:
      return "D";
    case 5:
      return "E";
    case 6:
      return "F";
    case 7:
      return "G";
    case 8:
      return "H";
    case 9:
      return "I";
    case 10:
      return "J";
    case 11:
      return "K";
    case 12:
      return "L";
    case 13:
      return "M";
    case 14:
      return "N";
    case 15:
      return "O";
    case 16:
      return "P";
    case 17:
      return "Q";
    case 18:
      return "R";
    case 19:
      return "S";
    case 20:
      return "T";
    case 21:
      return "U";
    case 22:
      return "V";
    case 23:
      return "W";
    case 24:
      return "X";
    case 25:
      return "Y";
    case 26:
      return "Z";
  }
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
  var elemRect = element.getClientRects()[0];
  if (
    elemRect.bottom < 0 ||
    elemRect.top > bodyHeight ||
    elemRect.right < 0 ||
    elemRect.left > bodyWidth
  )
    return false;
  return true;
}
