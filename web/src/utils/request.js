import axios from 'axios'
import { VueAxios } from './axios'

// 判断访问协议， https为外网访问
let baseURL = ''
if (window.location.protocol === 'https:') {
  baseURL = process.env.VUE_APP_API_BASE_URL_ALIYUN
} else {
  baseURL = process.env.VUE_APP_API_BASE_URL
}

const options = {
  baseURL: baseURL,
  timeout: 600 * 1000
}

const contentType = 'application/x-www-form-urlencoded'

// 创建 axios 实例
const request = axios.create(options)

request.defaults.headers.post['Content-Type'] = contentType

// 异常拦截处理器
const errorHandler = error => {
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
