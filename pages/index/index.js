//index.js
//获取应用实例
const app = getApp()
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
var accountID = wx.getStorageSync("accountId");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        }
      })
    }
    var that = getApp();
    if (that.accountId) {
      return;
    }
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: res => {

            // 可以将 res 发送给后台解码出 unionId
            that.globalData.userInfo = res.userInfo
            wx.setStorage({
              key: 'userInfo',
              data: res.userInfo,
            });
            wx.request({
              url: that.globalData.domain + "Account/GetAccountID",
              data: {
                iv: res.iv,
                encryptedData: res.encryptedData,
                code: code
              },
              method: ('GET'),
              header: { 'content-type': 'application/json' },
              success: function (res) {
                wx.setStorageSync("accountId", res.data.JsonData.ID)
                that.globalData.accountId = res.data.JsonData.ID;
              }
            });
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }
          }
        });

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goClock(e){
    var that = this;
    this.doClick(e,function(){
      wx.navigateTo({
        url: '/pages/clockIn/clockIn',
      })
    });
  },
  goTicket:function(e){
    var that = this;
    this.doClick(e, function () {
      wx.navigateTo({
        url: '/pages/ticketCenter/ticketCenter',
      })
    });
  },
  goHistory:function(e){
    var that = this;
    this.doClick(e, function () {
      wx.navigateTo({
        url: '/pages/historyList/historyList',
      })
    });
  },
  doClick: function (e,onResult) {
    var that = this;
    console.log("42343243", e);
    console.log("formId", e.detail.formId);
    
    wx.request({
      url: domain + '/Account/SetFormId/' + accountID + "/" + e.detail.formId.trim(),
      data: {},
      success(res) {
       
        onResult();
      }
    });
  }
})
