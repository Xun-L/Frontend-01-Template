export function createElement(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls();
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }

  let visit = (children) => {
    for (let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
        continue;
      }
      if (typeof child === 'string') {
        let textNode = new Text(child);
        textNode.mountTo(o.root);
        continue;
      }
      o.appendChild(child);
    }
  };
  visit(children);
  return o;
}

class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name, val) {
    this.root.setAttribute(name, val);
  }
  appendChild(child) {
    this.children.push(child);
  }
  get style() {
    return this.root.style;
  }
  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
  addEventListener(name, fun, config) {
    this.root.addEventListener(...arguments);
  }
}
