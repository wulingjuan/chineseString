var config = require('./config.js');
var util = require('../../util/util.js');
class Socket {
  constructor() {
	  console.log('socket实例化');
    this.connected = false
    this.socketMsgQueue = [];
    this.hearBeat = null;
    this.isInUse = false;
	  this.tryCloseWs = false;
  }
  init(){
    var that = this;
    var personId = getApp().getUserInfo().id;
    if(!personId){
      console.warn("无法初始化ws链接，本地的userId为"+personId);
      return;
    }
    this.host = config.apiList.wsUrl + "?personId=" + personId;
    if (this.isInUse){
       console.log('已经发起了WebSocket连接，本次不予处理，url:' + this.host);
       return;
    }
    this.isInUse = true; 
    this.tryCloseWs = false;
    this.connected = false; 
    clearInterval(this.hearBeat);  
    console.log('发起WebSocket连接，url:' + this.host);
	  try{
      wx.connectSocket({
        url: that.host
      });
    }catch(e){
      this.isInUse = false;
    }

    // 监听连接成功
    wx.onSocketOpen((res) => {
    console.log(util.getTime() +' ,WebSocket连接已打开！')
	  if(this.tryCloseWs){
		  wx.closeSocket();
		  console.log(util.getTime()+' ,init 已关闭WebSocket')
		  this.connected = false;
		  this.isInUse = false;
		  this.tryCloseWs = false;
		  clearInterval(this.hearBeat);
		  return;
	  }
    this.connected = true;
	  this.isInUse = true;

    for (var i = 0; i < this.socketMsgQueue.length; i++) {
      that.sendMessage(this.socketMsgQueue[i])
    }
    this.socketMsgQueue = [];
    
    if (this.connected){
        this.hearBeat = setInterval(function(){
          that.sendMessage({
            action:"heartBeat",
            content:"50000"
          })
          console.log(util.getTime() +' ,WebSocket heartBeat')
        }, 50000);  
      }
    })

    // 监听连接断开
    wx.onSocketError((res) => {
      console.warn(util.getTime()+' ,WebSocket连接打开失败，请检查！reson:' + JSON.stringify(res))
      that.connected = false;
      that.isInUse = false;
      clearInterval(that.hearBeat);
     // wx.connectSocket({
     //   url: this.host
    //  })
    })

    // 监听连接关闭
    wx.onSocketClose((res) => {
      that.connected = false;
      that.isInUse = false;
      that.tryCloseWs = false;
      clearInterval(that.hearBeat);
      console.warn(util.getTime() +' ,WebSocket 已关闭！reson:'+JSON.stringify(res));    
     // console.log('尝试重连')
     // wx.connectSocket({
     //   url: this.host
    //  })
    })
  }
  //对外接口，发送消息和接受消息
  sendMessage(data) {
    var that  = this;
    that.socketMsgQueue.push(data);
    if (that.connected) {
      while (that.socketMsgQueue.length > 0) {
        var msg = that.socketMsgQueue.pop();
        try{
          wx.sendSocketMessage({
            data: JSON.stringify(msg)
          })
        }catch(e){}
      }     
    }else{
      console.warn('try to reconnect ws');     
      that.init();//尝试重连
    }
  }
  onMessage(callback) {
    var that = this;
    if(typeof(callback) != 'function')
      return
    // 监听服务器消息
    wx.onSocketMessage((res) => {
      const data = JSON.parse(res.data)
      callback(data)
    })
  }
  closeWebSocket(cb){
    var that = this;
    that.tryCloseWs = true;
    if (that.connected) {
      console.log(util.getTime() + ' ,已关闭WebSocket')
      that.connected = false;
      that.isInUse = false;
      that.tryCloseWs = false;
      clearInterval(that.hearBeat);
		  wx.closeSocket();
	 }
	 if(typeof(callback) == 'function'){
		cb();
	 }
  }
}

const socket = new Socket()

export default socket