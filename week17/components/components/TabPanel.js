import { createElement } from '../createElement.js';

export class TabPanel {
  constructor() {
    this.children = [];
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  getAttribute(name) {
    return this[name];
  }
  render() {
    this.titleView = this.children.map((el, idx) => {
      return (
        <span
          class="title"
          onClick={() => this.select(idx)}
          style="margin-bottom:4px;line-height:10px;color:gray;margin-right:4px;cursor:pointer"
        >
          {el.getAttribute('title')}
        </span>
      );
    });

    this.contentView = (
      <div
        class="content"
        style="min-height:300px;width:300px;border:1px solid"
      ></div>
    );
    setTimeout(() => {
      this.select(0);
    }, 100);
    let root = (
      <div class="tanpanel">
        {this.titleView}
        {this.contentView}
      </div>
    );

    return root;
  }
  select(idx) {
    console.log(idx);
    this.titleView.findIndex(title=>{
        title.style.color = 'gray'
    })

    this.titleView[idx].style.color = 'red';
    if (this.children.length > 0) {
      this.contentView.innerHtml(this.children[idx].root.outerHTML);
    }
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
