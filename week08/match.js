function match(selector, element) {
  let [selectorItems, combineItems] = parseSelector(selector);
  let checkEle = element;
  let combineStatus = '';
  while (selectorItems.length && checkEle) {
      let selectorItem = selectorItems.pop();
      if (matchSelector(checkEle, selectorItem)) {
          let combineItem = combineItems.pop();
          if (combineItem.indexOf('>') > -1) {
              checkEle = checkEle.parentNode;
              combineStatus = 'direct';
          } else {
              combineStatus = 'ancestor';
          }
      } else if (combineStatus == 'ancestor') {
          checkEle = checkEle.parentNode;
      } else {
          return false;
      }
  }
  if (selectorItems.length == 0) {
      return true
  }
  return false
}

console.log(match("div #id.class", document.getElementById("id")));

function parseSelector(selector) {
  selector = selector.trim();
  selector.match(/((.*)([\s|\s+>\s|])*)*/);
  let selectorItems = selector.split(/[>|+|~|\s+]/).filter((n) => n != '');
  let combineItems = selector.match(/\s*>\s*|\s*\+\s*|\s*~\s*|\s+/g);
  return [selectorItems, combineItems];
}

function matchSelector(ele, selGroup) {
  let selList = selGroup.match(/#.[^\.]+|\..[^\.]+|.[^\.#]+/g)

  while (selList.length) {
      let sel = selList.pop();

      if (sel.indexOf('#') > -1 && Array.from(ele.attributes).find((n) => n.name === 'id')) {
          let eleId = Array.from(ele.attributes).find((n) => n.name === 'id').value;
          if (sel.substring(1) !== eleId) {
              return false
          }

      } else if (
          sel.indexOf('.') > -1 &&
          Array.from(ele.attributes).find((n) => n.name === 'class')
      ) {
          let eleClass = Array.from(ele.attributes).find((n) => n.name === 'class').value;
          if (sel.substring(1) !== eleClass) {
              return false;
          }
      } else {
          if (sel !== ele.tagName) {
              return false;
          }
      }

  }

  return true;
}
match("div #id.class", document.getElementById("id"));