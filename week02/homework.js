//正则匹配所有数字（包括二进制，八进制(小数和科学计数法)，十进制，十六进制）
//chrome这个版本把0开头的数字处理成8进制，不符和规范，这里不处理这种情况
let numberReg = /(0o[0|1|2|3|4|5|6|7|8]*)|(0b[0|1]*)|(0x[0|1|2|3|4|5|6|7|8|9|a|b|c|d|e|f|]*)|((([1|2|3|4|5|6|7|8|9][0|1|2|3|4|5|6|7|8|9]*|0)\.?|.)[0|1|2|3|4|5|6|7|8|9]*e?[+|-]?[0|1|2|3|4|5|6|7|8|9]*)/gi;

function utf8Encoding(str) {
  const Demarcation1 = 0x007f;
  let result = '';
  for (const char of str) {
    let unicodeCoding = char.codePointAt();
    let str = unicodeCoding.toString(2);
    if (unicodeCoding <= Demarcation1) {
      result += str.padStart(8, '0');
    } else {
      let codingList = getCodingList(str);
      let codingListLen = codingList.length;
      if (codingListLen === 2) {
        result += '110' + codingList[0].padStart(5, '0');
        result += '10' + codingList[1].padStart(6, '0');
      } else if (codingListLen === 3) {
        result += '1110' + codingList[0].padStart(4, '0');
        result += '10' + codingList[1].padStart(6, '0');
        result += '10' + codingList[2].padStart(6, '0');
      } else if (codingListLen === 4) {
        result += '11110' + codingList[0].padStart(3, '0');
        result += '10' + codingList[1].padStart(6, '0');
        result += '10' + codingList[2].padStart(6, '0');
        result += '10' + codingList[3].padStart(6, '0');
      }
    }
  }
  return result;

  function getCodingList(str) {
    let codingList = [];
    let codePointIdx = str.length;

    while (codePointIdx >= 0) {
      codingList.unshift(str.substring(codePointIdx - 6, codePointIdx));
      codePointIdx -= 6;
    }
    return codingList;
  }
}
console.log(utf8Encoding('ஐ'), 2);
console.log(parseInt(utf8Encoding('ஐ'), 2).toString(16));
console.log(utf8Encoding('À'), 2);
console.log(parseInt(utf8Encoding('À'), 2).toString(16));
console.log(utf8Encoding('A'), 2);
console.log(parseInt(utf8Encoding('A'), 2).toString(16));
console.log(utf8Encoding('M'), 2);
console.log(parseInt(utf8Encoding('M'), 2).toString(16));
console.log(utf8Encoding('严'), 2);
console.log(parseInt(utf8Encoding('严'), 2).toString(16));
console.log(utf8Encoding('亮'), 2);
console.log(parseInt(utf8Encoding('亮'), 2).toString(16));

let stringReg = /\"[\n|\b|\f|\'\r\t\v]?[^\"|\\][\u0000-\u10ffff]*\"/g;

stringReg = /(\"[\n|\b|\f|\'\r\t\v]*[^\"]+\")|(\'[\n|\b|\f|\'\r\t\v]*[^\']+\')/g;
let String = '"213 \\33"asd"sad"233"331"33';
console.log(String.match(stringReg));
