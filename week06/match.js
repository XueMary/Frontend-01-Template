function match(p, string) {
  const obj = {}
  for (let i = 0; i < p.length; i++) {
    obj[i] = function (s) {
      if (s === p[i]) {
        if (i === p.length -1) {
          return end
        }
        return obj[i + 1]
      } else {
        if(i!=0){
          return obj[0](s)
        }else {
          return obj[0]
        }
         
      }
    }
  }
  
  function end(){
    return end
  }

  let state = obj[0]
  for (let s of string) {
    state = state(s)
  }
  return state === end
}

console.log(match('abcabx', '2222dababcabxdasd'))