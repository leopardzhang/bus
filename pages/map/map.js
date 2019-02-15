const app = getApp();

Page({

    data: {
		latitude: null,
		longitude: null
    },

    onLoad(options) {
		const _this = this;

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
    }
})