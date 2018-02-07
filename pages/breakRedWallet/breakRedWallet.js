
Page({
  data: {
    time:20,
    // 接龙状态0未抢，1成功，2失败
    state:0,
    getWallList:[
      {
        img: "../../images/common-logo/girl.jpg",
        username:"shirley",
        word:"顺利成章",
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
  onLoad: function () {
    var that = this;
    var timer = setInterval(function(){
        that.data.time--;
        if (that.data.time<0){
            clearInterval(timer);
            return;
        }
        that.setData({
            time: that.data.time
        })
        },1000)
    }
})
