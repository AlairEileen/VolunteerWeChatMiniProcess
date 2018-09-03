var accountID = wx.getStorageSync("accountId");
var NetInfo = {
  successCode: 1000
};
var AppInfo = {
  // domain: "http://localhost:54711/",
  // domain: "http://470597a3.nat123.net/",
  domain: "https://xcxh.360yingketong.com/volunteer/"
};
var ViewParams = {
  downloadFileController: AppInfo.domain + "File/Download/"
};

var Get = {
  noDataNoAc: function(url, onSuccess, onError) {
    this.noData(false, url, onSuccess, onError);
  },
  noDataByAc: function (url, onSuccess, onError) {
    this.noData(true, url, onSuccess, onError);
  },
  noData: function(isAccount, url, onSuccess, onError) {
    wx.request({
      url: AppInfo.domain + url+(isAccount?accountID:""),
      success: function(res) {
        if (res.data.StatusCode === NetInfo.successCode) {
          onSuccess(res.data);
        } else {
          onError(res.data.Message);
        }
      }
    })
  }
};
module.exports = {
  Get: Get,
  ViewParams: ViewParams
};