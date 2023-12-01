import axios from "axios"
import {ElMessage} from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
import router from "../router"

export const request = axios.create({
    baseURL: "/api"
})

request.interceptors.request.use(config => {
    const tokenStore = useTokenStore()
    // 请求头的config添加token
    if (tokenStore.token) {
        config.headers.Authorization = tokenStore.token
    }
    return config
}, err => {
    return Promise.reject(err)
})

request.interceptors.response.use(resp => {
    let {code, data, message} = resp.data
    if (code === 0) {
        return resp.data
    } else if (code === 1) {
        ElMessage.error(message ? message : '服务器发生错误！')
        return Promise.reject(data)
    }
}, err => {
    //判断响应状态码是否是401 UN_AUTHORIZAION
    if (err.response.status === 401) {
        ElMessage.error('请先登录')
        router.push('/login')
    } else {
        ElMessage.error('服务异常！')
    }
    return Promise.reject(err)
})