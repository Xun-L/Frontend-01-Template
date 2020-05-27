function getDFA(pattern) {
  let result = {};
  let patternLength = pattern.length;
  result[pattern[0]] = { 0: 1 };
  for (let x = 0, j = 1; j < patternLength; j++) {
    let patternChar = pattern[j];
    copyColumn(result, x, j);
    result[patternChar] = Object.assign({}, result[patternChar], {
      [j]: j + 1,
    });
    x = result[patternChar][x] || 0;
  }
  return result;

  function copyColumn(obj, from, to) {
    for (let key in obj) {
      if (obj[key][from]) {
        obj[key][to] = obj[key][from];
      }
    }
  }
}

function searchText(pattern, txt) {
  let dfa = getDFA(pattern);
  let j = 0;
  for (let i = 0; i < txt.length&&j<pattern.length; i++) {
    j = dfa[txt[i]] ? (dfa[txt[i]][j] || 0) : 0;
  }
  if (j == pattern.length) {
    return true;
  }
  return false;
}

console.log(searchText('ABABAC', 'AABABABdABACBABAC'));
