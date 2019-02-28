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
const getMark = require('../../utils/apis/getMark');

Page({
  data: {
    latitude: null,
    longitude: null,
    showLeft: true,
		gjstaitoninterface: '',
    nodes: [],
    nodess: [],
		current: [],
		currents: [],
		markers: []
  },

  onLoad(options) {
    const _this = this;

    wx.request({
      url: `${api}/${getPoint}`,
      success({
        data
      }) {
        console.log(data);
        if (data.code == err_ok) {
          _this.setData({
						gjstaitoninterface: data.data.gjstaitoninterface,
            nodes: data.data.nodes,
            nodess: data.data.nodess
          })
        }
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

  getMark(ids) {
		const _this = this;

    wx.request({
      url: `${api}/${getMark}`,
      method: 'POST',
      data: {
        ids
      },
      success({
				data
			}) {
				const temp = [];
				for(let item of data.data) {
					temp.push({
						id: item.eventid,
						latitude: item.positiony,
						longitude: item.positionx,
						iconPath: '/assets/marker_red.png'
					})
				}
				const markers = _this.data.markers.concat(temp);
				_this.setData({
					markers
				})

        // console.log(data.data);
      }
    })
  },

  handleClick() {
    this.setData({
      showLeft: !this.data.showLeft
    });
  },

  handleChange(e) {
    const {
      current,
      nodes
    } = this.data;
    const index = current.indexOf(e.detail.value);

    index === -1 ? current.push(e.detail.value) : current.splice(index, 1);

    let temp = [];
    for (const index in current) {
      for (let i = 0; i < nodes.length; i++) {
				if (current[index] == nodes[i].typename) {
					temp.push(nodes[i].resourcetypeid);
        }
      }
    }

    this.setData({
      current: this.data.current,
      currentid: temp,
			markers: []
    });
		
		for (let i = 0; i < temp.length; i ++) {
			this.getMark(temp[i]);
		}
  },

	handleChanges(e) {
		const {
			currents,
			nodess
		} = this.data;
		const index = currents.indexOf(e.detail.value);

		index === -1 ? currents.push(e.detail.value) : currents.splice(index, 1);

		let temp = [];
		for (const index in currents) {
			for (let i = 0; i < nodess.length; i++) {
				if (currents[index] == nodess[i].typename) {
					temp.push(nodess[i].eventtypeid);
				}
			}
		}

		this.setData({
			currents: this.data.currents,
			currentids: temp,
			markers: []
		});

		for (let i = 0; i < temp.length; i++) {
			this.getMark(temp[i]);
		}
	},

	handleMark(e) {
		const id = e.markerId;
		wx.navigateTo({
			url: `../process/process?id=${id}`
		});
	}
})