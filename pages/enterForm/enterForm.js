// pages/enterForm/enterForm.js
var globalData = getApp().globalData;
var downloadUrl = globalData.domain + globalData.downloadFileController;
var domain = globalData.domain;
var Departments;
var startTime, endTime;
var accountID = wx.getStorageSync("accountId");

function initDepartments(that, onDataSet) {
  wx.request({
    url: domain + "/Manager/FindDepartments/",
    success: function(res) {
      if (res.data.StatusCode === 1000) {
        // that.data.list = res.data.JsonData;
        Departments = res.data.JsonData.Departments;
        that.setData({
          pathKey2s: Departments
        });
        onDataSet(that);
      }
    }
  });
}

function initAccountInfo(that, onDataSet) {
  console.log("aid", accountID);
  wx.request({
    url: domain + "/Account/Info/" + accountID,
    success: function(res) {
      if (res.data.StatusCode === 1000) {
        // that.data.list = res.data.JsonData;
        console.log(res);
        var str = "submitObj.Account";
        that.setData({
          [str]: res.data.JsonData
        });
        onDataSet(that);
      }
    }
  });
}

function initActivity(id, that, onDataSet) {
  wx.request({
    url: domain + "/Activity/Find/" + id,
    success: function(res) {
      console.log(res);
      if (res.data.StatusCode === 1000) {
        startTime = res.data.JsonData.StartTime;
        endTime = res.data.JsonData.EndTime;
        var floors = [];
        for (var i = 0; i < res.data.JsonData.Floors.length; i++) {
          if (res.data.JsonData.Floors[i].Enabled) {
            floors.push(res.data.JsonData.Floors[i]);
          }
        }
        that.setData({
          floors: res.data.JsonData.Floors,
          floorsEnabled: floors
        });
        onDataSet(that);
      }
    }
  });
}

function makeDateArray(that) {

  var sd = new Date(startTime);
  var ed = new Date(endTime);

  //年差
  var yc = ed.getFullYear() - sd.getFullYear();
  var mc = yc > 0 ? 12 - sd.getMonth() + ed.getMonth() + 12 : ed.getMonth() - sd.getMonth();

  var month = [];
  var sdd = sd.getDate();

  if (yc > 0) {
    calcManyYear(-sdd, sd, ed, month);
  } else if (yc === 0) {
    if (mc > 0) {
      calcManyMonth(-sdd, sd, ed, month, function(val) {});
    } else if (mc === 0) {
      calcOneMonth(-sdd, sd, ed, month, function(val) {});
    }
  }
  that.setData({
    allGoodsFilte: month
  });
  console.log(month);
}

function calcManyYear(sdd, sd, ed, month) {
  var sy = sd.getFullYear();
  var ey = ed.getFullYear();
  var value = sdd;
  for (var i = sy; i <= ey; i++) {
    var smd = new Date();
    smd.setFullYear(i);
    smd.setMonth(i === sy ? sd.getMonth() : 0);
    smd.setDate(i === sy ? sd.getDate() : 1);
    var emd = new Date();
    emd.setFullYear(i);
    emd.setMonth(i === ey ? ed.getMonth() : 11);
    var days = getDays(new Date(emd), i);
    emd.setDate(i === ey ? ed.getDate() : days);
    // console.log("value:" + value, "smd:" + smd + ",emd:" + emd);
    calcManyMonth(value, smd, emd, month, function(val) {
      value = val;
    });
  }
}

function calcManyMonth(sdd, sd, ed, month, calcFinish) {
  var sm = sd.getMonth();
  var em = ed.getMonth();
  var value = sdd;
  for (var i = sm; i <= em; i++) {
    var smd = new Date(sd);
    smd.setMonth(i);
    smd.setDate(i === sm ? sd.getDate() : 1);
    var emd = new Date(sd);
    emd.setMonth(i);
    var days = getDays(new Date(sd), i);
    emd.setDate(i === em ? ed.getDate() : days);
    // console.log("value:" + value, "smd:" + smd + ",emd:" + emd);
    calcOneMonth(value, smd, emd, month, function(val) {
      value = val;
    });
  }
  calcFinish(value);
}

function getDays(dt, i) {
  dt.setMonth(i + 1);
  dt.setDate(0);
  // console.log("dt", dt);
  return dt.getDate();
}

