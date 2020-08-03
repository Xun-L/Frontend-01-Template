import { createElement } from '../createElement.js';

export class ListView {
  constructor() {
    this.children = [];
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  getAttribute(name){
      return this[name]
  }
  render() {
    let listData = this.getAttribute('data')

    let root = (
      <div class="list-view" style="width:300px">
          {listData.map(this.children[0])}
      </div>
    );

    return root;
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
