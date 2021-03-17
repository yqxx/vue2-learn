import VNode from "../code/vdom/vnode";
import patch from "../code/vdom/patch";

const createVNode = function (tag, children) {
  return new VNode(tag, children, null);
};

const createTextVNode = function (text) {
  return new VNode(null, [], text);
};

var ul = createVNode("ul", [
  createVNode("li", [createTextVNode("item1")]),
  createVNode("li", [createTextVNode("item2")]),
  createVNode("li", [createTextVNode("item3")]),
]);

/**
 * 递归insert dom的顺序：
 * 1. "item1"
 * 2. li
 * 3. "item2"
 * 4. li
 * 5. "item3"
 * 6. li
 * 7. ul
 */
// createElm(ul, document.getElementById("app"));

var container = document.getElementById("app");
var oldVnode = new VNode(container.tagName, [], undefined, container);

var render = function (newVnode) {
  patch(oldVnode, newVnode);
  oldVnode = newVnode;
};

var div = createVNode("div", [
  createVNode("q", [createTextVNode("q")]),
  createVNode("w", [createTextVNode("w")]),
  createVNode("e", [createTextVNode("e")]),
  createVNode("r", [createTextVNode("r")]),
  createVNode("t", [createTextVNode("t")]),
  createVNode("y", [createTextVNode("y")]),
]);

render(div);

setTimeout(function () {
  ul = div = createVNode("div", [
    createVNode("q", [createTextVNode("q")]),
    createVNode("t", [createTextVNode("t")]),
    createVNode("d", [createTextVNode("d")]),
    createVNode("f", [createTextVNode("f")]),
    createVNode("w", [createTextVNode("w")]),
    createVNode("y", [createTextVNode("y")]),
  ]);
  render(ul);
}, 1000);

// setInterval(function () {
//   ul = createVNode("ul", [
//     createVNode("li", [createTextVNode(`item${Math.random()}`)]),
//     createVNode("li", [createTextVNode("item2")]),
//     createVNode("li", [createTextVNode("item3")]),
//   ]);
//   render(ul);
// }, 1000);

// setTimeout(function () {
//   ul = createVNode("ul", [
//     createVNode("ol", [createTextVNode("item1")]),
//     // createVNode("li", [createTextVNode("item2")]),
//     createVNode("li", [createTextVNode("item3")]),
//   ]);
//   render(ul);
// }, 1000);
