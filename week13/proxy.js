let object = {
  a: { x: 3 },
  b: 2,
};
let handlers = new Map();

let reactivities = new Map();
let usedReactivities = [];

function reactive(object) {
  if (reactivities.has(object)) {
    return reactivities.get(object);
  }

  let proxy = new Proxy(object, {
    get(obj, prop) {
      usedReactivities.push([object, prop]);
      if (typeof object[prop] === 'object') {
        return reactive(object[prop]);
      }
      return obj[prop];
    },
    set(obj, prop, val) {
      obj[prop] = val;
      if (handlers.has(obj) && handlers.get(obj).has(prop)) {
        for (let handler of handlers.get(obj).get(prop)) {
          handler();
        }
      }
    },
  });
  reactivities.set(object, proxy);
  reactivities.set(proxy, proxy);
  return proxy;
}

let effect = (handler) => {
  usedReactivities = [];
  handler();
  for (let usedReactivity of usedReactivities) {
    let [obj, prop] = usedReactivity;
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map());
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, []);
    }
    handlers.get(obj).get(prop).push(handler);
  }
};

let dummy;
let proxy = reactive(object);
effect(() => (dummy = proxy.a.y));
console.log(usedReactivities)
console.log(dummy);
proxy.a.y = 12;
console.log(dummy);
