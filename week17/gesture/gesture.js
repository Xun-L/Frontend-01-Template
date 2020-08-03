let context = Object.create(null);
let MOUSR_SYMBOL = Symbol('mouse');

export function enableGesture(element) {
  if (document.ontouchstart !== null) {
    element.addEventListener('mousedown', (event) => {
      context[MOUSR_SYMBOL] = Object.create(null);
      start(event, context[MOUSR_SYMBOL]);
      let mousemove = (event) => {
        move(event, context[MOUSR_SYMBOL]);
      };
      let mouseend = (event) => {
        end(event, context[MOUSR_SYMBOL]);
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseend);
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseend);
    });
  }
  element.addEventListener('touchstart', (event) => {
    for (let touch of event.changedTouches) {
      context[touch.identifier] = Object.create(null);
      start(touch, context[touch.identifier]);
    }
  });
  element.addEventListener('touchmove', (event) => {
    for (let touch of event.changedTouches) {
      move(touch, context[touch.identifier]);
    }
  });
  element.addEventListener('touchend', (event) => {
    for (let touch of event.changedTouches) {
      end(touch, context[touch.identifier]);
      delete context[touch.identifier];
    }
  });
  element.addEventListener('touchcancel', (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, context[touch.identifier]);
      delete context[touch.identifier];
    }
  });

  let start = (point, context) => {
    context.startX = point.clientX;
    context.startY = point.clientY;
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;
    context.moves = [];
    let e = new CustomEvent('start');
    e = Object.assign(e, {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY
    });
    element.dispatchEvent(e);
    context.timeoutHandler = setTimeout(() => {
      let e = new CustomEvent('press');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      });
      element.dispatchEvent(e);
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
    }, 500);
  };

  let move = (point, context) => {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
      clearTimeout(context.timeoutHandler);
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      let e = new CustomEvent('panstart');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      });
      element.dispatchEvent(e);
    }
    if (context.isPan) {
      let e = new CustomEvent('pan');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      });
      element.dispatchEvent(e);
      context.moves.push({ dx, dy, t: Date.now() });
      context.moves = context.moves.filter((rec) => Date.now() - rec.t < 300);
    }
  };

  let end = (point, context) => {
    if (context.isPan) {
      let dx = point.clientX - context.startX;
      let dy = point.clientY - context.startY;
      let rec = context.moves[0];
      let speed =
        Math.sqrt((dx - rec.dx) ** 2 + (dy - rec.dy) ** 2) /
        (Date.now() - rec.t);
      let isFastClick = false;
      if (speed > 0.5) {
        isFastClick = true;
        let e = new CustomEvent('fsclick');
        e = Object.assign(e, {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY
        });
        element.dispatchEvent(e);
      }
      let e = new CustomEvent('panend');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        fsclick:isFastClick
      });
      element.dispatchEvent(e);
    }
    if (context.isTap) {
      let e = new CustomEvent('tap');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      });

      element.dispatchEvent(e);
    }
    if (context.isPress) {
      let e = new CustomEvent('pressend');
      e = Object.assign(e, {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      });
      element.dispatchEvent(e);
    }

    let e = new CustomEvent('end');
    e = Object.assign(e, {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY
    });
    element.dispatchEvent(e);
    clearTimeout(context.timeoutHandler);
  };

  let cancel = (point, context) => {
    clearTimeout(context.timeoutHandler);
  };
}
