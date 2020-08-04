var parser = require('./parser.js')

module.exports = function (source, map) {
  let tree = parser.parseHTML(source)
  let template = null
  let script = null

  for (let node of tree.children) {
    if (node.tagName == 'template') {
      console.log(node)
      template = node.children.find(n=>n.type==='element')
    }
    if (node.tagName == 'script') {
      script = node.children[0].content
    }
  }
  let visit = (node, depth) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content)
    }
    let attrs = {}
    for (let attr of node.attributes) {
      attrs[attr['name']] = attr['value']
    }
    let children = []
    if (node.children) {
      for (let child of node.children) {
        children.push(visit(child, depth + 1))
      }
    }

    return `createElement('${node.tagName}',${JSON.stringify(
      attrs
    )},${children})`
  }

  let r = `
    import { createElement } from './createElement.js';
    export class Carousel{
        render(){
            return ${visit(template)}
        }
        setAttribute(name, val) {
            this[name] = val;
        }
        mountTo(parent){
            this.render().mountTo(parent)
        }
    }
    `
  return r
}
