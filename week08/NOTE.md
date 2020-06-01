# 每周总结可以写在这里

inline-box; 

### vertical-align: top
 
 inline-box 以 line-box top align 

### vertical-align: bottom

  inline-box 以 line-box bottom align 

### vertical-align: middle

  vertical-align: middle 

  inline-box position 以 max-height inline-box vertical-align 为基线 (不包括 baseline text-top text-bottom)

  再以自身设置 middle 基准线

  存在 比 自身 高 的 inline-box has middle 

  那么 自身 middle 将与 其 对齐

### vertical-align: baseline

  line-box 存在 inline-box middle 
  
  该 inline-box position 则以该  inline-box middle 为准, 
  
  如果不存在 middle 者以 最高 inline-box vertical-align 为准


### vertical-align: text-top

  基线需要在 inline-box 的 top位置

### vertical-align: text-bottom

  基线需要在 inline-box 的 bottom位置

  