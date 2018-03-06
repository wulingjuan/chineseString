var config = require('./config.js');
var message = require('../../component/message/message');
var util = require('../../util/util');
var wxApi = require('../../util/wxApi')
var wxRequest = require('../../util/wxRequest')
var fetch = require('./fetch.js');
function getSubcate(data, cb, failCb) { //获取分类信息
  var that = this
  wx.request({
    url: config.apiList.getSubcate,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      typeof failCb == 'function' && failCb()
    }
  })
  config.uploadFormIds();
}
function getMemberDay(data, cb, failCb) {
  var that = this
  wxRequest.http({
    url: config.apiList.getMemberDay,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      getApp().globalData.userInfo.memberDay = res.data;
      wx.setStorageSync('person_info', getApp().globalData.userInfo);
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      typeof failCb == 'function' && failCb()
    }
  })
  config.uploadFormIds();
}
//新增发布加载 用户基本信息
function userBaseInfo(data, cb, failCb) {
  var that = this;
  message.hide.call(that);
  that.setData({
    showLoading: true
  })
  wxRequest.http({
    url: config.apiList.baseUserInfo,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res.data != null) {
        that.setData({
          baseUserInfo: res.data,
          showBaseInfo: false
        })
      }
      that.setData({
        showLoading: false
      })
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
  })
  config.uploadFormIds();
}
function bindBelong(data, cb, failCb) {
  wxRequest.http({
    url: config.apiList.bindBelong,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
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
  })
  config.uploadFormIds(true);
}
function getChatId(data, cb, failCb) {
  wxRequest.http({
    url: config.apiList.getChatId,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      typeof fail_cb == 'function' && fail_cb()
    }
  })
  config.uploadFormIds(true);
}
function fabuDetail(data, cb, failCb) {
  var that = this;
  message.hide.call(that);
  that.setData({
    showLoading: true
  });
  wxRequest.http({
    url: config.apiList.fabuDetail,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (!res.data.fabu || res.data.code == -1) {
        that.setData({
          showLoading: false
        });
        return;
      }
      var attachments = res.data.attachments;
      var imgUrls = [], recordPath, time = -1;
      for (var i = 0; i < attachments.length; i++) {
        if (attachments[i].type == 1)
          imgUrls.push(config.urlPrefix + attachments[i].filePath);
        else {
          recordPath = config.urlPrefix + attachments[i].filePath;
          try {
            time = JSON.parse(attachments[i].ext).time;
          } catch (e) {
            time = -1;
          }
        }
      }
      var detail = res.data.fabu;
      detail["tags"] = res.data.fabu.tags.split(',');
      detail["imgUrls"] = imgUrls;
      detail["recordPath"] = recordPath;
      detail["time"] = time;
      detail["opAt"] = util.showDateTime(detail.opat).split(" ")[0];
      detail["attachments"] = attachments;
      that.setData({
        isMe: detail.isme ==1 ? true : false,
        detail: detail,
        hasRecord: detail.recordPath ? true : false
      })
      typeof cb == 'function' && cb(res.data, detail)
      that.setData({
        showLoading: false
      });
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
  })
  config.uploadFormIds();
}
function syncUploadOld(fileList,itemId,cb){
   var cosUrl="";
    var host,policyBase64,accessid,signature,expire,callbackbody,key,header;
    wxRequest.postRequest(config.apiList.getOssParam, {
    }).then(res => {
	    header =  { 'Authorization': res.data.msg };
    }).finally(function (res) {
	   syncUploadPromise(fileList,header,cb);
    });	
}
function syncUploadPromise(fileList,header,cb){
    if(!fileList||fileList.length==0){
	    typeof cb=="function"&&cb()
		config.uploadFormIds();
		return;
	}
	var filePath=fileList.shift();//微信的上传文件
	if (!filePath || filePath.indexOf('wxfile:') < 0) {
	  syncUploadPromise(fileList,header,cb);
	  return;
	}
	/**
	 * 最终上传到cos的URL
	 * 把以下字段配置成自己的cos相关信息，详情可看API文档 https://www.qcloud.com/document/product/436/6066
	 * REGION: cos上传的地区
	 * APPID: 账号的appid
	 * BUCKET_NAME: cos bucket的名字
	 * DIR_NAME: 上传的文件目录
	 */
	var cosUrl ="https://img.ybangy.com";//"https://sh.file.myqcloud.com/files/v2/1253842821/ybyimg/"
	//"https://img.ybangy.com"; ybyimg-1253842821.cossh.myqcloud.com"https://ap-shanghai.file.myqcloud.com/files/v2/1253842821/ybyimg/"
    // 头部带上签名，上传文件至COS
    wx.uploadFile({
        url: cosUrl + '/' + new Date()*1,// 获取文件名
        filePath: filePath,
        header: header,
        name: 'filecontent',
        formData: { op: 'upload' },
        success: function(uploadRes){ 
		  syncUploadPromise(fileList,header,cb);
	    },
		fail: function (res) {
		  console.warn(res);
		}
    })
}
function syncUpload(fileList, id, cb) {
  if (fileList == null || fileList.length == 0) {
    cb();
    return;
  }
  var filePath = fileList.shift();
  if (!filePath || filePath.indexOf('wxfile:') < 0) {
    syncUpload(fileList, id, cb);
    return;
  }
  wx.uploadFile({
    url: config.apiList.uploadImg, //
    filePath: filePath,
    name: 'img',
    formData: { fabuId: id, isAdd: "y" },
    success: function (res) {
      console.warn("s " + JSON.stringify(res));
      setTimeout(function () {
        console.warn("s " + filePath);
        syncUpload(fileList, id, cb);
      }, 10);
    },
    fail: function (res) {
      console.warn("f " + filePath + "  " + res);
    }
  });
  config.uploadFormIds(true);
}
function fabuAdd(data, fileList, cb, failCb) {
  var that = this;
  if (that.data.isAgree == false) {
    util.showToastMsg('同意相关条款后方能提交');
    return;
  }
  wx.showLoading({
    title: '正在提交...',
    mask: true
  });
  if (data.type == 2) {//发布需求I
    if (!!data.title == false || data.title.replace(/(^s*)|(s*$)/g, "").length == 0) {//标题为空
      util.showToastMsg('标题必填');
      return;
    }
  } else {
    if (fileList.length == 0) {
      util.showToastMsg('上传图片必填');
      return;
    }
  }
  if (!!data.content == false || data.content.replace(/(^s*)|(s*$)/g, "").length == 0) {//内容为空
    var titleMsg = data.type == 1 ? '技能说明必填' : '内容必填';
    util.showToastMsg(titleMsg);
    return;
  }
  if (data.type == 1 && data.isAdd) {//我帮你 
    if (!!data.tags == false || data.tags.replace(/(^s*)|(s*$)/g, "").length == 0) {
      util.showToastMsg('标签必填');
      return;
    }
  }
  if (!!data.otherName == false || data.otherName.replace(/(^s*)|(s*$)/g, "").length == 0) {//匿称内容为空
    util.showToastMsg('昵称必填');
    return;
  }
  if (!!data.city == false || data.city.replace(/(^s*)|(s*$)/g, "").length == 0) {//匿称内容为空
    util.showToastMsg('地点必填');
    return;
  }
  if (!/^[1-9]+[0-9]*]*$/.test(data.price)) {//不是正整数
    util.showToastMsg('价格必须是正整数');
    return;
  }
  var showType = data.type == 1 ? 'chu_zu' : 'fa_bu';
  if (!!that.data.id) {//更新
    var keep = [];
    var all = [], removeIds = [];
    for (var i = 0; i < fileList.length; i++) {
      var imgUrl = fileList[i];
      for (var j = 0; j < that.data.detail.attachments.length; j++) {
        var attach = that.data.detail.attachments[j];
        all.push(attach.id);
        if (attach.type == 1 && imgUrl.indexOf(attach.filePath) >= 0) {//保留的图片
          keep.push(attach.id);
        }
      }
    }
    for (var i = 0; i < all.length; i++) {
      if (!keep.contains(all[i])) {
        removeIds.push(all[i]);
      }
    }
    if (!fileList || fileList.length == 0) {//图片全部被删掉
      for (var j = 0; j < that.data.detail.attachments.length; j++) {
        var attach = that.data.detail.attachments[j];
        all.push(attach.id);
      }
      data['removeIds'] = all.join(',');
    } else {
      data['removeIds'] = removeIds.join(',');
    }
  }
  wxRequest.http({
    url: config.apiList.fabuAdd,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading();
      if (!res.data.data) {
        return;
      }
      if (!fileList || fileList.length == 0) {
        wx.showModal({
          title: '提示',
          content: '信息发布成功！',
          showCancel: false,
          success: function (res) {
            wx.switchTab({ url: '../../example/popular/popular?type=' + showType });
          }
        })
        typeof cb == 'function' && cb(res.data);
        return;
      }
      syncUpload(fileList, res.data.data, function () {
        wx.hideLoading();
        if (that.data.recordPath) {
          if (that.data.recordPath.indexOf('wxfile:') < 0) {
            wx.showModal({
              title: '提示',
              content: '信息发布成功！',
              showCancel: false
            })
            typeof cb == 'function' && cb(res.data)
            return;
          }
          wx.uploadFile({
            url: config.apiList.uploadRecord, //
            filePath: that.data.recordPath,
            name: 'file',
            formData: { fabuId: res.data.data, time: data.recordTime },
            success: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '信息发布成功！',
                showCancel: false,
                success: function (res) {
                  getApp().globalData.popularType = showType;
                  wx.switchTab({ url: '../../example/popular/popular' });
                }
              })
              typeof cb == 'function' && cb(res.data)
            },
            fail: function () {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '信息发布失败！',
                showCancel: false
              })
            }
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '信息发布成功！',
            showCancel: false,
            success: function (res) {
              getApp().globalData.popularType = showType;
              wx.switchTab({ url: '../../example/popular/popular' });
            }
          })
          typeof cb == 'function' && cb(res.data);
        }
      });
    },
    fail: function () {
      wx.hideLoading();
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
  })
  config.uploadFormIds();
}
function clearChat(data, cb, fail_cb) {
  var that = this
  wxRequest.http({
    url: config.apiList.clearChat,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      typeof fail_cb == 'function' && fail_cb()
    }
  })
  config.uploadFormIds();
}


