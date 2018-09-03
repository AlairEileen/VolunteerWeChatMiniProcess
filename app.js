//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

  },
  globalData: {
    userInfo: null,
    accountId: null,
    // domain: "http://localhost:54711/",
    // domain: "http://470597a3.nat123.net/",
    domain:"https://xcxh.360yingketong.com/volunteer/",
    downloadFileController: "File/Download/"
  }
})