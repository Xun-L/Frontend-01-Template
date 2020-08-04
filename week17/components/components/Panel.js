import { createElement } from '../createElement.js';

export class Panel {
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
    let root = (
      <div class="panel">
        <span class='title' style='margin-bottom:4px;line-height:10px;color:gray'>{this.title}</span>
        <div
          class="content"
          style="min-height:300px;width:300px;border:1px solid"
        >
          {this.children}
        </div>
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
