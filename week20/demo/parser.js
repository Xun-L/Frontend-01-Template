let currentToken = null
let currentAttribute = null
let currentTextNode = null

//let cssParse = require('./cssParse');

function emit(token) {
  let top = stack[stack.length - 1]
  if (token.type == 'startTag') {
    let ele = {
      type: 'element',
      children: [],
      attributes: []
    }
    ele.tagName = token.tagName

    for (let p in token) {
      if (p != 'type' && p != 'tagName' && p != 'isSelfClosing') {
        ele.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    ele.parent = top

    //  cssParse.computeCSS(ele);

    top.children.push(ele)

    if (!token.isSelfClosing) {
      stack.push(ele)
    }
    currentTextNode = null
  } else if (token.type == 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('error')
    } else {
      if (token.tagName === 'style') {
        //    cssParse.addCSSRules(top.children[0].content);
      }

      stack.pop()
    }
  } else if (token.type == 'text') {
    if (currentTextNode == null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }

      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

const EOF = Symbol('EOF')
const stack = [{ type: 'document', children: [] }]
function data(c) {
  if (c === '<') {
    return tagOpen
  }

  if (c === EOF) {
    return
  }
  emit({
    type: 'text',
    content: c
  })
  return data
}
function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  }
  if (c.match(/^[a-zA-Z]/)) {
    currentToken = {
      tagName: '',
      type: 'startTag'
    }
    return tagName(c)
  }
  emit({
    type: 'text',
    content: c
  })
  return tagOpen
}

function tagName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName
  }
  if (c === '/') {
    return selfClosingStartTag
  }
  if (c.match(/^[a-zA-Z]/)) {
    currentToken.tagName += c
    return tagName
  }
  if (c === '>') {
    emit(currentToken)
    return data
  }
  currentToken.tagName += c
  return tagName
}
function endTagOpen(c) {
  currentToken = {
    tagName: '',
    type: 'endTag'
  }
  if (c === '>') {
    return data
  }

  return tagName(c)
}

//in script
function scriptData(c) {
  if (c == '<') {
    return scriptDataLessThanSign
  } else {
    emit({
      type: 'text',
      content: c
    })

    return scriptData
  }
}

//in script received <
function scriptDataLessThanSign(c) {
  if (c == '/') {
    return scriptDataEndTagOpen
  } else {
    emit({
      type: 'text',
      content: '<'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}

//in script received </
function scriptDataEndTagOpen(c) {
  if (c == 's') {
    return scriptDataEndTagOpenS
  } else {
    emit({
      type: 'text',
      content: '</'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}

function scriptDataEndTagOpenS(c) {
  if (c == 'c') {
    return scriptDataEndTagOpenC
  } else {
    emit({
      type: 'text',
      content: '</s'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataEndTagOpenC(c) {
  if (c == 'r') {
    return scriptDataEndTagOpenR
  } else {
    emit({
      type: 'text',
      content: '</sc'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataEndTagOpenR(c) {
  if (c == 'i') {
    return scriptDataEndTagOpenI
  } else {
    emit({
      type: 'text',
      content: '</scr'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataEndTagOpenI(c) {
  if (c == 'p') {
    return scriptDataEndTagOpenP
  } else {
    emit({
      type: 'text',
      content: '</scri'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataEndTagOpenP(c) {
  if (c == 't') {
    return scriptDataEndTagOpenT
  } else {
    emit({
      type: 'text',
      content: '</scrip'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}
function scriptDataEndTagOpenT(c) {
  if (c == ' ') {
    return scriptDataEndTagOpenT
  }

  if (c == '>') {
    emit({
      type: 'endTag',
      tagName: 'script'
    })
    currentToken = {
      tagName: '',
      type: 'startTag'
    }
    return data
  } else {
    emit({
      type: 'text',
      content: '</script'
    })
    emit({
      type: 'text',
      content: c
    })
    return scriptData
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  }
}
function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName
  }
  if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  }
  currentAttribute = {
    name: '',
    value: ''
  }
  return attributeName(c)
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f\s]$/)) {
    return afterAttributeName
  }
  if (c === '/') {
    return selfClosingStartTag
  }
  if (c === '=') {
    return beforeAttributeValue
  }
  if (c === '>') {
    emit(currentToken)
    return data
  }

  return attributeName(c)
}
function attributeName(c) {
  if (c.match(/^[\t\n\f\s\/>]$/)) {
    return afterAttributeName(c)
  }
  if (c === '=') {
    return beforeAttributeValue
  }
  currentAttribute.name += c
  return attributeName
}
function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\s\f\/>]$/)) {
    return beforeAttributeValue
  }
  if (c === '"') {
    return doubleQuotedAttributeValue
  }
  if (c === "'") {
    return singleQuotedAttributeValue
  }
  if (c === '>') {
    return data
  }
  return UnquotedAttributeValue(c)
}
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    return afterQuotedAttributeName
  }
  currentAttribute.value += c
  return doubleQuotedAttributeValue
}
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    return afterQuotedAttributeName
  }
  currentAttribute.value += c
  return singleQuotedAttributeValue
}
function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f\s\/>]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  }
  currentAttribute.value += c
  return UnquotedAttributeValue
}
function afterQuotedAttributeName(c) {
  currentToken[currentAttribute.name] = currentAttribute.value
  if (c.match(/^[\t\n\f\s]$/)) {
    return beforeAttributeName
  }
  if (c === '/') {
    return selfClosingStartTag
  }
  if (c === '>') {
    emit(currentToken)
    return data
  }
  return beforeAttributeName(c)
}

module.exports.parseHTML = function (html) {
  let state = data
  for (let c of html) {
    state = state(c)
    if (currentToken && currentToken.tagName == 'script' && state == data) {
      state = scriptData
    }
  }
  state = state(EOF)

  return stack[0]
}
