import { request } from '../request';
//分页查询帖子
export function postPage(data) {
  return request({
    url: '/api/v1/user/page',
    method: 'post',
    data,
  });
}
//帖子详情
export function postDetail(params) {
  return request({
    url: `/api/v1/user/detail?id=${params}`,
    method: 'post',
    // params: JSON.string(params),
    // params: params,
  });
}
//帖子评论详情
export function commentDetail(params) {
  return request({
    url: `/api/v1/user/commentDetail`,
    method: 'post',
    params: params,
  });
}

// // 图片验证码
// export function getVerifyCode() {
//   return request({
//     url: '/api/v1/public/verifyCode',
//     method: 'get',
//   });
// }
//发布评论
export function comment(data) {
  return request({
    url: '/api/v1/user/comment',
    method: 'post',
    data,
  });
}
//删除评论
export function removeLost(data) {
  return request({
    url: '/api/v1/user/removeLost',
    method: 'post',
    data,
  });
}
//设置昵称
export function setNickName(params) {
  return request({
    url: '/api/v1/user/setNickName',
    method: 'post',
    params,
  });
}
// 发布帖子
export function publish(data) {
  return request({
    url: '/api/v1/user/pub',
    method: 'post',
    data,
  });
}
// 获取物品类别列表
export function getCategory() {
  return request({
    url: '/api/v1/common/category',
    method: 'post',
  });
}