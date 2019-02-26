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
const feedBack = require('../../utils/apis/feedBack');

Page({
  data: {
		page: 1,
		size: 10,
		eventList: [],
		total: null,
		over: false,
		overText: '加载中',
		visible: false,
		autofocus: false,
		feedBackTxt: '',
		currentId: null
  },

  onLoad(options) {
		this.fnGetEventList();
  },

	onReachBottom(e) {
		const _this = this;
		if (!this.data.over) {
			this.setData({
				page: _this.data.page + 1
			})

			this.fnGetEventList()
		}
	},

	/**
	 * 获取列表
	 */
  fnGetEventList() {
		const _this = this;
		const {
			page: offset,
			size: limit
		} = this.data;

    wx.request({
      url: `${api}/${getEventList}`,
      data: {
        limit,
        offset,
        receiverid: wx.getStorageSync('user_id')
      },
      success({
				data
			}) {
				const tempArr = [..._this.data.eventList]
				const arr = tempArr.concat(data.rows)

        _this.setData({
					eventList: arr,
					total: data.total
				})
				const {
					eventList,
					size,
					total,
					page
				} = _this.data;

				if (eventList.length * page >= total) {
					_this.setData({
						over: true
					})
				}
      }
    })
  },

	/**
	 * 查看详情
	 */
	handleCheck({
		currentTarget
	}) {
		const id = currentTarget.dataset.id;

		wx.navigateTo({
			url: `../detail/detail?id=${id}`
		})
	},

	handleClose() {
		this.setData({
			visible: false
		});
	},

	/**
	 * 文字
	 */
	eventChange({
		detail
	}) {
		this.setData({
			feedBackTxt: detail.detail.value
		})
	},

	/**
	 * 显示反馈对话框
	 */
	handleFeedback(e) {
		this.setData({
			visible: true,
			autofocus: true,
			currentId: e.currentTarget.dataset.id
		})
	},

	/**
	 * 发送反馈结果
	 */
	handleSendFeedBack() {
		const _this = this;

		const {
			feedBackTxt,
			currentId
		} = this.data;

		if (feedBackTxt) {
			wx.request({
				url: `${api}/${feedBack}`,
				method: 'POST',
				data: {
					eventid: currentId,
					dealresult: feedBackTxt,
					eventstatus: 2,
					dealerid: wx.getStorageSync('user_id'),
					dealer: wx.getStorageSync('real_name')
				},
				success({
					data
				}) {
					if(data.code == err_ok) {
						_this.setData({
							feedBackTxt: null,
							visible: false,
							currentId: null
						})

						$Message({
							content: '反馈成功',
							type: 'success'
						});
					} else {
						$Message({
							content: '提交失败，请重试',
							type: 'wrong'
						});
					}
				}
			})
		} else {
			$Message({
				content: '请填写全部信息',
				type: 'warning'
			});
		}
	},
	
	handleAcceptance(e) {
		const id = e.currentTarget.dataset.id;

		wx.navigateTo({
			url: `../acceptance/acceptance?id=${id}`,
		})
	}
})