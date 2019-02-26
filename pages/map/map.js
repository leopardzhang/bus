import {
	err_ok
} from '../../utils/apis/error';

const app = getApp();
const {
	$Message
} = require('../../dist/base/index');
const {
	api
} = app.globalData;

const getPoint = require('../../utils/apis/getPoint');

Page({

  data: {
    latitude: null,
    longitude: null
  },

  onLoad(options) {
    const _this = this;

		wx.request({
			url: `${api}/${getPoint}`,
			success(res) {
				console.log(res);
			}
		})

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        _this.setData({
          latitude,
          longitude
        })
      }
    })
  },


})