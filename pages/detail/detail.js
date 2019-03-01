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

const getDetail = require('../../utils/apis/getDetail');
const getReport = require('../../utils/apis/getType');

Page({
  data: {
    eventInfo: null,
		markers: [],
		eventDegree: ['一般', '紧急', '严重'],
		ev: null
  },

  onLoad({
		id
	}) {
		const _this = this;

		wx.request({
			url: `${api}/${getReport}`,
			success({
				data
			}) {
				const [eventClass, eventClassList] = [
					[],
					[]
				];
				for (const item of data) {
					eventClass.push(item.typename);
					eventClassList.push(item.eventtypeid);
				}

				

				let ev = {};
				for (const index in eventClassList) {
					ev[eventClassList[index]] = eventClass[index]
				}

				_this.setData({
					ev
				})
			}
		})

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
				console.log(data);
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