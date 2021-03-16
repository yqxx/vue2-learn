export default class VNode {
  constructor(tag, children, text, elm) {
    // 标签名(ul, li, div ...)
    this.tag = tag;
    // Array: [VNode, VNode]
    this.children = children;
    // 文本内容
    this.text = text;
    // 对应的真实dom对象
    this.elm = elm;
  }
}
