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

const getProcess = require('../../utils/apis/getProcess');

Page({
  data: {
    verticalCurrent: 0,
    step1: '',
    step2: '',
    step3: ''
  },

  onLoad(options) {
    const _this = this;

    wx.request({
      url: `${api}/${getProcess}`,
      data: {
        id: options.id
      },
      success({
        data
      }) {
        const info = data.data;
        console.log(info);
        const step1 = info.creator ? `${info.creator}于${info.createtime}上报事件` : '上报事件'
        const step2 = info.eventstatus == 0 ? '事件受理' : `${info.receiver}已受理`
        const step3 = info.dealer ? `事件已派给${info.dealer}处理` : '事件派遣'
        let verticalCurrent = '';
				if (!info.dealer && info.eventstatus) {
          verticalCurrent = 1
        } else if (info.eventstatus) {
          verticalCurrent = 0
        }
        if (info.dealer) {
          verticalCurrent = 2
				}

        _this.setData({
          step1,
          step2,
          step3,
          verticalCurrent
        })
      }
    })
  },

  handleClick() {
    const addCurrent = this.data.current + 1;
    const current = addCurrent > 2 ? 0 : addCurrent;
    this.setData({
      'current': current
    })
  }
})