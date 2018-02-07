
Page({
  data: {
    flag:false,
    annoceList:[
      {
        img:"../../images/create_words/person.jpg",
        money:5,
        num:3,
        earnNumber:1,
        username:"shirley"
      },
      {
        img: "../../images/create_words/person.jpg",
        money: 5,
        num: 3,
        earnNumber: 1,
        username: "shirley"
      },
      {
        img: "../../images/create_words/person.jpg",
        money: 5,
        num: 3,
        earnNumber: 1,
        username: "shirley"
      }
    ]
  },
  onLoad: function () {
   
  },
  tapHandler:function(){
    this.setData({
      flag: true
    })
  },
  closeTapHandler:function(){
    this.setData({
      flag:false
    })
  },
  updateHandler:function(){
    // 重新渲染列表及数据
  }
})
