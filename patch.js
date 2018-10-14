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

const patch = (oldVNode, newVNode) => {
  if (oldVNode === newVNode) return

  let node = oldVNode.el
  let parent = node.parentElement

  // 新节点不存在时直接删除
  if (!newVNode) parent.removeChild(node)

  // 两个节点是不同类型则用新节点替换老节点
  if (!isSameVNode(oldVNode, newVNode)) {
    parent.replaceChild(newVNode.render(), node)
  } else {
    // 是相同类型则调用 patchVNode
    patchVNode(oldVNode, newVNode, node)
  }
}

const patchVNode = (oldVNode, newVNode, node) => {
  let ch = oldVNode.children
  let newCh = newVNode.children

  // 替换文本
  if (oldVNode.text !== newVNode.text) {
    node.childNodes[0].nodeValue = newVNode.text
  }

  // 替换属性
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

  // 替换子节点
  if (ch.length && newCh.length) {
    // 如果均有子节点则对子节点进行 diff 操作
    updateChildren(node, ch, newCh)
  } else if (ch.length) { 
    // 如果新节点没有子节点则移除旧节点的所有子节点 
    Array.from(node.children).forEach(el => node.removeChild(el))
  } else if (newCh.length) {
    // 如果旧节点没有子节点则为其加入新节点的子节点
    newCh.forEach(c => node.appendChild(isVNode(c) ? c.render() : document.createTextNode(c)))
  }
}

const updateChildren = (node, ch, newCh) => {
  if (ch === newCh) return

  // 定义新老节点两边的索引
  // 在比较过程中会逐渐往中间靠拢
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = ch.length - 1
  let newEndIdx = newCh.length -1
  // 各自指向索引对应的 vnode 节点
  let oldStartVNode = ch[0]
  let oldEndVNode = ch[oldEndIdx]
  let newStartVNode = newCh[0]
  let newEndVNode = newCh[newEndIdx]

  // newStartVNode, newEndVNode 和 oldStartVNode, oldEndVNode 之间两两比较
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 两者 start 或 end 是 sameVNode 的情况，直接进行 patch 即可，之后将 index 往中间移动
    if (isSameVNode(oldStartVNode, newStartVNode)) {
      patch(oldStartVNode, newStartVNode)
      newStartVNode = newCh[++newStartIdx]
      oldStartVNode = ch[++oldStartIdx]
    } else if (isSameVNode(oldEndVNode, newEndVNode)) {
      patch(oldEndVNode, newEndVNode)
      newEndVNode = newCh[--newEndIdx]
      oldEndVNode = ch[--oldEndIdx]
    // 接下来是两个 start 与 end 是 sameVNode 的情况
    // 首先 patch，然后将 oldStartVNode 移到 oldEndVNode 后面，index 照样往中间移动
    } else if (isSameVNode(oldStartVNode, newEndVNode)) {
      patch(oldStartVNode, newEndVNode)
      node.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling)
      oldStartVNode = ch[++oldStartIdx]
      newEndVNode = newCh[--newEndIdx]
    // 首先 patch，然后将 oldEndVNode 移到 oldStartVNode 前面 ，index 照样往中间移动
    } else if (isSameVNode(oldEndVNode, newStartVNode)) {
      patch(oldEndVNode, newStartVNode)
      node.insertBefore(oldEndVNode.el, oldStartVNode.el)
      oldEndVNode = ch[--oldEndIdx]
      newStartVNode = newCh[++newStartIdx]
    } else {
      // 新旧节点首尾没有 sameVNode 的情况
      // 生成一个旧节点的 key-to-index map，判断 ch[map[key]] 是否是 sameVNode
      //   是则进行 patch，并将这个旧节点添加到 oldStartVNode 前面
      //   否则用 newStartVNode 创建一个节点
      // 让 newStartIdx 往后移一位
      node.insertBefore(newStartVNode.render(), oldStartVNode.el)
      newStartVNode = newCh[++newStartIdx]
    }
  }

  // 旧节点已经遍历完了，但是还有新节点，则需要把多出来的加入
  while (newStartIdx <= newEndIdx) {
    el = ch[oldEndIdx + 1] ? ch[oldEndIdx + 1].el : null
    node.insertBefore(newStartVNode.render(), el)
    newStartVNode = newCh[++newStartIdx]
  }
  
  // 新节点已经遍历完了，但是还有旧节点，则需要把多出来的删除
  while (oldStartIdx <= oldEndIdx) {
    node.removeChild(oldStartVNode.el)
    oldStartVNode = ch[++oldStartIdx]
  }
}

const isVNode = vNode => vNode instanceof VNode

// 同一个 vnode 需要 key 和 type 都一致
const isSameVNode = (oldVNode, newVNode) => {
  return oldVNode.key === newVNode.key && oldVNode.type === newVNode.type
}