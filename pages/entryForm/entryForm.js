// pages/entryForm.js
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadUrl: downloadUrl
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: domain + "/Activity/FindEnabledActivity",
      success: function(res) {
        if (res.data.StatusCode === 1000) {
          // that.data.list = res.data.JsonData;
          that.setData({
            list: res.data.JsonData
          });
        }

      }
    });
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
    console.log("fsfsdfsdds");
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("bottom");
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goDetail: function(res) {
    wx.navigateTo({
      url: '/pages/activityDetail/activityDetail?id=' + res.currentTarget.dataset.id,
    })
  }
})