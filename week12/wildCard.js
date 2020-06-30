//最后一个 * 贪婪

function isMatch(source, pattern) {
  //pattern分段
  let starCount = 0;
  let patternLast = '';
  if (source === '') {
    if (pattern === '' || pattern === '*') {
      return true;
    }
    return false;
  }

  for (let i = 0; i < pattern.length; i++) {
    patternLast += pattern[i];
    if (pattern[i] === '*') {
      starCount++;
      patternLast = '';
    }
  }
  // console.log(patternLast);
  //处理没有 * 的情况
  if (starCount === 0) {
    if (source.length !== pattern.length) {
      return false;
    }
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] !== source[i] && pattern[i] !== '?') {
        return false;
      }
    }
    return true;
  }
  //处理头部的匹配(第一个*之前)
  let i = 0; //i为source上的指针
  for (i = 0; pattern[i] !== '*'; i++) {
    if (pattern[i] !== source[i] && pattern[i] !== '?' && source[i]) {
      return false;
    }
    if(!source[i]){
        return false
    }
  }


  //i此时指向source的第一个和pattern上* 所匹配的位置

  let lastIndex = i;
  for (let p = 0; p < starCount - 1; p++) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }
    //subPattern是pattern里面 * 之间的字符串

    let subReg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g'); //正则替换
    // console.log(subReg)
    subReg.lastIndex = lastIndex;
    if (!subReg.exec(source)) {
      return false;
    }
    lastIndex = subReg.lastIndex; //传递lastIndex
  }

  if (patternLast == '') {
    return true;
  }
  if (lastIndex >= source.length) {
    return false;
  }
  //console.log(patternLast);

  // console.log(lastIndex)
  //处理最后一个*之后的部分
  //console.log(patternLast.length)
  //console.log(source.length - lastIndex)

  for (let j = 1; pattern[pattern.length - j] !== '*'; j++) {
    if (source.length - j < lastIndex) {
      return false;
    }
    if (
      pattern[pattern.length - j] !== source[source.length - j] &&
      pattern[pattern.length - j] !== '?'
    ) {
      return false;
    }
  }
  return true;
}

// console.log(isMatch('aa', 'a')); //false

// console.log(isMatch('aa', '*')); //true

// console.log(isMatch('cb', '?a')); //false

// console.log(isMatch('adceb', '*a*b')); //true

// console.log(isMatch('sissippi', '*ss*?i*pi')); //false

// console.log(isMatch('zacabz', '*a?b*')); //false

console.log(isMatch('a', 'a*')); //true

// console.log(isMatch('abce', 'abc*??')); //false

// console.log(isMatch('abefcdgiescdfimde', 'ab*cd?i*de')); //true

// console.log(isMatch('', 'ab*')); //false
console.log(isMatch('a', 'ab*')); //false
