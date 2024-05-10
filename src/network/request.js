import axios from 'axios'

export function request(config) {
    // 创建axios实例 返回的是Promise
    const instance = axios.create({
        // 设置基本地址
        baseURL: 'http://10.21.32.86:8080',
        // 设置超时时间 超过则自动终止，认为请求失败
        timeout: 10000,
        headers: {
            token: sessionStorage.getItem('token') || '',
            ...config.headers
        },
        withCredentials: true
    })
    return instance(config)
}

