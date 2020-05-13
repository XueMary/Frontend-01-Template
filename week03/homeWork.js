

/**字符串转数字 */
// 没有支持科学计数 和16进制a-f
function stringToNumber(string, x) {
  let number = 0

  const rex16 = /^0[xX]\d*(\.[0-9A-Fa-f]+)?$/
  const rex8 = /^0[oO]\d*(\.[0-7]+)?$/
  const rex2 = /^0[bB]\d*(\.[0-1]+)?$/

  if(rex16.test(string)){
    string = string.replace(/[xX]/, '')
    x = 16
  } else if(rex8.test(string)){
    string = string.replace(/[oO]/, '')
    x = 8
  } else if(rex2.test(string)){
    string = string.replace(/[bB]/, '')
    x = 2
  } else{ 
    x = 10
  }

  let i = 0
  while(i<string.length){
    number *= x
    number += string[i].codePointAt(0) - '0'.codePointAt(0)
    i++;

    if(string[i] === '.'){
      break
    }
  }

  i++;
  let j = i
  
  while(j<string.length){
    number += (string[j].codePointAt(0) - '0'.codePointAt(0))/(x**(j-i+1))
    j++;
  }

  return number
}


function numberToString(string, x) {
  let number = 0

  const rex16 = /^0[xX]\d*(\.[0-9A-Fa-f]+)?$/
  const rex8 = /^0[oO]\d*(\.[0-7]+)?$/
  const rex2 = /^0[bB]\d*(\.[0-1]+)?$/

  if(rex16.test(string)){
    string = string.replace(/[xX]/, '')
    x = 16
  } else if(rex8.test(string)){
    string = string.replace(/[oO]/, '')
    x = 8
  } else if(rex2.test(string)){
    string = string.replace(/[bB]/, '')
    x = 2
  } else{ 
    x = 10
  }

  let i = 0
  while(i<string.length){
    number *= x
    number += string[i].codePointAt(0) - '0'.codePointAt(0)
    i++;

    if(string[i] === '.'){
      break
    }
  }

  i++;
  let j = i
  
  while(j<string.length){
    number += (string[j].codePointAt(0) - '0'.codePointAt(0))/(x**(j-i+1))
    j++;
  }

  return number
}