class VNode {
  constructor (type, text, props, children, key) {
    this.type = type
    this.text = text
    this.props = props
    this.children = children
    this.key = key
  }

  render () {
    let node = document.createElement(this.type)
    if (this.text) node.appendChild(document.createTextNode(this.text))
    Object.entries(this.props).forEach(([key, value]) => node.setAttribute(key, value))
    this.children.forEach(c => node.appendChild(c.render()))
    this.el = node
    return node
  }
}

const h = (ty, te, p, c, k) => {
  return new VNode(ty, te, p, c, k)
}

// 先默认oldVNode已经append到父节点上
const patch = (oldVNode, newVNode) => {
  if (oldVNode === newVNode) return

  let node = oldVNode.el
  let parent = node.parentElement

  if (!newVNode) parent.removeChild(node)

  // 不同类型
  if (!isSameVNode(oldVNode, newVNode)) {
    parent.replaceChild(newVNode.render(), node)
  } else {
    patchVNode(oldVNode, newVNode, node)
  }
}

const patchVNode = (oldVNode, newVNode, node) => {
  let ch = oldVNode.children
  let newCh = newVNode.children

  // text
  if (oldVNode.text !== newVNode.text) {
    node.childNodes[0].nodeValue = newVNode.text
  }

  // props
  Object.entries(oldVNode.props).forEach(([key, value]) => {
    let newProps = newVNode.props
    if (!newProps[key]) node.removeAttribute(key)
    else if (newProps[key] !== value) {
      node.setAttribute(key, newProps[key])
    }
  })
  Object.entries(newVNode.props).forEach(([key, value]) => {
    if (!oldVNode.props[key]) node.setAttribute(key, value)
  })

  // children
  if (ch.length && newCh.length) {
    updateChildren(node, ch, newCh)
  } else if (ch.length) {    
    Array.from(node.children).forEach(el => node.removeChild(el))
  } else if (newCh.length) {
    newCh.forEach(c => node.appendChild(isVNode(c) ? c.render() : document.createTextNode(c)))
  }
}

const updateChildren = (node, ch, newCh) => {
  if (ch === newCh) return

  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = ch.length - 1
  let newEndIdx = newCh.length -1
  let oldStartVNode = ch[0]
  let oldEndVNode = ch[oldEndIdx]
  let newStartVNode = newCh[0]
  let newEndVNode = newCh[newEndIdx]

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)
      newStartVNode = newCh[++newStartIdx]
      oldStartVNode = ch[++oldStartIdx]
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)
      newEndVNode = newCh[--newEndIdx]
      oldEndVNode = ch[--oldEndIdx]
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)
      node.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
      oldStartVNode = ch[++oldStartIdx]
      newEndVNode = newCh[--newEndIdx]
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)
      node.insertBefore(oldEndVNode.el, oldStartVNode.el)
      oldEndVNode = ch[--oldEndIdx]
      newStartVNode = newCh[++newStartIdx]
    } else {
      node.insertBefore(newStartVNode.render(), oldStartVNode.el)
      newStartVNode = newCh[++newStartIdx]
    }
  }

  while (newStartIdx <= newEndIdx) {
    el = ch[oldEndIdx + 1] ? ch[oldEndIdx + 1].el : null
    node.insertBefore(newStartVNode.render(), el)
    newStartVNode = newCh[++newStartIdx]
  }
  
  while (oldStartIdx <= oldEndIdx) {
    node.removeChild(oldStartVNode.el)
    oldStartVNode = ch[++oldStartIdx]
  }
}

const isVNode = vNode => vNode instanceof VNode

const isSameVNode = (oldVNode, newVNode) => {
  return oldVNode.key === newVNode.key && oldVNode.type === newVNode.type
}