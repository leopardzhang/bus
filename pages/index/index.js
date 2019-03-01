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

const loginApi = require('../../utils/apis/login');
const report = require('../../utils/apis/report');
const getReport = require('../../utils/apis/getType');
const imgUpload = require('../../utils/apis/imgUpload');

Page({
  data: {
    eventClass: null,
    eventClassList: null,
    eventDegree: ['一般', '紧急', '严重'],
    eventDegreeList: [1, 2, 3],
    eventName: '',
    describion: '',
    classIndex: null,
    degreeIndex: null,
    imgList: []
  },

  onLoad(options) {
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

				_this.setData({
					eventClass,
					eventClassList
				})
      }
    });

    wx.checkSession({
      fail(err) {
        wx.navigateTo({
          url: '../login/login'
        })
      }
    })
  },

  bindClassChange(e) {
    const _this = this;

    this.setData({
      classIndex: e.detail.value
    })
  },

  bindDegreeChange(e) {
    const _this = this;

    this.setData({
      degreeIndex: e.detail.value
    })
  },

  // 选择照片
  choseImg() {
    const _this = this;
    let imgList = _this.data.imgList;
    const num = 1;

    wx.chooseImage({
      count: num,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        if (res.errMsg === "chooseImage:ok") {
          const tempFilePaths = res.tempFilePaths;

          for (const item of tempFilePaths) {
            imgList.push(item);
          }

          _this.setData({
            imgList
          });
        } else {
          console.log("选择图片失败");
        }
      }
    });
  },

  /**
   * 移除图片
   */
  remove() {
    this.setData({
      imgList: []
    })
  },

  eventChange({
    detail
  }) {
    this.setData({
      eventName: detail.detail.value
    })
  },

  describionChange({
    detail
  }) {
    this.setData({
      describion: detail.detail.value
    })
  },

  /**
   * 提交表单
   */
  handleClick() {
    const data = this.data;
    const _this = this;

    for (const key in data) {
      if (!data[key]) {
        $Message({
          content: '请填写全部信息',
          type: 'warning'
        });
        return false;
        break;
      }
    }

    const step = new Promise((responst, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success(res) {
					const position = `${res.longitude},${res.latitude}`;

          responst(position);
        },
        fail(err) {
          reject();
        }
      })
    }).then((position) => {
      const info = {
        eventtypeid: data.eventClassList[data.classIndex],
        eventname: data.eventName,
        comments: data.describion,
        urgency: data.eventDegreeList[data.degreeIndex],
        position,
        creatorid: wx.getStorageSync('user_id')
      }

      wx.request({
        url: `${api}/${report}`,
        method: 'POST',
        data: info,
        success({
          data
        }) {
					if (_this.data.imgList.length>0) {
						wx.uploadFile({
							url: `${api}/${imgUpload}`,
							filePath: _this.data.imgList[0],
							name: 'file',
							formData: {
								eventid: data.id
							},
							success(res) {
								if(res.data.code == err_ok) {
									$Message({
										content: '提交成功',
										type: 'success'
									});
								} else {
									reject();
								}
							}
						})
					}
        },
        fail(err) {
          console.log(err);
        }
      })
    }).catch((err) => {
      $Message({
        content: '提交失败请检查网络状态后重试',
        type: 'wrong'
      });
    });
  }
})