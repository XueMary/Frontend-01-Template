// 只关注标签

const EOF = Symbol("EOF")

function data(c) {
  if (c === "<") {
    return tagOpen
  } else if (c === EOF) {
    return;
  } else {
    return data
  }
}


function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(/^[a-zA-z]$/)) {
    return tagName(c)
  } else {
    return;
  }
}

function endTagOpen(c) {
  if (c.match(/^[a-zA-z]$/)) {
    return tagName(c)
  } else {
    return;
  }
}

function tagName(c) {
  if(c.match(/^[\f\t\n ]$/)){
    return beforeAttributeName
  } else if(c==='/'){
    return selfClosingStartTag
  } else if(c.match(/^[a-zA-z]$/)){
    return tagName
  } else if(c==='>'){
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(c){
  if(c.match(/^[\f\t\n ]$/)){
    return beforeAttributeName
  } else if(c === '>'){
    return data
  } else if(c==='='){
    return beforeAttributeName
  } else {
    return beforeAttributeName
  }
}

function selfClosingStartTag(c) {
  if(c==='>'){
    return data
  } else if(c === 'EOF'){

  }else {

  }
}

module.exports.parseHTML = function (html) {
  let state = data
  for (let c of html) {
    console.log(c)
    state = state(c)
  }
  state = state(EOF)
}