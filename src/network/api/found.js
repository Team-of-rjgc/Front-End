import { request } from '../request';
//帖子详情
export function register(data) {
  return request({
    url: '/api/v1/user/detail',
    method: 'post',
    data,
  });
}

export function getRegisterEmailCode(email) {
  return request({
    url: '/api/v1/public/getRegisterEmailCode',
    method: 'get',
    params: email,
  });
}

export function getResetEmailCode(email) {
  return request({
    url: '/api/v1/public/getResetEmailCode',
    method: 'get',
    params: email,
  });
}

// // 图片验证码
// export function getVerifyCode() {
//   return request({
//     url: '/api/v1/public/verifyCode',
//     method: 'get',
//   });
// }

export function login(data) {
  return request({
    url: '/api/v1/public/login',
    method: 'post',
    data,
  });
}

export function resetPassword(data) {
  return request({
    url: '/api/v1/public/resetPassword',
    method: 'post',
    data,
  });
}
