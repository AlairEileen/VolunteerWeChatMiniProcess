// pages/activityDetail/activityDetail.js
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
var accountID = wx.getStorageSync("accountId");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    downloadUrl: downloadUrl,
    ID: null,
    accountID:accountID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({ ID: options.id });
    wx.request({
      url: domain + "/Activity/Find/" + options.id,
      success: function (res) {
        console.log(res);
        if (res.data.StatusCode === 1000) {
          // that.data.list = res.data.JsonData;
          that.setData({
            obj: res.data.JsonData
          });
        }

      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  goEnterForm: function () {
    wx.navigateTo({
      url: '/pages/enterForm/enterForm?id=' + this.data.ID,
    })
  }
})