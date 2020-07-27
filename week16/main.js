import { createElement } from './createElement.js';
//import {Carousel} from './carousel.vue'
import { Timeline, Animation } from './animation/animation.js';
import { cubicBezier } from './animation/cubicBezier.js';
import { enableGesture } from './gesture/gesture.js';

class Carousel {
  constructor() {
    this.children = [];
    this.tl = new Timeline();
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  render() {
    let children = this.data.map((url) => {
      let element = <img src={url} />;
      element.addEventListener('dragstart', (event) => event.preventDefault());
      return element;
    });
    let root = <div class="carousel">{children}</div>;

    this.tl.start();
    let pos = 0;
    let nextPic = () => {
      let nextPos = (pos + 1) % this.data.length;
      let current = children[pos];
      let next = children[nextPos];
      let ease = cubicBezier(0.25, 0.1, 0.25, 1);
      current.style.transition = '';
      next.style.transition = ''; 
      this.tl.add(
        new Animation(
          next.style,
          'transform',
          100 - 100 * nextPos,
          -100 * nextPos,
          500,
          0,
          ease,
          (v) => `translateX(${v}%)`
        )
      );
      this.tl.add(
        new Animation(
          current.style,
          'transform',
          -100 * pos,
          -100 - 100 * pos,
          500,
          0,
          ease,
          (v) => `translateX(${v}%)`
        )
      );
      console.log('start');
     // this.tl.tick();
      // tl.add(
      //   new Animation(
      //     el.style,
      //     'transform',
      //     0,
      //     200,
      //     5000,
      //     0,
      //     ease,
      //     (v) => `translate(${v}px)`
      //   )
      // );

      // current.style.transition = 'ease 0s';
      // next.style.transition = 'ease 0s';
      // current.style.transform = `translateX(${-100 * pos}%)`;
      // next.style.transform = `translateX(${100 - 100 * nextPos}%)`;
      // setTimeout(() => {
      //   current.style.transition = '';
      //   next.style.transition = '';
      //   current.style.transform = `translateX(${-100 - 100 * pos}%)`;
      //   next.style.transform = `translateX(${-100 * nextPos}%)`;
      //   pos = nextPos;
      // }, 16);

      pos = nextPos;
      this.loop = setTimeout(nextPic, 3000);
    };
    nextPic();
    let ele = root.root;
    enableGesture(ele);
  
    ele.addEventListener('panstart', (event) => {
      this.tl.pause();
      clearTimeout(this.loop);
    });

    ele.addEventListener('pan', (event) => {
      let startX = event.startX;

      let lastPos = (pos - 1 + this.data.length) % this.data.length;
      let nextPos = (pos + 1) % this.data.length;

      let current = children[pos];
      let last = children[lastPos];
      let next = children[nextPos];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${-500 * pos}px)`;
      last.style.transform = `translateX(${-500 - 500 * lastPos}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPos}px)`;
      let moveX = event.clientX - startX;
      current.style.transform = `translateX(${moveX - 500 * pos}px)`;
      last.style.transform = `translateX(${moveX - 500 - 500 * lastPos}px)`;
      next.style.transform = `translateX(${moveX + 500 - 500 * nextPos}px)`;
    });

    ele.addEventListener('panend', (event) => {
      let startX = event.startX;

      let lastPos = (pos - 1 + this.data.length) % this.data.length;
      let nextPos = (pos + 1) % this.data.length;

      let current = children[pos];
      let last = children[lastPos];
      let next = children[nextPos];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';
      let offset = 0;
      if (event.clientX - startX > 250) {
        offset = 1;
      }
      if (event.clientX - startX < -250) {
        offset = -1;
      }

      current.style.transform = `translateX(${offset * 500 - 500 * pos}px)`;
      last.style.transform = `translateX(${
        offset * 500 - 500 - 500 * lastPos
      }px)`;
      next.style.transform = `translateX(${
        offset * 500 + 500 - 500 * nextPos
      }px)`;
      current.style.transition = 'transform ease 0.5s';
      last.style.transition = 'transform ease 0.5s';
      next.style.transition = 'transform ease 0.5s';

      pos = (pos - offset + this.data.length) % this.data.length;

    
      this.tl.resume();
      this.loop = setTimeout(nextPic, 3000);
    });

    // root.addEventListener('mousedown', (event) => {
    //   this.tl.pause();
    //   clearTimeout(this.loop);
    //   let startX = event.clientX;

    //   let lastPos = (pos - 1 + this.data.length) % this.data.length;
    //   let nextPos = (pos + 1) % this.data.length;

    //   let current = children[pos];
    //   let last = children[lastPos];
    //   let next = children[nextPos];

    //   current.style.transition = 'ease 0s';
    //   last.style.transition = 'ease 0s';
    //   next.style.transition = 'ease 0s';

    //   current.style.transform = `translateX(${-500 * pos}px)`;
    //   last.style.transform = `translateX(${-500 - 500 * lastPos}px)`;
    //   next.style.transform = `translateX(${500 - 500 * nextPos}px)`;
    //   let move = (event) => {
    //     let moveX = event.clientX - startX;
    //     current.style.transform = `translateX(${moveX - 500 * pos}px)`;
    //     last.style.transform = `translateX(${moveX - 500 - 500 * lastPos}px)`;
    //     next.style.transform = `translateX(${moveX + 500 - 500 * nextPos}px)`;
    //   };
    //   let up = (event) => {
    //     console.log('up');
    //     let offset = 0;
    //     if (event.clientX - startX > 250) {
    //       offset = 1;
    //     }
    //     if (event.clientX - startX < -250) {
    //       offset = -1;
    //     }

    //     current.style.transform = `translateX(${offset * 500 - 500 * pos}px)`;
    //     last.style.transform = `translateX(${
    //       offset * 500 - 500 - 500 * lastPos
    //     }px)`;
    //     next.style.transform = `translateX(${
    //       offset * 500 + 500 - 500 * nextPos
    //     }px)`;
    //     current.style.transition = 'transform ease 0.5s';
    //     last.style.transition = 'transform ease 0.5s';
    //     next.style.transition = 'transform ease 0.5s';

    //     pos = (pos - offset + this.data.length) % this.data.length;

    //     document.removeEventListener('mouseup', up);
    //     document.removeEventListener('mousemove', move);
    //     this.tl.resume();
    //     this.loop = setTimeout(nextPic, 3000);
    //   };
    //   document.addEventListener('mousemove', move);
    //   document.addEventListener('mouseup', up);
    // });

    return root;
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
let data = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
];
let component = <Carousel data={data}></Carousel>;

component.mountTo(document.body);
