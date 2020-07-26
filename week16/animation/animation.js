export class Timeline {
  constructor() {
    this.animations = [];
    this.requestId = null;
    this.state = 'inited';
  }
  tick() {
    let t = Date.now() - this.startTime;
    let animations = this.animations.filter((n) => !n.isFinished);
    for (let animation of animations) {
      if (t < animation.delay) {
        continue;
      }

      let {
        object,
        property,
        template,
        start,
        end,
        duration,
        timingFunction,
        delay,
        startTime
      } = animation;
      let percent = timingFunction((t - delay - startTime) / duration);

      if (t > duration + delay + startTime) {
        percent = 1;
        animation.isFinished = true;
      }
      let val = animation.valueFromProgression(percent);
      object[property] = template(val);
    }
    if (animations.length) {
      this.requestId = requestAnimationFrame(() => this.tick());
    }
  }
  pause() {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'pause';
    this.pauseTime = Date.now();
    console.log('pause');
    console.log(this.requestId)
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
    }
  }
  resume() {
    if (this.state !== 'pause') {
      return;
    }
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'playing';

    this.startTime = Date.now();
    this.tick();
  }
  restart() {
    if (this.state === 'playing') {
     // this.pause();
    }
    this.state = 'playing';
    this.startTime = Date.now();
    this.animations = this.animations.map((n) => {
      n.isFinished = false;
      return n;
    });
    this.tick();
  }
  add(animation, startTime) {
    this.animations.push(animation);
    animation.isFinished = false;
    if (this.state === 'playing') {
      animation.startTime =
        startTime !== undefined ? startTime : Date.now() - this.startTime;
    } else {
      animation.startTime = startTime !== undefined ? startTime : 0;
    }
  }
}

export class Animation {
  constructor(
    object,
    property,
    start,
    end,
    duration,
    delay = 0,
    timingFunction,
    template
  ) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction =
      timingFunction ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(
    object,
    property,

    start,
    end,
    duration,
    delay = 0,
    timingFunction,
    template
  ) {
    this.object = object;
    this.template = template || ((v) => `rgba(${v.r},${v.g},${v.b},${v.a})`);
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFunction =
      timingFunction ||
      ((start, end) => {
        return (t) => start + (t / duration) * (end - start);
      });
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a)
    };
  }
}
