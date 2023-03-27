import {request} from '@/utils/request'

/**
 * @method addUserLogin 登录
 * @param {*} data
 * @returns
 */
export function addUserLogin(data) {
  return request({
    url: '/1.0/user/login',
    method: 'post',
    data
  })
}

/**
 * @method addUserInfo 用户信息
 * @param {*} data
 * @returns
 */
export function addUserInfo(data) {
  return request({
    url: '/1.0/user/addOrUpdate',
    method: 'post',
    data
  })
}

// 用户列表
export function getUserList(data) {
  return request({
    url: '/1.0/user/pageQuery',
    method: 'post',
    data
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/1.0/user/deleteUser',
    method: 'get',
    params:data
  })
}

