console.log(match('abababababababx'));
console.log(match('abababx'));
console.log(match('123ababaabxxx333'));
function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return foundA;
  } else return start;
}

function foundA(c) {
  if (c === 'b') {
    return foundB;
  } else return start(c);
}
function foundB(c) {
  if (c === 'a') {
    return foundA2;
  } else return start(c);
}

function foundA2(c) {
  if (c === 'b') {
    return foundB2;
  } else return start(c);
}

function foundB2(c) {
  if (c === 'a') {
    return foundA3;
  } else return start(c);
}

function foundA3(c) {
  if (c === 'b') {
    return foundX;
  } else return start(c);
}


function foundX(c) {
  if (c === 'x') {
    return end;
  } else return foundB2(c);
}

function end(c) {
  return end;
}
