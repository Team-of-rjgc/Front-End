import { reject } from 'lodash'
import API from '../network'

/**
 * 传入文件名 下载图片
 * @param {fileName} 文件名
 * @returns {} base64编码的文件流
 */
export function downloadImg(fileName) {
  return new Promise(resolve => {
    API.publicApi.downloadImage({ fileName })
      .then(({data}) => {
        const blob = data
        let res = window.URL.createObjectURL(blob)
        resolve(res)
      })
      .catch((err) => {
        console.log('err', err)
        reject(null)
      })
  })
}

/** 
 * 弹出消息提示框
 * @param {message} 消息内容
 * @param {type} 消息提示框类型
 * @param {duration} 消息框显示持续时间
 * @param {showClose} 是否显示删除按钮
 */
export function showMessage(message, type, duration, showClose) {
  if (message && type) {
    ElMessage({
      message,
      type: type || 'info',
      duration: duration || 1500,
      showClose,
    })
  } else {
    console.warn('showMessage参数不足！')
  }
}