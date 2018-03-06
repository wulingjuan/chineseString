var Promise = require('../plugins/es6-promise.js')
var config = require('../comm/script/config.js')
var wxApi = require('../util/wxApi.js')
function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        //成功
        resolve(res)
      }
      obj.fail = function (res) {
        //失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: url,
    method: 'GET',
    data: data,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
function login(cb,failcb){
  var that = getApp();
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
      return getRequest(url, params);
    }).
    then(res => {
      var acc = res.data.acc;
      acc.cateList = res.data.cate;
      acc.subCateList = res.data.subcate;
      that.setUserInfo(acc);
    }).catch(function (response) {
		  typeof failcb =='function'&&failcb()
    }).finally(function (response) {
      if (!cb) {
        wx.showToast({
          title: '重新认证中',
          icon: 'warn',
          duration: 1000
        })
      }
      typeof cb =='function'&&cb()
   })
}

function http(paramObj){
	var url = paramObj.url;
	var params = paramObj.data;
	var cb = paramObj.success;
	var failcb = paramObj.fail;
	var finalCb = paramObj.complete;
	
  var that = this;
	var response = null;
	if(!getApp().getUserInfo()||!getApp().getUserInfo().token){
		login(function(){//重新认证
      if (!getApp().getUserInfo()) {
        console.error("没有获取到当前用户信息");
        return;
      }
		  for (var prop in params){
			  var lowcase = prop.toLowerCase();
        if(lowcase=='oid' ||lowcase=='openid'){
          params[prop] = getApp().getUserInfo().openId;
        } else if(lowcase=='personid'){
          params[prop] = getApp().getUserInfo().id;
        } 
			}
			var realRequest = getRequest(url, params);//认证成功发起真正的请求
			realRequest.then(res => {
			    response = res;
			    typeof cb =='function'&&cb(res)
			}).catch(function (err) {
				typeof failcb =='function'&&failcb(err)
			}).finally(function (res) {
				typeof finalCb =='function'&&finalCb(response)
			})		
		});
    return;
	}
	var request = getRequest(config.apiList.checkSession, {token:getApp().getUserInfo().token});
	
  if (!getApp().getUserInfo()){
    console.error("没有获取到当前用户信息");
    return;
  }
	request.then(res => {
	  if (res.data.code == -20000) {//认证失败或者超时
        login(function(){//重新认证
        var realRequest = getRequest(url, params);//认证成功发起真正的请求
        realRequest.then(res => {
            response = res;
            typeof cb =='function'&&cb(res)
        }).catch(function (err) {
          typeof failcb =='function'&&failcb(err)
        }).finally(function (res) {
          typeof finalCb =='function'&&finalCb(response)
          wx.stopPullDownRefresh()
        })
      
      });
      return;
    }else{
      var realRequest = getRequest(url, params);//发起真正的请求
      realRequest.then(res => {
          response = res;
          typeof cb =='function'&&cb(res)
      }).catch(function (err) {
        typeof failcb =='function'&&failcb(err)
      }).finally(function (res) {
        typeof finalCb =='function'&&finalCb(response)
        wx.stopPullDownRefresh()	    
      })
    }  
  })
  .finally(function (res) {
    wx.stopPullDownRefresh()
  })
}
/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  var postRequest = wxPromisify(wx.request)
  return postRequest({
    url: url,
    method: 'POST',
    data: data,
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
  })
}

function postFile(url,data){
  var postFile = wxPromisify(wx.uploadFile)
  var filePath = data.filePath;
  var param = delete data["filePath"];
  return postFile({
      url: url, 
      filePath: filePath,
      name: 'file',
      formData: data
  })
}

function uploadFiles(fileList,url,params,cb,failcb){
  var promise = Promise.all(fileList.map((tempFilePath, index) => {
    return new Promise(function (resolve, reject) {
      wx.uploadFile({
        url: url,
        filePath: tempFilePath,
        name: 'file',
        formData: params,
        success: function (res) {
          resolve(res.data);
        },
        fail: function (err) {
          reject(new Error('failed to upload file'));
        }
      });
    });
  }));
  promise.then(function (results) {
    console.log(results);
    cb(results);
  }).catch(function (err) {
    console.log(err);
    failcb(err)
  });

}
module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  postFile:postFile,
  uploadFiles: uploadFiles,
  http:http
}