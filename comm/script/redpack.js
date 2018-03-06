var config = require('./config.js')
var util = require('../../util/util');
var wxApi = require('../../util/wxApi')
var wxRequest = require('../../util/wxRequest')
var message = require('../../component/message/message')
function confirmPay(id,cb,failCb){
  var that = this;
  wxRequest.http({
    url: config.apiList.confirmPay,
    data: {
      payOrderId: id,
      token: getApp().getUserInfo().token
    },
    method: 'GET',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) { 
      var data = res.data;
      typeof cb == 'function' && cb(data)
    },
    fail: function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      typeof fail_cb == 'function' && fail_cb()
    }
  });
  config.uploadFormIds();
}
function answerPack(formData,cb, fail_cb) {
  var that = this;
  formData.token = getApp().getUserInfo().token;
  wxRequest.http({
    url: config.apiList.answerPack,
    data: formData,
    method: 'POST',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) {
      typeof cb == 'function' && cb(res)
    },
    fail: function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      typeof fail_cb == 'function' && fail_cb()
    }
  });
}
function openPack(formData,cb, fail_cb) {
  var that = this;
  formData.token = getApp().getUserInfo().token;
  wxRequest.http({
    url: config.apiList.openPack,
    data: formData,
    method: 'POST',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) {
      var data = res.data;
	  if(data.list&& data.list.length>0){
		for(var i=0;i<data.list.length;i++){
			data.list[i].at =  util.showDateTime(data.list[i].at);
		}
	  }
      typeof cb == 'function' && cb(res)
    },
    fail: function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      typeof fail_cb == 'function' && fail_cb()
    }
  });
}
function createPack(formData,cb, fail_cb) {
  var that = this;
  formData.token = getApp().getUserInfo().token;
  wxRequest.http({
    url: config.apiList.createPack,
    data: formData,
    method: 'POST',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) {
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      that.setData({
        showLoading: false
      })
      message.show.call(that, {
        content: '网络开小差了',
        icon: 'offline',
        duration: 3000
      })
      typeof fail_cb == 'function' && fail_cb()
    }
  });
}


module.exports = {
  answerPack:answerPack,
  openPack:openPack,
  createPack: createPack,
  confirmPay: confirmPay
}