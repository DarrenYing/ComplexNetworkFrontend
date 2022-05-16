// 一些通用的方法

// 节流，自定义函数触发频率
function throttle(func, delay=500) {
  let timer = null;

  return function () {
    if (timer) return
    timer = setTimeout(() => {
      func();
      timer = null; //清除计时器，使其能再次触发
    }, delay);
  }
}


// 防抖
function debounce(func, delay=1000) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func();
    }, delay);
  }
}
