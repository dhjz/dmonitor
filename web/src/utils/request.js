import axios from 'axios'
import { ElNotification , ElMessageBox, ElMessage, ElLoading } from 'element-plus'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '/monitor-api',
  // 超时
  timeout: 40000
})


service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const msg = res.data.msg || '操作失败'
  // 二进制数据则直接返回
  if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
    return res.data
  }
  if (code !== 200) {
    ElMessage.error(msg)
    return Promise.reject('error')
  } else {
    return Promise.resolve(res.data)
  }
}, error => {
  console.log('err' + error)
  let { message } = error;
  if (message == "Network Error") {
    message = "后端接口连接异常";
  } else if (message.includes("timeout")) {
    message = "系统接口请求超时";
  } else if (message.includes("Request failed with status code")) {
    message = "系统接口" + message.substr(message.length - 3) + "异常";
  }
  ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
  return Promise.reject(error)
})


export default service
