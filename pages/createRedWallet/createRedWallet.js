//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
       packInfo:null,
	   userInfo:null
    },
	onLoad:function(param){
      var that = this;
	  that.setData({
			packInfo:JSON.parse(param.packInfo),
			userInfo:getApp().userInfo
	  });	
      var srcWidth = wx.getSystemInfoSync().windowWidth;
      const ctx = wx.createCanvasContext('myCanvas');
      ctx.drawImage("../../images/common-logo/bg.png", 0,0,srcWidth,600);
      // 头像
      ctx.save();
      ctx.beginPath();
      ctx.arc(srcWidth / 2, 80, 30, 0, 2 * Math.PI)
      ctx.setFillStyle('#ffe2b1');
      ctx.fill();
      ctx.clip();
      ctx.drawImage("../../images/common-logo/girl.jpg", srcWidth/2-30, 50, 60, 60);
      ctx.restore();
     
      // ctx.drawImage("../../images/common-logo/girl.jpg", srcWidth / 2 - 30,20,60,60);
      // 文字
      ctx.setFontSize(16);
      ctx.setFillStyle("#ffffff"); 
      ctx.fillText('发了一个成语接龙红包', srcWidth/2-80, 140);
      // 画logo

      ctx.save();
      ctx.beginPath();
      ctx.arc(srcWidth / 2, 300, 50, 0, 2 * Math.PI);
      ctx.setFillStyle('#ffe2b1');
      ctx.fill();
      ctx.clip();
      ctx.drawImage("../../images/create_words/logo.png", srcWidth/2-50, 250, 100, 100);
      ctx.restore();

      //底部文字
      ctx.setFontSize(16);
      ctx.setFillStyle("#ffffff");
      ctx.fillText('长按识别小程序，接成语领赏金', srcWidth / 2 - 100, 400);
      ctx.draw();
    }
})
