import {
  err_ok
} from '../../utils/apis/error'

const app = getApp()
const {
  $Message
} = require('../../dist/base/index')
const {
  api
} = app.globalData

const getDetail = require('../../utils/apis/getDetail')

Page({
  data: {
    eventInfo: null,
		markers: []
  },

  onLoad({
		id
	}) {
    this.getDetail(id)
  },

  getDetail(id) {
    const _this = this

    wx.request({
      url: `${api}/${getDetail}`,
      method: 'POST',
      data: {
        id
      },
      success({
        data
      }) {
        _this.setData({
          eventInfo: data,
					markers: [{
            iconPath: '../../assets/marker_red.png',
            id: 0,
						latitude: data.positiony,
						longitude: data.positionx,
            width: 20,
            height: 20
          }]
        })
      }
    })
  }
})