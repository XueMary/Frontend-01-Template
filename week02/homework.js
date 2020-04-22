/**
 * 写一个正则表达式 匹配所有 Number 直接量
 * 可带正负符号
 * 11 11. .11 11.11 两位以上不能已0开头 10进制
 * 0 b/B 11 2进制
 * 0 o/O 11 8进制
 * 0 x/X 11 16进制
 * 1e11
 */
const regexNumber = /^([-+]?(([1-9]\d*)|\d|(\d*)\.\d*)(e\d+)?|0[bB][01]+|0[oO][0-7]+|0[xX][0-9A-F]+)$/

/**
 * utf 8
 * 0xxxxxxx 7
 * 110xxxxx 10xxxxxx 11
 * 1110xxxx 10xxxxxx 10xxxxxx 16
 * 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx 21
 */
function UTF8Encoding(string) {
  const codeNumber = string.codePointAt()
  const binary = codeNumber.toString(2)
  let binaryLen = binary.length
  const len = binaryLen
  let template = null
  if (len <= 7) {
    template = ['0xxxxxxx']
  } else if (len <= 11) {
    template = ['110xxxxx', '10xxxxxx']
  } else if (len <= 16) {
    template = ['1110xxxx', '10xxxxxx', '10xxxxxx']
  } else if (len <= 21) {
    template = ['11110xxx', '10xxxxxx', '10xxxxxx', '10xxxxxx']
  } else {
    throw Error('超出utf-8存储范围')
  }
  for (let j = template.length-1; j >= 0; j--) {
    const item = template[j] // 10xxxxxx
    const rex = /x/g
    let len = item.match(rex).length
    let arr = item.split('')
    for (let i = 8-1; i >= 8-len; i--) {
      arr[i] = binary[binaryLen-1]
      binaryLen--
    }
    template[j] = arr.join('')
  }
  return template.join('').replace('x', '0')
}


/**写一个正则表达式，匹配所有的字符串直接量，单引号和双引号 */
const regexString = /^("[^"]*[^\\]")|('[^']*[^\\]')$/