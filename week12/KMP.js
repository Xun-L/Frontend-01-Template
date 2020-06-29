function find(source, pattern) {
  if (!pattern) {
    return 0;
  }
  let next = generateNext(pattern);
  let j = 0;
  for (let i = 0; i < source.length && j < pattern.length; ) {
    if (j == -1 || pattern[j] == source[i]) {
      i++;
      j++;
      if (j === pattern.length) {
        return i - j;
      }
    } else {
      j = next[j];
    }
  }
  return -1;
}
function getNext(pattern) {
  let next = [-1];
  let j = -1;
  let i = 0;
  while (i < pattern.length - 1) {
    if (j === -1) {
      //重新开始匹配字符串
      i++;
      j = 0;
      next[i] = 0;
    } else if (pattern[i] === pattern[j]) {
      //最好的情况
      i++;
      j++;
      next[i] = j;
    } else {
      console.log(j)
      j = next[j]; //next[j]此刻的值是在本次寻找回溯内，已经找到的长度 j=next[j]相当于后退一步
      console.log(j)
      console.log('---')
    }
  }
  return next;
}

console.log(getNext('aa'));
console.log(getNext('aab'));
console.log(getNext('aaba'));
// console.log(getNext('aabaaac'));
// console.log(getNext('aabaaac'));
// console.log(getNext('aabaaac'));
// console.log(getNext('aabaaac'));
// console.log(getNext('aabaaac'));

// console.log(find('mississippi', 'issip')); //4
// console.log(find('aabaaabaaac', 'aabaaac'));
// console.log(find('hello', 'll'));
// console.log(find('hello', 'll'));
// console.log(find('abcccabc', 'abc'));
// console.log(find('abcdabcad', 'abca'));
// console.log(find('abcdabcad', 'abcad'));
// console.log(find('abcdabcabxad', 'abcabx'));
