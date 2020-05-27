
function getStyle(element) {
  if(!element.style){
    element.style = {}
  }

  for(let prop in element.computeStyle){
    let p = element.computeStyle.value
    element.style[prop] = element.computeStyle[prop]
  }

}

function layout(element) {
  if (!element.computeStyle) {
    return
  }

  const elementStyle = getStyle(element)

  // if (elementStyle.display !== 'flex') {
  //   return
  // }

  const items = element.children.filter(e => e.type === 'element')

  items.sort((a, b) => {
    return (a.order || 0) || (b.order || 0)
  })

  let style = elementStyle

  // ['width', 'height'].forEach(size => {
  //   if (style[size] === 'auto' || style[size] === '') {
  //     style[size] = null
  //   }
  // })

  // if (!style.flexDirection || style.flexDirection === 'auto') {
  //   style.flexDirection = 'row'
  // }
  // if (!style.alignItems || style.alignItems === 'auto') {
  //   style.alignItems = 'stretch'
  // }
  // if (!style.justifyContent || style.justifyContent === 'auto') {
  //   style.justifyContent = 'flex-start'
  // }
  // if (!style.flexWrap || style.flexWrap === 'auto') {
  //   style.flexWrap = 'nowrap'
  // }
  // if (!style.alignContent || style.alignContent === 'auto') {
  //   style.alignContent = 'stretch'
  // }
}




module.exports = layout