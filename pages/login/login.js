import {
	errOK
} from '../../utils/apis/error.js';

const app = getApp();
const {
  $Message
} = require('../../dist/base/index');
const {
  appid,
  secret,
  api
} = app.globalData;

const loginApi = require('../../utils/apis/login.js');

Page({
  data: {
    userName: '',
    userPwd: ''
  },

  onLoad(options) {

  },

  /**
   * 用户提交操作
   */
  handleClick() {
    const _this = this;
    const {
      userName,
      userPwd
    } = this.data;

    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: `${api}/${loginApi}`,
            method: 'POST',
            data: {
              js_code: res.code,
              appid: `${appid}`,
              secret: `${secret}`,
              userName,
              userPwd
            },
            success({
              data
            }) {
              if (data.code == errOK) {
                $Message({
                  content: '登录成功',
                  type: 'success'
                });

								setTimeout(() => {
									wx.switchTab({
										url: '../index/index'
									})
								}, 2000);
              } else {
								$Message({
									content: '登录失败,用户名或密码错误',
									type: 'error'
								});
							}
            }
          })
        } else {
          $Message({
            content: '登录失败,请检查网络状态',
            type: 'error'
          });
        }
      }
    })
  },

  usernameChange({
    detail
  }) {
    this.setData({
      userName: detail.detail.value
    })
  },

  userpwdChange({
    detail
  }) {
    this.setData({
      userPwd: detail.detail.value
    })
  }
})