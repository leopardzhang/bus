const {
    $Toast
} = require('../../dist/base/index');
const app = getApp();

Page({
    data: {
		eventClass: ['紧急事件', '安全事件', '公益事件', '交通事件', '一键呼叫', '人脸识别'],
		eventDegree: ['一般', '紧急', '严重'],
		name: '',
		describion: '',
		classIndex: null,
		degreeIndex: null,
		imgList: []
    },

    onLoad(options) {
		console.log(app.globalData);
    },

	bindClassChange(e) {
		this.setData({
			classIndex: e.detail.value
		})
	},

	bindDegreeChange(e) {
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
			success: function (res) {
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

	/* 移除图片 */
	remove() {
		this.setData({
			imgList: []
		})
	}
})