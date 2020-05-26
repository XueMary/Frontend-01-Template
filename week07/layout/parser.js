// css parse
const css = require('css')
const layout = require('layout')

let currentToken = null
let currentAttribute = null

let stack = [{ type: "document", children: [] }]
let currentTextNode = null

let rules = []
function addCSSRules(text) {
  let ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function computeCss(element) {
  let elements = stack.slice().reverse()
  if (element.computeStyle === undefined) {
    element.computeStyle = {}
  }

  for (let rule of rules) {
    let matched = false
    let selectorParts = rule.selectors[0].split(' ').reverse()

    if (match(element, selectorParts[0]) === false) {
      continue
    }
    
    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }

    if (j >= selectorParts.length) {
      matched = true
    }

    if (matched) {
      // 将样式加入 element  
      let sp = specificity(rule.selectors[0])
      rule.declarations.forEach(item=>{
        if(element.computeStyle[item.property]===undefined){
          element.computeStyle[item.property] = {}
        }
        if(element.computeStyle[item.property].value){
          // specificity()
          if(compare(element.computeStyle[item.property].specificity, sp)){
            element.computeStyle[item.property].value = item.value
            element.computeStyle[item.property].specificity = sp
          }
        }else{
          element.computeStyle[item.property].value = item.value
          element.computeStyle[item.property].specificity = sp
        } 
        
      })
    }

  }
}

function compare(a, b) {
  let is = false
  for(let i = 0; i<a.length; i++){
    if(a[i]<b[i]){
      is = true
      break;
    }else if(a[i]>b[i]){
      break;
    }
  }
  return is
}

function specificity(selector) {
  let p = [0,0,0,0]
  const selectorPart = selector.slice(' ')
  for(let part of selectorPart){
    if(part.charAt(0)==='#'){
      p[1]+=1
    }else if(part.charAt(0)==='.'){
      p[2]+=1
    }else {
      p[3]+=1
    }
  }
  return p
}

function match(element, selector) {
  if (element === undefined || selector === undefined) {
    return false;
  }
  if (selector.charAt(0) === '#') {
    let attr = element.attributes.filter(attr => attr.name === 'id')
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    let attr = element.attributes.filter(attr => attr.name === 'class')
    if (attr && attr.value === selector.replace('.', '')) {
      return true
    }
  } else {
    if (element.tagName === selector) {
      return true
    }
  }
  return false

}

function emit(token) {

  let top = stack[stack.length - 1]
  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }
    element.tagName = token.tagName

    for (let p in token) {
      if (p !== "type" && p !== "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    computeCss(element)
    top.children.push(element)
    element.parent = top
    if (!token.isSelfClosing) {
      stack.push(element)
    }
    currentTextNode = null

  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error("tag start end doesn't match")
    } else {
      if (token.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }

      layout(top)
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

const EOF = Symbol("EOF")

function data(c) {
  if (c === "<") {
    return tagOpen
  } else if (c === EOF) {
    emit({
      type: 'EOF',
    })
    return;
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}


function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: ''
    }
    return tagName(c)
  } else {
    return;
  }
}

function tagName(c) {
  if (c.match(/^[\f\t\n ]$/)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(/^[a-zA-z]$/)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else {
    currentToken.tagName += c
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\f\t\n ]$/)) {
    return beforeAttributeName
  } else if (c === '>' || c === '/' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {

  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(/^[\f\t\n ]$/) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName
  }
  if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === "\"" || c === "'" || c === "<") {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\f\t\n ]$/)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
  }
}



function beforeAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === "\"") {
    return DoubleQuotedAttributeValue
  } else if (c === "\'") {
    return SingleQuotedAttributeValue
  } else if (c === ">") {
    emit(currentToken)
    return data
  } else {
    return UnquotedAttributeValue(c)
  }
}

function DoubleQuotedAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/) || c === "\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return DoubleQuotedAttributeValue
  }
}
function SingleQuotedAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/) || c === "\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return DoubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === 'EOF') {

  } else {

  }
}

module.exports.parseHTML = function (html) {
  let state = data
  for (let c of html) {
    state = state(c)
  }
  state = state(EOF)
  return stack[0]
}