function updateUserInfo(data, cb, failCb) {
  var that = this
  message.hide.call(that)
  wxRequest.http({
    url: config.apiList.updateUserInfo,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (!res.data.data) {
        return;
      }
      typeof cb == 'function' && cb(res.data)
    },
    fail: function (res) {
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
  })
  config.uploadFormIds();
}
//用于信息的删除、隐藏
function fabuAction(data, cb, failCb) {
  var that = this;
  wx.showLoading({
    title: '正在提交...',
    mask: true
  });
  wxRequest.http({
    url: config.apiList.fabuAction,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      wx.hideLoading();
      if (!res.data.data) {
        return;
      }
      wx.showModal({
        title: '提示',
        content: '处理成功！',
        showCancel: false
      })
      typeof cb == 'function' && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '处理失败！',
        showCancel: false
      })
      that.setData({
        showLoading: false
      })
      typeof fail_cb == 'function' && fail_cb()
    }
  })
  config.uploadFormIds();
}
/* 支付   */
function payInvoke(param) {
  wx.requestPayment({
    timeStamp: param.timeStamp,
    nonceStr: param.nonceStr,
    package: param.package,
    signType: param.signType,
    paySign: param.paySign,
    success: function (res) {
      // success   
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面   
        success: function (res) {
          var app = getApp();
          var userInfo = app.getUserInfo();
          if (param.type == 'M' && param.amount){//会员支付成功
            app.aldstat.sendEvent('购买会员',{		        
              '所属地区': app.globalData.location,
              '手机号': userInfo.mobile,
              '微信名':userInfo.nickName,
              '金额':param.amount
            });		
          }else{
            app.aldstat.sendEvent('购买技能', {
              '所属地区': app.globalData.location,
              '手机号': userInfo.mobile,
              '微信名': userInfo.nickName,
              '金额': param.amount
            });		
          }
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function () {
          // fail   
        },
        complete: function () {
          // complete   
        }
      })
    },
    fail: function (res) {
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}
function generatePayOrder(openid, productId,amount) {
  var that = this
  wx.showLoading({
    title: '正在提交...',
    mask: true
  });

  //统一支付   
  wxRequest.http({
    url: config.apiList.payInvokeUrl,
    method: 'GET',
    data: {
      body: 'membership',
      attach: 'membership',
      oid: openid,
      productId: productId
    },
    success: function (res) {
      var pay = res.data.data
      //发起支付   
      var timeStamp = pay.timeStamp;
      var packages = pay.package;
      var paySign = pay.paySign;
      var nonceStr = pay.nonceStr;
      var param = {"amount":amount, "type":'M',"timeStamp": timeStamp, "package": packages, "paySign": paySign, "signType": "MD5", "nonceStr": nonceStr };
      payInvoke(param)
    }
  })
  config.uploadFormIds(true);
}

function withdraw(data, cb, failCb) {
  var that = this;
  wxRequest.http({
    url: config.apiList.withdraw,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res.data != null) {
        if (res.data.code == 0) {
          typeof cb == 'function' && cb(res.data)
          wx.showModal({
            title: '提示',
            content: '处理成功！',
            showCancel: false
          });
          wx.hideLoading();
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          });
          wx.hideLoading();
        }
      }

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
  })
  config.uploadFormIds(true);
}


