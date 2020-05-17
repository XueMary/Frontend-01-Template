// 添加属性

let currentToken = null
let currentAttribute = null

function emit(token) {
  if (token.type !== 'text') {
    console.log(token)
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
  } else if(c==='\u0000'){

  } else if(c==="\"" || c==="'" || c==="<"){

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
  }else if (c === '>') {
    emit(currentToken)
    return data
  } else if (c === EOF) {
  }
}



function beforeAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if(c==="\""){
    return DoubleQuotedAttributeValue
  } else if(c==="\'"){
    return SingleQuotedAttributeValue
  } else if(c===">"){
    emit(currentToken)
    return data
  } else{
    return UnquotedAttributeValue(c)
  }
}

function DoubleQuotedAttributeValue (c) {
  if(c.match(/^[\f\t\n ]$/) || c==="\"") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if(c==='/'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if(c===">"){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return DoubleQuotedAttributeValue
  }
}
function SingleQuotedAttributeValue (c) {
  if(c.match(/^[\f\t\n ]$/) || c==="\'") {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if(c==='/'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if(c===">"){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else {
    currentAttribute.value += c
    return DoubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue(c) {
  if(c.match(/^[\f\t\n ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if(c==='/'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if(c===">"){
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
}