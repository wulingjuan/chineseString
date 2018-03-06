//app.js
var config = require('comm/script/config');
var util = require('./util/util');
var aldstat = require("./util/ald-stat.js");
var wxApi = require('./util/wxApi')
var wxRequest = require('./util/wxRequest')

App({
  globalData: {
    popularType: null,
    prePage: null,
    userInfo: null,
    belong: null,
    iv: null,
    encryptedData: null,
    code: null,
    sid: null,
    city: null,
	  location:'未知',
    cate: null,
    socket: null,  //socket连接，全局唯一；
    formIds:[]
  },
  getUserInfo:function(){
    var that = this;
    if(that.globalData.userInfo){
      return that.globalData.userInfo;
    }else{
      return wx.getStorageSync("person_info");
    }
  },
  setUserInfo:function(userinfo){
    var that = this;
    that.globalData.sid = userinfo.id;
    that.globalData.userInfo = userinfo;
    wx.setStorageSync('person_info', userinfo);
  },  
  onLaunch: function () {
    console.info('index onLaunch');
    var that = this;
	  wx.showLoading({
      title: '正在加载',
    })
    that.login(function(){
      wx.hideLoading();
	    if(that.userInfoReadyCallback){
		    console.info('index onLaunch cb');
		    that.userInfoReadyCallback(that.globalData.userInfo)
	    }  
    });
	
	

  /*  
   // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
	*/
  },
  contains: function (arr, el) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === el)
        return true;
    }
    return false;
  },
  getCity: function (cb) {
    var that = this;    
    var wxLocation = wxApi.wxGetLocation();
    wxLocation({ type: 'wgs84'})
    .then(res => {
      var locationParam = res.latitude + ',' + res.longitude + '1'
      var url = config.apiList.baiduMap;
      var params = {
        ak: config.baiduAK,
        location: locationParam,
        output: 'json',
        pois: '1'
      };
      return wxRequest.getRequest(url, params);     
    }).
    then(res => {
	    that.globalData.location = res.data.result.addressComponent.city;
      config.city = res.data.result.addressComponent.city;
    }).
    finally(function (res) {
      if(!config.city)
         config.city = '北京市';
      typeof cb == "function" && cb(config.city)
    });
  },
  login:function (cb){
    var that = this;
    //1.获取code
    var wxLogin = wxApi.wxLogin();
    wxLogin().then(res => {
		that.globalData.code = res.code;
		var wxGetUserInfo = wxApi.wxGetUserInfo()
		return wxGetUserInfo()
	  }).
	  then(res => {
		that.globalData.encryptedData = res.encryptedData;
		that.globalData.iv = res.iv;
		var url = config.apiList.userMore;
		var params = {
		  code: that.globalData.code,
		  encryptedData: that.globalData.encryptedData,
		  iv: that.globalData.iv
		}
		//获取个人信息
		return wxRequest.getRequest(url, params);
	  }).
	  then(res => {
      var acc = res.data.acc;
      acc.cateList = res.data.cate;
      acc.subCateList = res.data.subcate;

      that.globalData.sid = acc.id;
      that.globalData.userInfo = acc;
      that.setUserInfo(acc);
	  })
	  .finally(function (res) {
        if (!cb) {
          wx.showToast({
          title: '认证超时，重新操作！',
          icon: 'warn',
          duration: 1000
          })
        }
        typeof cb == 'function' && cb()
        })
	}
})