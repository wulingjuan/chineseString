var COS = require('./cos-wx-sdk-v5');
var config = {
  Bucket: 'ybyimg-1253842821',
  Region: 'ap-shanghai'
};

var TaskId;
var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数

    // 方法一（推荐）服务器提供计算签名的接口
    /*
    wx.request({
        url: 'SIGN_SERVER_URL',
        data: {
            Method: params.Method,
            Key: params.Key
        },
        dataType: 'text',
        success: function (result) {
            callback(result.data);
        }
    });
    */

    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: 'AKIDnOjrkN7slPnwqUF30iBPOBizzjDZNbEb',
      SecretKey: 'HJ6f3HGyUmsiHZbNr5RXMuCH8j5C4h6J',
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

// 回调统一处理函数
var requestCallback = function (err, data) {
  console.log(err || data);
  if (err && err.error) {
    wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
  } else if (err) {
    wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
  } else {
    wx.showToast({ title: '请求成功', icon: 'success', duration: 3000 });
  }
};

// 展示的所有接口
var dao = {
  // Service
  getService: function () {
    cos.getService(requestCallback);
  },
  // Object
  putObject: function () {
    cos.putObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: '1.txt',
      Body: 'hello world' // 在小程序里，putObject 接口只允许传字符串的内容，不支持 TaskReady 和 onProgress，上传请使用 cos.postObject 接口
    }, requestCallback);
  },
 
  putObjectCopy: function () {
    cos.putObjectCopy({
      Bucket: config.Bucket, // Bucket 格式：test-1250000000
      Region: config.Region,
      Key: '1.copy.txt',
      CopySource: config.Bucket + '.cos.' + config.Region + '.myqcloud.com/1.txt',
    }, requestCallback);
  },
  // 上传文件
  postObject: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        cos.postObject({
          Bucket: config.Bucket, Region: config.Region, Key: 'test'+new Date()*1+'.png',
          FilePath: res.tempFilePaths[0],
          TaskReady: function (taskId) {
            TaskId = taskId
          },
          onProgress: function (info) {
            console.log(JSON.stringify(info));
          }
        }, requestCallback);
      }
    })
  },
  cancelTask: function () {
    cos.cancelTask(TaskId);
    console.log('canceled');
  },
  pauseTask: function () {
    cos.pauseTask(TaskId);
    console.log('paused');
  },
  restartTask: function () {
    cos.restartTask(TaskId);
    console.log('restart');
  },
};

module.exports = dao;