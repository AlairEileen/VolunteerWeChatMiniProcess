// pages/clockIn/clockIn.js
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
var accountID = wx.getStorageSync("accountId");

function checkLocation(that) {

  wx.request({
    url: domain + "/Account/IsInRound/" + accountID + "/" + that.data.latitude + "/" + that.data.longitude,
    success: function(res) {
      console.log(res);
      if (res.data.StatusCode === 1000) {
        that.setData({
          IsInRound: res.data.JsonData
        });

      }
    }
  });
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    thatTime: null,
    clockTime: null,
    isStart: false,
    IsInRound: false


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: domain + "/Account/NextClock/" + accountID,
      success: function(res) {
        console.log(res);
        if (res.data.StatusCode === 1000) {

          that.setData({
            clockTime: res.data.JsonData,
            isStart: res.data.JsonData1
          });
        } else {
          that.setData({
            clockTime: "暂无"
          });
        }
      }
    });

    // this.mapCtx = wx.createMapContext('map')
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        console.log(res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        checkLocation(that);
      }
    });
    var d = new Date();
    that.setData({
      thatTime: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
    });
    setInterval(function() {
      // console.log("fsdfdsf1", that.data.clockTime);
      // var d = new Date();
      // console.log("fsdfdsf", (parseInt(that.data.clockTime.replace(':', '')) > (d.getHours * 100 + d.getMinutes())) && that.data.isStart);
      // console.log("fsdfdsf2", parseInt(that.data.clockTime));
      d = new Date();
      that.setData({
        thatTime: d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
      });
    }, 1000);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  refreshLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {

        console.log(res);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      }
    });
  },
  clockIn: function() {
    var that = this;
    wx.request({
      url: domain + "/Account/ClockIn/" + accountID + "/" + that.data.latitude + "/" + that.data.longitude,
      success: function(res) {
        if (res.data.StatusCode === 1000) {
          // that.data.list = res.data.JsonData;
          // that.setData({
          //   obj: res.data.JsonData
          // });
          wx.showToast({
            title: '打卡成功',
          });
          that.onLoad();
        }

      }
    });
  }


})