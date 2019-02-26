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

const report = require('../../utils/apis/report');
const getReport = require('../../utils/apis/getType');
const imgUpload = require('../../utils/apis/imgUpload');
const getDetail = require('../../utils/apis/getDetail');
const getUser = require('../../utils/apis/getUser');
const getUserList = require('../../utils/apis/getUserList');
const checkName = require('../../utils/apis/checkName');
const feedBack = require('../../utils/apis/feedBack');

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
    tree: [],
    showLeft: false,
    personList: [],
    receiver: [],
    receiverid: [],
    eventid: null
  },

  onLoad({
    id
  }) {
    const _this = this;
    this.setData({
      eventid: id
    });

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

          _this.setData({
            eventClass,
            eventClassList
          })
        }

        _this.getDetail(id);
      }
    });

    wx.request({
      url: `${api}/${getUserList}`,
      method: 'POST',
      success({
        data
      }) {
        _this.setData({
          tree: data.data
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
    const _this = this;
    const data = this.data;

    const step = new Promise((resolve, reject) => {
      wx.request({
        url: `${api}/${checkName}?eventid=${_this.data.eventid}&eventname=${_this.data.eventName}`,
        method: 'POST',
        data: {
          eventid: _this.data.eventid,
          eventname: _this.data.eventName
        },
        success({
          data
        }) {
          if (data.valid) {
            resolve();
          } else {
            reject();
          }
        }
      })
    }).then(() => {
      wx.request({
        url: `${api}/${feedBack}`,
        method: 'POST',
        data: {
          eventname: data.eventName,
          eventid: data.eventid,
          comments: data.describion,
          eventstatus: 1,
          eventtypeid: data.eventClassList[data.classIndex],
          receiver: data.receiver.toString(),
          receiverid: data.receiverid.toString(),
          urgency: data.eventDegreeList[data.degreeIndex]
        },
        success({
          data
        }) {
          if(data.code == err_ok) {
						$Message({
							content: '提交成功',
							type: 'success'
						});
					} else {
						reject();
					}
        }
      })
    }).catch((err) => {
			$Message({
				content: '提交失败请检查网络状态后重试',
				type: 'wrong'
			});
		});
  },

  /**
   * 获取数据
   */
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
          eventName: data.eventname,
          describion: data.comments,
          classIndex: _this.data.eventClass.indexOf(data.typename),
          degreeIndex: _this.data.eventDegreeList.indexOf(data.urgency)
        })
      }
    })
  },

  /**
   * 获取人员列表
   */
  getPerson(e) {
    const _this = this;
    const dept_id = e.currentTarget.dataset.id;

    wx.request({
      url: `${api}/${getUser}?dept_id=${dept_id}`,
      data: {
        dept_id
      },
      method: 'POST',
      success({
        data
      }) {
        _this.setData({
          personList: data
        })
        _this.toggleLeft();
      }
    })
  },

  /**
   * 遮罩层
   */
  toggleLeft() {
    this.setData({
      showLeft: !this.data.showLeft
    });
  },

  /**
   * 复选框
   */
  handleFruitChange(e) {
    const {
      receiver,
      personList
    } = this.data;
    const index = receiver.indexOf(e.detail.value);

    index === -1 ? receiver.push(e.detail.value) : receiver.splice(index, 1);

    let temp = [];
    for (const index in receiver) {
      for (let i = 0; i < personList.length; i++) {
        if (receiver[index] == personList[i].real_name) {
          temp.push(personList[i].user_id);
        }
      }
    }

    this.setData({
      receiver: this.data.receiver,
      receiverid: temp
    });
  }
})