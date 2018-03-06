
Page({
  data: {
    belong:null,
    pack:null,
	  getMoney:'',
    time:20,
    // 接龙状态0未抢，1成功，2失败
    state:2,
    getWallList:[
      {
        img: "../../images/common-logo/girl.jpg",
        username:"shirley",
        word:"顺理成章",
        money:"1.00",
        data:"02-04 22:25"
      },
      {
        img: "../../images/common-logo/girl.jpg",
        username: "miyouka",
        word: "顺水人情",
        money: "1.00",
        data: "02-04 22:25"
      },
      {
        img: "../../images/common-logo/girl.jpg",
        username: "miyouka",
        word: "顺水人情",
        money: "1.00",
        data: "02-04 22:25"
      },
      {
        img: "../../images/common-logo/girl.jpg",
        username: "miyouka",
        word: "顺水人情",
        money: "1.00",
        data: "02-04 22:25"
      }
    ]
  },
  answer:function(result){
	var that = this;
	var postData = {
		id:pack.id,
		result:result,
		belong: that.data.belong
	};
	redpackApi.answerPack.call(that,postData,function (res) {
	        if(res.code>=0){
				    that.setData({
					    state:1,
						getMoney:res.data
					});
			}else{
					that.setData({
					    state:2
					});
					wx.showToast({title: res.msg,icon: 'loading'});
			}
					
	});		
  },
  onLoad: function (options) {
    var that = this;
	var scene = options.scene;//二维码扫描传过来的值 格式 {pkid:packId,boid:bid}
	if(scene){
		var params = decodeURIComponent(scene).split(",");
		var packId = params[0];
		var boid = params[1];
	}
	var postData ={
		id:packId,
		boid:boid
	};
	wx.showModal({
        content: '开始答题',
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
			    redpackApi.createPack.call(that,postData,function (res) {
				    if(res.code>=0){
						that.setData({
							pack:res.data.redpack,
							getWallList:data.list,
							belong:postData.boid
						});
						var timer = setInterval(function(){
							that.data.time--;
							if (that.data.time<0){
								clearInterval(timer);
								return;
							}
							that.setData({
								time: that.data.time
							})
						},1000);
					}else{
						wx.showToast({title: res.msg,icon: 'loading'});
					}
					
				});				
			}
        }        
    });
  }    
})
