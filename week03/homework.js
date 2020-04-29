/**
 * 字符串 转 数字,可使用小数和科学计数法
 * @param {String} str 需要转化的字符串
 * @param {Number} radix  用于数字到字符串的转换的基数(从2到36)，默认值为10
 */
function convertStringToNumber(str, radix = 10) {
  let result = 0;
  let index = 0;
  let base = 0;
  let decimalsRadix = 1 / radix;
  const zeroCode = '0'.charCodeAt(0);
  const ECode = 'E'.charCodeAt(0);
  const ACode = 'A'.charCodeAt(0);
  const ZCode = 'Z'.charCodeAt(0);
  const nineCode = '9'.charCodeAt(0);
  const pointCode = '.'.charCodeAt(0);
  let type = 'demical';
  while (index < str.length) {
    let charCode = str[index].toUpperCase().charCodeAt(0);
    if (charCode === pointCode) {
      index++;
      break;
    }
    let num = NaN;
    if (charCode === ECode && radix === 10) {
      index++;
      type = 'scientific';
      break;
    } else if (charCode >= ACode && charCode <= ZCode) {
      num = charCode - ACode + 10;
    } else if (charCode >= zeroCode && charCode <= nineCode) {
      num = charCode - zeroCode;
    }
    if (Number.isNaN(num) || num > radix - 1) {
      return NaN;
    }
    result = result * radix + num;
    index++;
  }
  if (type === 'demical') {
    while (index < str.length) {
      let charCode = str[index].toUpperCase().charCodeAt(0);
      let num = NaN;
      if (charCode === ECode && radix === 10) {
        index++;
        type = 'scientific';
        break;
      } else if (charCode >= zeroCode && charCode <= nineCode) {
        num = charCode - zeroCode;
      }
      if (Number.isNaN(num)) {
        return NaN;
      }
      result = result + num * decimalsRadix;
      decimalsRadix /= radix;
      index++;
    }
  }
  if (type === 'scientific') {
    while (index < str.length) {
      let charCode = str[index].toUpperCase().charCodeAt(0);
      let num = NaN;
      if (charCode >= zeroCode && charCode <= nineCode) {
        num = charCode - zeroCode;
      }
      if (Number.isNaN(num)) {
        return NaN;
      }
      base = base * radix + num;
      index++;
    }
  }
  return result * Math.pow(10, base);
}

// console.log(convertStringToNumber('10') === 10);
// console.log(convertStringToNumber('10', 2) === 2);
// console.log(convertStringToNumber('dd', 16) === 221);
// console.log(convertStringToNumber('ddd', 16) === 3549);
// console.log(convertStringToNumber('a.8', 16) === 10.5);
// console.log(convertStringToNumber('1a.4', 16) === 26.25);
// console.log(convertStringToNumber('3.23e33e', 10) === 3230);
// console.log(convertStringToNumber('3.23e33e', 10));
/**
 * 数字转字符串(小数部分没本事处理)
 * @param {Number} num 需要转化的数字
 * @param {*} radix 用于数字到字符串的转换的基数(从2到36)，默认值为10
 * @return {String}
 */
function convertNumberToString(num, radix = 10) {
  let result = [];
  var integer = Math.floor(number);
  var fraction = null;
  if (x === 10) fraction = ('' + number).match(/\.\d*/)[0];
  while (num !== 0) {
    let char = num % radix;
    console.log(char);
    result.unshift(char);
    num = (num - char) / radix;
  }
  return result.join('');
}

console.log(convertNumberToString(233.1, 2));
