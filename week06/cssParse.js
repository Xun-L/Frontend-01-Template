const css = require('css');
let rules = [];
module.exports.addCSSRules = function (text) {
  let ast = css.parse(text);
  rules = [...ast.stylesheet.rules];
};

module.exports.computeCSS = function (ele) {
  let eleStacks = [ele];
  let elePoint = ele;
  while (elePoint.parent) {
    eleStacks = [...eleStacks, elePoint.parent];
    elePoint = elePoint.parent;
  }
  if (!ele.computedStyle) {
    ele.computedStyle = {};
  }
  for (let rule of rules) {
    let matched = false;
    let selectorParts = rule.selectors[0].split(' ').reverse();
    if (!match(eleStacks[0], selectorParts[0])) {
      continue;
    }
    let j = 1;
    for (let i = 1; i < eleStacks.length; i++) {
      if (match(eleStacks[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      let weights = specificity(rule.selectors);
      let computedStyle = ele.computedStyle;
      for (let declaration of rule.declarations) {
        let property = declaration.property;
        if (computedStyle[property]) {
          if (compare(weights, computedStyle[property].specificity)>0) {
            computedStyle[property] = {
              value: declaration.value,
              specificity: weights,
            };
          }
        } else {
          computedStyle[property] = {
            value: declaration.value,
            specificity: weights,
          };
        }
      }

      console.log('element', ele);
    }
  }
};
function match(ele, sel) {
  if (!sel || !ele.attributes) {
    return false;
  }
  if (sel.indexOf('#') === 0 && ele.attributes.find((n) => n.name === 'id')) {
    let eleId = ele.attributes.find((n) => n.name === 'id').value;
    if (sel.substring(1) === eleId) {
      return true;
    }
  } else if (
    sel.indexOf('.') === 0 &&
    ele.attributes.find((n) => n.name === 'class')
  ) {
    let eleClass = ele.attributes.find((n) => n.name === 'class').value;
    if (sel.substring(1) === eleClass) {
      return true;
    }
  } else {
    if (sel === ele.tagName) {
      return true;
    }
  }
  return false;
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  let parts = selector[0].split(' ');
  for (let sel of parts) {
    if (sel.indexOf('#') === 0) {
      p[2] = p[2] + 1;
    } else if (sel.indexOf('.') === 0) {
      p[1] = p[1] + 1;
    } else {
      p[0] = p[0] + 1;
    }
    return p;
  }
}
function compare(sp1, sp2) {
  if (sp2[3] !== sp1[3]) {
    return sp2[3] - sp1[3];
  }
  if (sp2[2] !== sp1[2]) {
    return sp2[2] - sp1[2];
  }
  if (sp2[1] !== sp1[1]) {
    return sp2[1] - sp1[1];
  }
  if (sp2[0] !== sp1[0]) {
    return sp2[0] - sp1[0];
  }
  return 1
}
