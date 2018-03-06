//index.js
//获取应用实例
var config = require('../../comm/script/config');
var redpackApi = require('../../comm/script/redpack');
var actionApi = require('../../comm/script/action');
var douban = require('../../comm/script/fetch');
var util = require('../../util/util');
var cos =  require('../../util/cos');
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    mareketShow:false,
	  pack:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 上传图片路径
    uploadImgSrc: "",
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 个性化营销设置显示
  marketTapHandler:function(){
    this.setData({
      mareketShow: true,
    })
  },
  // 个性化营销设置关闭
  closeMarketHandler:function(){
    this.setData({
      mareketShow: false,
    })
  },
  // 选择图片
  chooseImgHandler:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths[0]);
        that.setData({
          uploadImgSrc: tempFilePaths[0]
        })
      }
    })
  },
  createPack:function(e){
	var that = this;
    var userInfo = app.getUserInfo();
    var formData = e.detail.value;
	if(!formData.content || formData.content.length>10){
		wx.showToast({title: '成语有误',icon: 'loading'});
		return;
	}
	if(!formData.amount || formData.amount>1000 || formData.amount<0){
	    wx.showToast({title: '金额不能超过1000',icon: 'loading'});
		return;
	}
	if(!formData.num || formData.num>100){
	    wx.showToast({title: '数量不能超过100',icon: 'loading'});
		return;
	}
	if(!formData.publicpack){
	    formData.publicpack=0;
	}
	if(formData.descn&&formData.descn.length>30){
	    wx.showToast({title: '字数不能超过30个',icon: 'loading'});
		return;
	}
	var postData ={
		content:formData.content,
		amount:formData.amount,
		num:formData.num,
		publicpack:formData.publicpack,
		descn:formData.descn
	};
	redpackApi.createPack.call(that,postData,function (res) {
        actionApi.generatePayOrder(app.globalData.userInfo.openId, res.data.id,formData.amount,function(){
		that.setData({});
		wx.showModal({
			content: '创建成功',
			showCancel: false,
			success: function(res){
			  if (res.confirm) {
			    wx.navigateTo({
				  url: '../createRedWallet/createRedWallet?packInfo='+JSON.stringify(res.data)
			    })
			  }
		   }
		});
	  });      
    });
  },
  onLoad: function (options) {
	console.info('index onload');
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else {
	  console.info('index onload cb');
      app.userInfoReadyCallback = function(userInfo){
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  wxpay: function () {
   
  }
})
