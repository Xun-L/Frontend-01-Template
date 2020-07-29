//import {Carousel} from './carousel.vue'
import { createElement } from './createElement.js';
import { Timeline, Animation } from './animation/animation.js';
import { cubicBezier } from './animation/cubicBezier.js';
import { enableGesture } from './gesture/gesture.js';

export class Carousel {
  constructor() {
    this.children = [];
    this.tl = new Timeline();
  }
  setAttribute(name, val) {
    this[name] = val;
  }
  render() {
    let children = this.data.map((url, currentPos) => {
      let offset = null;
      let onStart = () => {
        this.tl.pause();
        let currentElement = children[currentPos];
        offset =
          +currentElement.style.transform.match(
            /^translateX\(([\s\S]+)px\)$/
          )[1] +
          500 * currentPos;
        clearTimeout(this.loopHandler);
      };

      let onEnd = () => {
        this.tl.resume();
        this.loopHandler = setTimeout(nextPic, 3000);
      };
      let onPan = (event) => {
        let nextPos = (currentPos + 1) % this.data.length;
        let lastPos = (currentPos - 1 + this.data.length) % this.data.length;
        let lastElement = children[lastPos];
        let currentElement = children[currentPos];
        let nextElement = children[nextPos];
        let currentFrom = -500 * currentPos + offset;
        let lastFrom = -500 - 500 * lastPos + offset;
        let nextFrom = 500 - 500 * nextPos + offset;

        let dx = event.clientX - event.startX;

        currentElement.style.transform = `translateX(${currentFrom + dx}px)`;
        lastElement.style.transform = `translateX(${lastFrom + dx}px)`;
        nextElement.style.transform = `translateX(${nextFrom + dx}px)`;
      };
      let onPanEnd = (event) => {
        let dx = event.clientX - event.startX;
        let direction = 0;
        if (dx > 250) {
          direction = 1;
        }
        if (dx < -250) {
          direction = -1;
        }
        let ease = cubicBezier(0.25, 0.1, 0.25, 1);
        let nextPos = (currentPos + 1) % this.data.length;
        let lastPos = (currentPos - 1 + this.data.length) % this.data.length;
        let lastElementStyle = children[lastPos].style;
        let currentElementStyle = children[currentPos].style;
        let nextElementStyle = children[nextPos].style;
        let currentFrom = -500 * currentPos + offset + dx;
        let lastFrom = -500 - 500 * lastPos + offset + dx;
        let nextFrom = 500 - 500 * nextPos + offset + dx;
        this.tl.reset();
        this.tl.start();
        this.tl.add(
          new Animation(
            currentElementStyle,
            'transform',
            currentFrom,
            direction * 500 - 500 * pos,
            250,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        this.tl.add(
          new Animation(
            nextElementStyle,
            'transform',
            nextFrom,
            direction * 500 + 500 - 500 * nextPos,
            250,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );

        this.tl.add(
          new Animation(
            lastElementStyle,
            'transform',
            lastFrom,
            direction * 500 - 500 - 500 * lastPos,
            250,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
        console.log('---------------------');
        console.log(lastFrom);
        console.log(direction * 500 - 500 - 500 * lastPos);
        console.log('---------------------');
        pos = (pos - direction + this.data.length) % this.data.length;
      };

      let element = (
        <img
          src={url}
          onStart={onStart}
          onPan={onPan}
          onEnd={onEnd}
          onPanEnd={onPanEnd}
          enableGesture={true}
        />
      );
      element.addEventListener('dragstart', (event) => event.preventDefault());
      element.style.transform = 'translateX(0px)';
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
          (v) => `translateX(${5 * v}px)`
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
          (v) => `translateX(${5 * v}px)`
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
      this.loopHandler = setTimeout(nextPic, 3000);
    };
    this.loopHandler = setTimeout(nextPic, 3000);
    // let ele = root.root;
    // enableGesture(ele);

    // ele.addEventListener('panstart', (event) => {
    //   this.tl.pause();
    //   clearTimeout(this.loop);
    // });

    // ele.addEventListener('pan', (event) => {
    //   let startX = event.startX;

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
    //   let moveX = event.clientX - startX;
    //   current.style.transform = `translateX(${moveX - 500 * pos}px)`;
    //   last.style.transform = `translateX(${moveX - 500 - 500 * lastPos}px)`;
    //   next.style.transform = `translateX(${moveX + 500 - 500 * nextPos}px)`;
    // });

    // ele.addEventListener('panend', (event) => {
    //   let startX = event.startX;

    //   let lastPos = (pos - 1 + this.data.length) % this.data.length;
    //   let nextPos = (pos + 1) % this.data.length;

    //   let current = children[pos];
    //   let last = children[lastPos];
    //   let next = children[nextPos];

    //   current.style.transition = 'ease 0s';
    //   last.style.transition = 'ease 0s';
    //   next.style.transition = 'ease 0s';
    //   let offset = 0;
    //   if (event.clientX - startX > 250) {
    //     offset = 1;
    //   }
    //   if (event.clientX - startX < -250) {
    //     offset = -1;
    //   }

    //   current.style.transform = `translateX(${offset * 500 - 500 * pos}px)`;
    //   last.style.transform = `translateX(${
    //     offset * 500 - 500 - 500 * lastPos
    //   }px)`;
    //   next.style.transform = `translateX(${
    //     offset * 500 + 500 - 500 * nextPos
    //   }px)`;
    //   current.style.transition = 'transform ease 0.5s';
    //   last.style.transition = 'transform ease 0.5s';
    //   next.style.transition = 'transform ease 0.5s';

    //   pos = (pos - offset + this.data.length) % this.data.length;

    //   this.tl.resume();
    //   this.loop = setTimeout(nextPic, 3000);
    // });

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
