import { login, userInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/common/auth'
import { saveToSession } from '@/common/session-storage'
import { resetRouter } from '@/router'

const SET_ACCOUNT = 'SET_ACCOUNT'
const SET_TOKEN = 'SET_TOKEN'
const SET_AVATAR = 'SET_AVATAR'
const SET_PERMISSIONS = 'SET_PERMISSIONS'
const SET_ALL = 'SET_ALL'
const SET_INFO = 'SET_INFO'

const user = {
  state: {
    token: getToken(),
    account: '',
    userInfo: {
      name: '',
      age: 0,
      sex: 1,
      avatar: '',
      type: [],
      desc: ''
    },
    // 原始的用户permissions数据
    permissions: ''
  },
  mutations: {
    [SET_ACCOUNT](state, account) {
      state.account = account
    },
    [SET_TOKEN](state, token) {
      state.token = token
    },
    [SET_AVATAR](state, avater) {
      state.userInfo.avatar = avater
    },
    [SET_PERMISSIONS](state, permissions) {
      state.permissions = permissions
    },

    [SET_ALL](state, userInfo) {
      state.userInfo = Object.assign(state.userInfo, userInfo)
    },
    [SET_INFO](state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 用户登录
    login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data)
          .then(resp => {
            let data = resp.data
            setToken(data.token)
            commit(SET_TOKEN, data.token)
            commit(SET_INFO, data.userInfo)
            commit(SET_PERMISSIONS, data.permissions)
            // 存路由按钮权限
            saveToSession('userRoutes', data.permissions)
            resolve()
          })
          .catch(err => {
            return reject(err)
          })
      })
    },
    // 拉取用户信息
    pullUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userInfo()
          .then(resp => {
            let data = resp.data
            console.log(data)
            resolve()
          })
          .catch(err => {
            return reject(err)
          })
      })
    },
    // 用户退出登录
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            removeToken()
            commit(SET_TOKEN, '')
            commit(SET_INFO, {})
            commit(SET_PERMISSIONS, [])
            return resolve()
          })
          .catch(err => {
            return reject(err)
          })
      })
    },
    // 头像更新
    doUpdateAvatar({ commit }, imgFile) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit(SET_AVATAR, imgFile)
          resolve()
        }, 1000)
      })
    },
    /**
     * 更新用户信息
     * userInfo: 用户信息表对象
     */
    doUpdateUser({ commit }, userInfo) {
      return new Promise(resolve => {
        commit(SET_ALL, userInfo)
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        sessionStorage.clear()
        resetRouter()
        resolve()
      })
    }
  }
}

export default user
