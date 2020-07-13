function create(Cls, attributes, ...children) {
  let o;
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else {
    o = new Cls();
  }

  for (let name in attributes) {
    o.setAttribute(name, attributes[name]);
  }
  for (let child of children) {
    if (typeof child === 'string') {
      let textNode = new Text(child);
      // textNode.mountTo(o.root);

      continue;
    }

    o.appendChild(child);
  }
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
    console.log(type)
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name, val) {
    this.root.setAttribute(name, val);
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}

class MyComponent {
  constructor() {
    this.children = [];
  }
  setAttribute(name, val) {
    this.root.setAttribute(name, val);
  }
  appendChild(child) {
    this.children.push(child);
  }

  render() {
    return (
      <article>
        <header>im a header</header>
        {this.slot}
        <footer>footer</footer>
      </article>
    );
  }
  mountTo(parent) {
    this.slot = <div></div>;//这里又是一个wrapper、秀了
    for (let child of this.children) {
      this.slot.appendChild(child);
    }
    this.render().mountTo(parent);
  }
}

let component = <MyComponent></MyComponent>;

component.mountTo(document.body);
console.log(component);
