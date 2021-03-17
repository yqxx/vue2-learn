import * as nodeOps from "./node-ops";

function isUndef(s) {
  return s == null;
}

function isDef(s) {
  return s != null;
}

/**
 * 把elm dom 对象，插入到 parent dom 上
 * @param {HTMLElement} parentElm 父节点
 * @param {HTMLElement} elm 需插入的新节点
 * @param {HTMLElement} ref 在其之前插入
 */
function insert(parentElm, elm, ref) {
  if (parentElm) {
    if (ref) {
      // 把新节点插入进ref前面
      parentElm.insertBefore(elm, ref);
    } else {
      parentElm.appendChild(elm);
    }
  }
}

/**
 * 递归创建vnode的所有子节点
 * @param {VNode} vnode
 * @param {VNode} children vnode的子节点
 */
function createChildren(vnode, children) {
  for (let i = 0; i < children.length; i++) {
    createElm(children[i], vnode.elm, null);
  }
}

/**
 * 把vnode渲染到dom中
 * @param {VNode} vnode 虚拟dom对象
 * @param {HTMLElement} parentElm 父节点
 * @param {HTMLElement} refElm 在其之前插入
 */
function createElm(vnode, parentElm, refElm) {
  const children = vnode.children;
  const tag = vnode.tag;
  // 非文本节点
  if (tag) {
    // 1. 创建根节点
    vnode.elm = document.createElement(vnode.tag);
    // 2. 创建子节点
    createChildren(vnode, children);
    // 3. 把当前节点插入到 DOM 上
    insert(parentElm, vnode.elm, refElm);
  } else {
    vnode.elm = document.createTextNode(vnode.text);
    insert(parentElm, vnode.elm, refElm);
  }
}

export default function path(oldVnode, newVnode) {
  // 如果两个 vnode 节点根一致
  if (sameVnode(oldVnode, newVnode)) {
    patchVnode(oldVnode, newVnode);
  }
  // 两个vnode的dom的根节点不一样
  else {
    // 1.找到oldVnode对应的Dom节点及父节点
    const oldElm = oldVnode.elm;
    const parentElm = nodeOps.parentNode(oldElm);

    // 2.把新的节点(newVnode)渲染在原来的父节点中
    createElm(newVnode, parentElm, oldElm);

    // 3.把旧的节点(oldVnode)从Dom树中移除
    if (parentElm !== null) {
      removeVnodes(parentElm, [oldVnode], 0, 0);
    }
  }
}

/**
 * 两个节点标签是否相同
 * @param {VNode} vnode1
 * @param {VNode} vnode2
 * @returns
 */
function sameVnode(vnode1, vnode2) {
  return vnode1.tag === vnode2.tag;
}

/**
 * 更新当前vnode对应的dom
 * @param {VNode} oldVnode 旧虚拟Dom对象
 * @param {VNode} vnode 新虚拟Dom对象
 * @param {*} removeOnly
 * @returns
 */
function patchVnode(oldVnode, vnode, removeOnly) {
  if (oldVnode === vnode) {
    return;
  }

  const elm = (vnode.elm = oldVnode.elm);
  const oldCh = oldVnode.children;
  const ch = vnode.children;

  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, removeOnly);
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, "");
      addVnodes(elm, null, ch, 0, ch.length - 1);
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, "");
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
}

/**
 * 对比子节点集
 * @param {HTMLElement} parentElm 上级Dom元素
 * @param {VNode} oldCh 旧子节点集
 * @param {VNode} newCh 新子节点集
 * @param {*} removeOnly
 */
function updateChildren(parentElm, oldCh, newCh, removeOnly) {
  let oldStartIdx = 0;
  let newStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];
  let oldKeyToIdx, idxInOld, elmToMove, refElm;
  debugger;
  const canMove = !removeOnly;
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode);
      canMove &&
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm)
        );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode);
      canMove &&
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      createElm(newStartVnode, parentElm, oldStartVnode.elm);
      newStartVnode = newCh[++newStartIdx];
    }
  }
  // 旧子节点集先遍历完，则将剩余的新子节点集增加到最后一个新节点的位置后
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx);
  }
  // 新子节点集先遍历完，则删除旧子节点集剩余的节点
  else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}

/**
 * 循环插入vnode到dom中
 * @param {HTMLElement} parentElm 上级节点
 * @param {HTMLElement} refElm 在其之前插入
 * @param {VNode} vnodes 需要创建的节点集合
 * @param {Number} startIdx 起始指针
 * @param {Number} endIdx 结束指针
 */
function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    createElm(vnodes[startIdx], parentElm, refElm);
  }
}

/**
 * 循环从dom中移除vnode
 * @param {HTMLElement} parentElm 上级节点
 * @param {VNode} vnodes 需要移除的节点集合
 * @param {Number} startIdx 起始指针
 * @param {Number} endIdx 结束指针
 */
function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx];
    if (isDef(ch)) {
      removeNode(ch.elm);
    }
  }
}

/**
 * 移除dom节点
 * @param {HTMLElement} el 要移除Dom树中的节点
 */
function removeNode(el) {
  const parent = nodeOps.parentNode(el);
  if (parent) {
    nodeOps.removeChild(parent, el);
  }
}
