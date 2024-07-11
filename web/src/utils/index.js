export function getStorage(key) {
  let result = localStorage.getItem(key)
  try {
    return JSON.parse(result)
  } catch {
    return result 
  }
}
export function setStorage(key, val) {
  if (val || val === 0) localStorage.setItem(key, JSON.stringify(val))
}

export function formatSecond(seconds) {
  let h = Math.floor(seconds / 3600) + ''; // 计算小时数
  let m = Math.floor((seconds % 3600) / 60) + ''; // 计算分钟数
  let s = Math.floor(seconds % 60) + ''; // 计算秒数

  // 使用 padStart 函数补零
  var hDisplay = h.toString().padStart(2, '0');
  var mDisplay = m.toString().padStart(2, '0');
  var sDisplay = s.toString().padStart(2, '0');
  
  // 组合最终的时:分:秒格式字符串
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`; 
}


export function encode(str) {
  if (!str) return str
  return Math.random().toString(32).slice(-8) + str.substr(str.length - 1,1) + str + str.substr(str.length - 1,1) + str.substr(0,1) + Math.random().toString(32).slice(-10) + '='
}

export function decode(str) {
  if (!str || str.length < 15) return str
  return str.substring(9, str.length - 13)
}