function calcOneMonth(startValue, sd, ed, month, calcFinish) {
  var date = [];
  var value = 0;
  for (var i = sd.getDate(); i <= ed.getDate(); i++) {
    value = startValue + i;
    var m = sd.getMonth() + 1;
    var dateString = sd.getFullYear() + "-" + (m > 9 ? m : "0" + m) + "-" + (i > 9 ? i : "0" + i);
    date.push({
      name: i,
      value: value,
      checked: false,
      CanForm: true,
      dateString: dateString
    });
  }
  calcFinish(value);
  month.push({
    title: sd.getFullYear() + "年" + (sd.getMonth() + 1) + "月",
    date: date
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathKey1s: ['医院', '个人'],
    pathKey2s: null,
    pathKey1: '个人',
    pathKey2: '个人',
    pathValue: [1, 1],
    hiddenPathModal: true,
    hiddenFloorModal: true,
    floors: null,
    floorsEnabled: null,
    selectedFloor: [0],
    floorValue: '',
    hiddenDateModal: true,
    agree: true,
    allGoodsFilte: null,
    selectedDate: '',
    selectedFile: null,
    downloadUrl: downloadUrl,
    hiddenAgreementModal: true,
    ID: null,
    submitObj: {
      Account: {
        ID: null,
        IsHealth: true,
        IsMale: true,
        IsTheHospital: false,
        DepartmentName: null,
        PicID: null,
        RealName: null,
        AccountPhoneNumber: null
      },
      FormDates: [{
        Date: null,
        AccountID: null
      }],
      FloorName: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.ID = options.id;
    initAccountInfo(this, function(that) {
      initDepartments(that, function(that) {
        var a = 1;
        var b = 1;
        var v = ['个人'];

        if (that.data.submitObj.Account.IsTheHospital) {
          a = 0;
          for (var i = 0; i < that.data.pathKey2s.length; i++) {
            if (that.data.submitObj.Account.DepartmentName === that.data.pathKey2s[i]) {
              b = i;
              v = Departments;
              break;
            }
          }
        }
        that.setData({
          pathValue: [a, b],
          pathKey2s: v,
          pathKey1: that.data.pathKey1s[a],
          pathKey2: that.data.pathKey2s[b]
        });
      });
      initActivity(that.data.ID, that, function(that) {
        makeDateArray(that);

      });
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
  showAgreement() {
    this.setData({
      agree: true,
      hiddenAgreementModal: false
    });
  },
  selectedMale() {
    var str = "submitObj.Account.IsMale";
    this.setData({
      [str]: true,
    });
  },
  selectedFemale() {
    var str = "submitObj.Account.IsMale";
    this.setData({
      [str]: false,
    });
  },
  selectedHealth() {
    var str = "submitObj.Account.IsHealth";
    this.setData({
      [str]: true,
    });
  },
  selectedUnHealth() {
    var str = "submitObj.Account.IsHealth";
    this.setData({
      [str]: false,
    });
  },

  uploadImage() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          selectedFile: tempFilePaths
        });
        wx.uploadFile({
          url: domain + 'File/UploadFile', //此处换上你的接口地址
          filePath: tempFilePaths[0],
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data",
            'accept': 'application/json',
            'Authorization': 'Bearer ..' //若有token，此处换上你的token，没有的话省略
          },
          formData: {
            'user': 'test' //其他额外的formdata，可不写
          },
          success: function(res) {
            var data = JSON.parse(JSON.parse(res.data));
            that.data.submitObj.Account.PicID = data[0];
          },
          fail: function(res) {
            console.log('fail');
          }
        });
      }
    });
  },
  onPathChanged: function(data) {
    var arr = data.detail.value;
    var pathValue = arr;
    if (arr[0] === 1 && this.data.pathValue[0] === 0) {
      this.setData({
        pathKey2s: ['个人']
      });
      pathValue = [1, 0];
    } else if (this.data.pathValue[0] === 1) {
      this.setData({
        pathKey2s: Departments
      });
      pathValue = [0, 0];
    }
    this.setData({
      pathValue: pathValue
    });
  },
  checkedPath: function() {
    var key1 = this.data.pathKey1s[this.data.pathValue[0]];
    var key2 = this.data.pathKey2s[this.data.pathValue[1]];
    this.setData({
      hiddenPathModal: true,
      pathKey1: key1,
      pathKey2: key2
    });
    if (key1 === "个人") {
      this.data.submitObj.Account.IsTheHospital = false;
      this.data.submitObj.Account.DepartmentName = key1;

    } else {
      this.data.submitObj.Account.IsTheHospital = true;
      this.data.submitObj.Account.DepartmentName = key2;
    }
  },
  cancelPathModal: function() {
    this.setData({
      hiddenPathModal: true
    });
  },
  showChangePath: function() {
    this.setData({
      hiddenPathModal: false
    });
  },
  cancelFloorModal: function() {
    this.setData({
      hiddenFloorModal: true
    });
  },
  checkedFloor: function() {
    var floorName = this.data.floorsEnabled[this.data.selectedFloor[0]].FloorName;
    var value = floorName + "楼";
    this.setData({
      hiddenFloorModal: true,
      floorValue: value,
      hiddenDateModal: false
    });
    this.data.submitObj.FloorName = floorName;


    var floors = this.data.floors;
    var oDatesArr = []; //选中的楼的报名表
    var ff = null; //选中的楼
    for (var i = 0; i < floors.length; i++) {
      if (floors[i].FloorName === floorName) {
        ff = floors[i];
        oDatesArr = ff.FormDates;
        break;
      }
    }
    //清空选中
    this.clearDateEnabled();

    var datesArray = this.data.allGoodsFilte;
    for (var i = 0; i < datesArray.length; i++) {
      var da = datesArray[i];
      for (var z = 0; z < da.date.length; z++) {
        var dad = da.date[z];
        for (var j = 0; j < oDatesArr.length; j++) {
          var oda = oDatesArr[j];
          if (dad.dateString === oda.Date) {
            if (oda.AccountForms.length === ff.PeopleNum) {
              dad.CanForm = false;
              break;
            } else {
              for (var o = 0; o < oda.AccountForms.length; o++) {
                if (oda.AccountForms[o].AccountID === accountID) {
                  dad.CanForm = false;
                  break;
                }
              }
            }
          }
        }
      }
      console.log("d###", datesArray);
      this.setData({
        allGoodsFilte: datesArray
      });
    }


  },
  clearDateEnabled: function() {
    var aa = this.data.allGoodsFilte;
    var floors = this.data.floors;
    var selectDateArr = [];
    for (var i = 0; i < floors.length; i++) {
      for (var j = 0; j < floors[i].FormDates.length; j++) {
        for (var z = 0; z < floors[i].FormDates[j].AccountForms.length; z++) {
          if (floors[i].FormDates[j].AccountForms[z].AccountID === accountID) {
            selectDateArr.push(floors[i].FormDates[j].Date);
          }
        }
      }
    }
    for (var i = 0; i < aa.length; i++) {
      for (var j = 0; j < aa[i].date.length; j++) {
        aa[i].date[j].CanForm = true;
        aa[i].date[j].checked = false;
        for (var z = 0; z < selectDateArr.length; z++) {
          if (aa[i].date[j].dateString === selectDateArr[z]) {
            aa[i].date[j].CanForm = false;
            break;
          }
        }
      }

    }
    this.setData({
      allGoodsFilte: aa
    });
  },
  onFloorChanged: function(data) {
    console.log(data);
    this.setData({
      selectedFloor: data.detail.value
    });
  },
  showChangeFloor: function() {
    this.setData({
      hiddenFloorModal: false
    });
  },
  serviceValChange: function(e) {
    var allGoodsFilte = this.data.allGoodsFilte;
    var checkArr = e.detail.value;
    console.log("e", e);
    for (var i = 0; i < allGoodsFilte.length; i++) {
      for (var j = 0; j < allGoodsFilte[i].date.length; j++) {
        if (checkArr.indexOf(allGoodsFilte[i].date[j].value + "") != -1) {
          allGoodsFilte[i].date[j].checked = true;
        } else {
          allGoodsFilte[i].date[j].checked = false;
        }
      }
    }
    this.setData({
      allGoodsFilte: allGoodsFilte
    })
  },
  cancelDateModal: function() {
    this.setData({
      hiddenDateModal: true
    });

  },
  checkedDate: function() {
    var selectedDate = "";
    var dateArray = [];
    for (var i = 0; i < this.data.allGoodsFilte.length; i++) {
      for (var j = 0; j < this.data.allGoodsFilte[i].date.length; j++) {
        if (this.data.allGoodsFilte[i].date[j].checked) {
          selectedDate += this.data.allGoodsFilte[i].date[j].name + "、";
          dateArray.push({
            Date: this.data.allGoodsFilte[i].date[j].dateString,
            AccountID: accountID
          });
        }
      }
    }
    this.data.submitObj.FormDates = dateArray;
    selectedDate = selectedDate.substring(0, selectedDate.length - 1)
    console.log("sd", selectedDate);
    this.setData({
      hiddenDateModal: true,
      selectedDate: selectedDate
    });

  },
  submitForm: function() {
    if (!this.data.agree) {
      wx: wx.showToast({
        title: '请同意协议'
      })
      return;
    }
    console.log("id", this.data.ID);
    console.log("id", this.data.submitObj);
    wx.request({
      url: domain + '/Activity/Submit/' + this.data.ID,
      method: 'POST',
      data: JSON.stringify(this.data.submitObj),
      success: function(res) {
        if(res.data.StatusCode===1000){
          wx.showToast({
            title: '报名成功!',
          });
          wx.navigateBack({
            delta: 2
          });
        }else{
          wx.showToast({
            title: '报名失败!',
          });
        }
      
      }
    })
  },
  agreementOk: function() {
    this.setData({
      agree: true,
      hiddenAgreementModal: true
    });
  },
  agreeChange: function(e) {
    this.setData({
      agree: e.detail.value.length === 1
    });
  },
  realNameInput: function(e) {
    var str = "submitObj.Account.RealName";
    this.setData({
      [str]: e.detail.value
    });
  },
  phoneInput: function(e) {
    var str = "submitObj.Account.AccountPhoneNumber";
    this.setData({
      [str]: e.detail.value
    });
  }
})