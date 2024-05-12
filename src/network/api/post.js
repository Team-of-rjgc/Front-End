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
    url: `/api/v1/user/detail`,
    method: 'post',
    params: params,
  });
}
//帖子评论详情
export function commentDetail(params) {
  return request({
    url: `/api/v1/user/comments`,
    method: 'post',
    params: params,
  });
}

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
//获取与我相关的评论
export function messages() {
  return request({
    url: '/api/v1/user/messages',
    method: 'post',
  });
}
