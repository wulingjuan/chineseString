
Page({
  data: {
    // state:0发出1收到
    state:0,
    giveClick:true,
    getClick:false,
    giveWalletList: [
      {
        money: 5,
        num: 3,
        date: "2月4日 22:48",
        words: "一帆风顺",
        earnNum: 1
      },
      {
        money: 100,
        num: 3,
        date: "2月4日 22:48",
        words: "一帆风顺",
        earnNum: 1
      }
    ],
    getWalletList:[
      {
        money:5,
        num:3,
        date:"2月4日 22:48",
        words:"顺我者昌",
        earnNum:1
      },
      {
        money: 5,
        num: 3,
        date: "2月4日 22:48",
        words: "顺我者昌",
        earnNum: 1
      },
      {
        money: 5,
        num: 3,
        date: "2月4日 22:48",
        words: "顺我者昌",
        earnNum: 1
      },
      {
        money: 5,
        num: 3,
        date: "2月4日 22:48",
        words: "顺我者昌",
        earnNum: 1
      }
    ],
    
  },
  onLoad: function () {
   
  },
  giveTapHandler:function(){
    this.setData({
      state:0,
      giveClick:true,
      getClick:false,
    })
  },
  getTapHandler:function(){
    this.setData({
      state: 1,
      giveClick: false,
      getClick: true,
    })
  }
})
