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
function fecthConfrimDetail(id,cb, fail_cb) {
  var that = this;
  wxRequest.http({
    url: config.apiList.confirmDetail,
    data: {
      payOrderId: id
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
function updateAccCity(){//修改归属
  var that = this;
  var userInfo = getApp().getUserInfo();
  if (userInfo.regcity || !userInfo.token || !getApp().globalData.location){//如果已经有了归属就不更新了，以第一次更新的为主
    return;
  }

  wxRequest.http({
    url: config.apiList.updateAccCity,
    data: {
      token: userInfo.token,
      city: getApp().globalData.location
    },
    method: 'GET',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) {
      if(res.data.code>=0){
        userInfo.regcity = getApp().globalData.location;
        getApp().setUserInfo(userInfo);
      }
    }
  });
}
function fecthAccountDetail(cb,fail_cb){
  var that = this;
  wxRequest.http({
    url: config.apiList.userDetail,
    data: {
      personId: getApp().getUserInfo().id      
    },
    method: 'GET',
    header: {
      "Content-Type": "application/json,application/json"
    },
    success: function (res) {
      var data = res.data.account; 
      var rate = res.data.rate;	  
      typeof cb == 'function' && cb(data,rate)
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
function fetchFabus(url, start, cb, fail_cb) {
  var that = this;
  if(that.data.isRequst == false){
	  that.setData({
		isRequst:true
	  });
  }else{
	  return;
  }
  message.hide.call(that)
  if (that.data.fabuHasMore) {
    wxRequest.http({
      url: url,
      data: {
        city: config.city,
        start: start,
        isMy: that.data.isMy?true:false,
        personId: getApp().getUserInfo().id,
        type: 2,
        oid: that.data.isMy ? getApp().getUserInfo().openId : -1, 
        size: config.fabuCount
      },
      method: 'GET',
      header: {
        "Content-Type": "application/json,application/json"
      },
      success: function (res) {
        var list = res.data;
        if (list.length === 0) {
          that.setData({
            fabuHasMore: false,
            showLoading: false
          })
        } else {
          for (var i = 0; i < list.length; i++) {
            var curItem = list[i];
            if (curItem.tags != null)
              curItem.tags = curItem.tags.split(',').slice(0, 4);
            if(curItem.attachments!= null){
              for (var j = 0; j < curItem.attachments.length; j++) {
                curItem.attachments[j].filePath = config.urlPrefix + curItem.attachments[j].filePath;
                if(curItem.type==2){
                  try{
                    curItem.time = JSON.parse(curItem.ext).time;
                  }catch(e){
                    curItem.time = -1;
                  }
                }
              }
              if (!!curItem.attachments[0])
                curItem.headimg = curItem.attachments[0].filePath;
            }
          }
          if (that.data.fabuStart == 0){
            that.setData({
              fabuList: list,
              fabuStart: list.length,
              showLoading: false
            })
          }else{
            that.setData({
              fabuList: that.data.fabuList.concat(list),
              fabuStart: that.data.fabuStart + list.length,
              showLoading: false
            })
          }
          console.log(that.data.fabuStart);
        }
        wx.stopPullDownRefresh();
        if (list.length < config.fabuCount) {
          that.setData({
            fabuHasMore: false,
            showLoading: false
          })
        }else{
          that.setData({
            fabuHasMore: true,
            showLoading: false
          })
        }
		that.setData({
			isRequst:false
		});
        typeof cb == 'function' && cb(res.data)
      },
      fail: function () {
        that.setData({
          showLoading: false,
		      isRequst:false
        })
        message.show.call(that, {
          content: '网络开小差了',
          icon: 'offline',
          duration: 3000
        })
        wx.stopPullDownRefresh()
        typeof fail_cb == 'function' && fail_cb()
      },
      complete: function (res){
        that.setData({
          showLoading: false,
          isRequst: false
        })
      }
    })
  }else{
    that.setData({
      showLoading: false,
	    isRequst:false
    });
  }
  config.uploadFormIds();
}
// 获取出租列表
function fetchFilms(url, start, cb, fail_cb) {
  var that = this
  if(that.data.isRequst == false){
	  that.setData({
		isRequst:true
	  });
  }else{
	return;
  }
  message.hide.call(that) ;
  var city = config.city;
  var cate = config.cate;
  if(that.data.isMy){
    city = '';
  }
  var params = {
        city: city,
        cate: (!cate) ? "" : cate,
        start: start,
        isMy: that.data.isMy ? true : false,
        personId: getApp().getUserInfo().id,
        type:1,
        size: config.count
  };
  if (that.data.hasMore) {
    wxRequest.http({
      url: url,
      data: {
        city: city,
        cate: (!cate) ? "" : cate,
        start: start,
        isMy: that.data.isMy ? true : false,
        personId: getApp().getUserInfo().id,
        type:1,
        size: config.count
      },
      method: 'GET', 
      header: {
        "Content-Type": "application/json,application/json"
      },
      success: function(res){
	   //  console.error(JSON.stringify(getApp().getUserInfo()));
        if(res.statusCode!=200){
          console.error("异常"+res.statusCode+","+ JSON.stringify(params));
          that.setData({
            chu_zu: [1],
            showLoading: false,
            hasMore: false
          })
          wx.stopPullDownRefresh();
          return;
          /*message.show.call(that, {
            content: '网络开小差了',
            icon: 'offline',
            duration: 3000
          })

          typeof fail_cb == 'function' && fail_cb()*/
        }
        var list = res.data;
        if (!list || list.length == 0){
          that.setData({
            hasMore: false,
            showLoading: false
          })
          return;
        }else{
          for(var i=0;i<list.length;i++){
            var curItem = list[i];
            if (curItem.tags != null)
              curItem.tags = curItem.tags.split(',').slice(0,4);
            if (curItem.attachments != null && curItem.attachments.length>0){
              for (var j = 0; j < curItem.attachments.length ;j++){
                curItem.attachments[j].filePath = config.urlPrefix + curItem.attachments[j].filePath;
              }
            }
          }
          if(that.data.start==0){
            that.setData({
              films: list,
              start: list.length,
              showLoading: false
            })
          }else{
            that.setData({
              films: that.data.films.concat(list),
              start: that.data.start + list.length,
              showLoading: false
            })
          }
          console.log(that.data.start);
        }
        wx.stopPullDownRefresh();
        if (list.length < config.count){
          that.setData({
            hasMore: false
          })
        }
        that.setData({
          isRequst:false
        });
        typeof cb == 'function' && cb(res.data)
      },
      fail: function() {
        console.error("异常"+ JSON.stringify(params));
        that.setData({
            showLoading:false,
			isRequst:false
        });
        wx.stopPullDownRefresh();
        /*
        message.show.call(that,{
          content: '网络开小差了',
          icon: 'offline',
          duration: 3000
        })
        
        typeof fail_cb == 'function' && fail_cb()*/
      },
      complete: function (res) {
        that.setData({
          showLoading: false,
          isRequst: false
        })
      }
    })
  } else {
    that.setData({
      showLoading:false,
	    isRequst:false
    });
  }
  config.uploadFormIds();
}
module.exports = {
  fetchFilms: fetchFilms,
  fetchFabus: fetchFabus,
  fecthAccountDetail: fecthAccountDetail,
  fecthConfrimDetail: fecthConfrimDetail,
  confirmPay: confirmPay,
  updateAccCity: updateAccCity
}