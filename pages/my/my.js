import {
  err_ok
} from '../../utils/apis/error.js';

const app = getApp();

const {
  $Message
} = require('../../dist/base/index');
const {
  api
} = app.globalData;

const getEventList = require('../../utils/apis/getEvent');

Page({

  data: {
		page: 1
  },

  onLoad(options) {
		this.fnGetEventList();
  },

  fnGetEventList() {
		const offset = this.page;

    wx.request({
      url: `${api}/${getEventList}`,
      data: {
        limit: 10,
        offset,
        receiverid: wx.getStorageSync('user_id')
      },
      success(res) {
        console.log(res);
      }
    })
  }
})