// pages/ticketCenter/ticketCenter.js
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
var accountID = wx.getStorageSync("accountId");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasCar: false,
    hasMeel: false,
    AccountForm: null,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: domain + "Account/TodayActivity/" + accountID,
      success: function(res) {
        console.log(res);
        if (res.data.StatusCode === 1000) {
          that.setData({
            AccountForm: res.data.JsonData,
            hasCar: res.data.JsonData1,
            hasMeel: res.data.JsonData2,
            id: res.data.JsonData3
          });
        } else {
          wx.showToast({
            title: '该活动没有券',
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
  getCarArch: function() {
    var that = this;
    wx.request({
      url: domain + "Account/Ticket/" + accountID + "/" + that.data.id + "/1",
      success: function(res) {
        console.log(res);
        if (res.data.StatusCode === 1000) {

          that.onLoad();
        }
      }
    });
  },
  getMeelArch: function() {
    var that = this;
    wx.request({
      url: domain + "Account/Ticket/" + accountID + "/" + that.data.id + "/2",
      success: function(res) {
        console.log(res);
        if (res.data.StatusCode === 1000) {

          that.onLoad();
        }
      }
    });
  }
})