function getProducts(data, cb, failCb) {
  var that = this;
  wxRequest.http({
    url: config.apiList.productList,
    data: data,
    method: 'get',
    header: {
      "Content-Type": "application/json"
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
  })
  config.uploadFormIds();
}

function getPayedOrders(data, param, cb, failCb) {
  var that = this;
  var varList = param.varList, hasMore = param.hasMore, showLoading = param.showLoading, start = param.start;
  that.setData({
    [showLoading]: true
  });
  data.size = config.orderSize;
  data.start = that.data[start];
  if (that.data[hasMore]) {
    wxRequest.http({
      url: config.apiList.orderList,
      data: data,
      method: 'get',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var list = res.data.data;
        if (!list || list.length === 0) {//数据为空
          list = [];
          that.setData({
            [hasMore]: false,
            [showLoading]: false
          })
        } else {//返回的数据不为空
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            item.opAt = util.showDateTime(item.opAt);
            item.status = item.status == 2 ? '待确认' : '完成';
          }
          if (that.data[start] == 0) {
            that.setData({
              [varList]: list,
              [start]: list.length,
              [showLoading]: false
            })
          } else {
            that.setData({
              [varList]: that.data[varList].concat(list),
              [start]: that.data[start] + list.length,
              [showLoading]: false
            })
          }
        }
        wx.stopPullDownRefresh();
        if (list.length < config.orderSize) {
          that.setData({
            [hasMore]: false,
            [showLoading]: false
          })
        } else {
          that.setData({
            [hasMore]: true,
            [showLoading]: false
          })
        }
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
        wx.stopPullDownRefresh()
        typeof fail_cb == 'function' && fail_cb()
      }
    })
  } else {
    that.setData({
      showLoading: false
    });
  }
  config.uploadFormIds();
}

module.exports = {
  withdraw: withdraw,
  getMemberDay: getMemberDay,
  fabuAction: fabuAction,
  getPayedOrders: getPayedOrders,
  getProducts: getProducts,
  generatePayOrder: generatePayOrder,
  fabuAdd: fabuAdd,
  fabuDetail: fabuDetail,
  userBaseInfo: userBaseInfo,
  updateUserInfo: updateUserInfo,
  bindBelong: bindBelong,
  getSubcate: getSubcate,
  clearChat: clearChat,
  getChatId: getChatId
}