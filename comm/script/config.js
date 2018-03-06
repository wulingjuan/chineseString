/*
备注
city: 城市（在程序载入时获取一次）
count: 返回结果数量
baiduAK: 百度地图AK
apiList: api列表
hotKeyword: 搜索页热门关键词关键词
hotTag: 搜索页热门类型
bannerList: 首页（热映页）轮播图列表列表
skinList: “我的”页面背景列表
shakeSound: 摇一摇音效地址（带url表示远程地址）
shakeWelcomeImg: 摇一摇欢迎图片
*/


//var env = "product";
var env = "test";

var website = "https://www.ybangy.com";
var host = "www.ybangy.com";
if(env == "test"){
  website = "https://nutz.cn/wxopenproxy/qq_6d1ec279/";
  host = "nutz.cn/wxopenproxy/qq_6d1ec279";
}
var sourceParam = "source=2";           
var url = website;//'https://static.sesine.com/wechat-weapp-movie'


module.exports = {
    city: '',
    count: 5,
    orderSize:10,
    fabuCount:8,
    baiduAK: 'Gi5UeaKvey4rz2DPrqNiMp60vVI3xLO6',
    xingzuos: ['水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座'],
    sexs: ["男", "女"],
    urlPrefix: 'https://img.ybangy.com/',
    cdnCosPreFix:'https://img.ybangy.com/',
    ts:'TS',//数据分类 投诉
    apiList: {
        creatChatId: website + "/open/yby/user/creatChatId",
        updateAccCity: website + "/open/yby/user/updateAccCity",
		    checkSession:website+"/open/api/test/checkSession",
	      getOssParam: website + "/open/yby/tencentcos/getPostparam",
        getChatId: website + "/open/yby/user/getChatId",
        collectFormId: website +"/open/yby/user/collectFormId",
        payInvokeUrl: website + "/open/yby/xcs/payWxpay",
        wsUrl: "wss://" + host+"/websocket",
        getSid: website + "/open/yby/xcs/getSid",
        userDetail: website + "/open/yby/xcs/userDetail",
        userMore: website + "/open/yby/xcs/userMore?" + sourceParam,
        sendSms: website +"/open/yby/user/sendSms",
        bindMobile: website +"/open/yby/user/bindMobile",
        bindBelong: website + "/open/yby/user/bindBelong",
        orderList: website + "/open/yby/xcs/newpayorderList",
		withdraw: website + "/open/yby/xcs/withDraw",
        confirmDetail: website + "/open/yby/fabu/confirmDetail",
        confirmPay: website + "/open/yby/fabu/confirmPay",
        uploadImg: website + "/open/yby/fabu/uploadImg",
        fabuAdd: website + "/open/yby/fabu/addFabu",
        uploadRecord: website + "/open/yby/fabu/uploadRecord",
        fabuDetail: website + "/open/yby/fabu/detail",
		fabuAction: website + "/open/yby/fabu/editFabu",
        baseUserInfo: website + "/open/yby/fabu/baseUserInfo",
        updateUserInfo: website + "/open/yby/fabu/updateUserInfo",
        getMemberDay:website + "/open/yby/xcs/getMemberDay",
        getSubcate: website + "/open/yby/product/subCate",
        productList: website + "/open/yby/product/list",
        popular: website + '/open/yby/fabu/list',
        clearChat: website +'/open/yby/chatmanage/delete',
        coming: 'https://api.douban.com/v2/movie/coming_soon',
        top: 'https://api.douban.com/v2/movie/top250',
        search: {
            byKeyword: 'https://api.douban.com/v2/movie/search?q=', 
            byTag: 'https://api.douban.com/v2/movie/search?tag='
        },
        filmDetail: 'https://api.douban.com/v2/movie/subject/',
        personDetail: 'https://api.douban.com/v2/movie/celebrity/',
        baiduMap: 'https://api.map.baidu.com/geocoder/v2/',
		
		createPack:website + "/open/api/redpack/create",
		openPack:website + "/open/api/redpack/open",
		answerPack:website + "/open/api/redpack/answer",
    },
    hotKeyword: ['功夫熊猫', '烈日灼心', '摆渡人', '长城', '我不是潘金莲', '这个杀手不太冷', '驴得水', '海贼王之黄金城', '西游伏妖片', '我在故宫修文物', '你的名字'],
    hotTag: ['动作', '喜剧', '爱情', '悬疑'],
    bannerList: [
        {type:'film', id: '26683290', imgUrl: url + '/images/banner_1.jpg'},
        {type:'film', id: '25793398', imgUrl: url + '/images/banner_2.jpg'},
        {type:'film', id: '26630781', imgUrl: url + '/images/banner_3.jpg'},
        {type:'film', id: '26415200', imgUrl: url + '/images/banner_4.jpg'},
        {type:'film', id: '3025375', imgUrl: url + '/images/banner_5.jpg'}
    ],
    skinList: [
      { title: '沙漠', imgUrl: website + '/assets/img/bg/user_bg_7.jpg' },
      { title: '公路', imgUrl: website + '/assets/img/bg/user_bg_1.jpg'},
      { title: '黑夜森林', imgUrl: website + '/assets/img/bg/user_bg_2.jpg'},
      { title: '鱼与水', imgUrl: website + '/assets/img/bg/user_bg_3.jpg'},
      { title: '山之剪影', imgUrl: website + '/assets/img/bg/user_bg_4.jpg'},
      { title: '火山', imgUrl: website + '/assets/img/bg/user_bg_5.jpg'},
      { title: '科技', imgUrl: website + '/assets/img/bg/user_bg_6.jpg'},
      { title: '叶子', imgUrl: website + '/assets/img/bg/user_bg_8.jpg'},
      { title: '早餐', imgUrl: website + '/assets/img/bg/user_bg_9.jpg'},
      { title: '英伦骑车', imgUrl: website + '/assets/img/bg/user_bg_10.jpg'},
      { title: '草原', imgUrl: website + '/assets/img/bg/user_bg_11.jpg'},
      { title: '城市', imgUrl: website + '/assets/img/bg/user_bg_12.jpg'}
    ],
    jinengCates: []/*['娱乐', '生活', '游戏', '运动', '咨询', '技术']*/,
    jinengItems: []/*[
      ['陪聊天', '逛商场', '练唱歌', '享美食', '看电影', '玩桌游', '玩摄影', '帮选购','陪读书'],
      ['导游向导', '外语陪练', '汽车陪练', '票务帮订', '宠物代管', '美甲美妆', '厨师到家', '跑腿代办','美容美发'],
      ['约桌游', '王者荣耀', '英雄联盟', '德州扑克', '线下游戏', '守望先锋', '狼人杀', '约麻将','魔兽世界'],
      ['羽毛球', '陪跑步', '约自驾', '约骑行', '约健身', '约户外', '高尔夫', '约桌球','游泳帮教'],
      ['情感咨询', '心理咨询', '法律咨询', '求学问教', '财税顾问', '工作咨询', '占卜', '职业规划','装修咨询'],
      ['UI/UE设计', '图片处理', '兼职运营', '外语翻译', '程序编写', '上门家教', '家电维修', '摄影后期','账号共享'],
    ]*/,
    shakeSound: {
        startUrl: url + '/sound/shake.mp3',
        start: '',
        completeUrl: url + '/sound/shakeComplete.wav',
        complete: ''
    },
    uploadFormIds:function(isopen){
      if (arguments.length==0)
	      return;
      var that = this;
      var app = getApp();
      var openId = app.getUserInfo().openId;
      var formIds = app.globalData.formIds;
      if(!openId || !formIds || formIds.length==0){
        return;
      }
      var data = {
        openId: openId,
        formIds: formIds.join(',')
      };
      wx.request({
        url: that.apiList.collectFormId,
        data: data,
        method: 'get',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          app.clearFormIds();
          typeof cb == 'function' && cb(res.data)
        },
        fail: function (err) {
          app.clearFormIds();
          typeof failCb == 'function' && failCb()
        }
      })
    },
    shakeWelcomeImg: url + '/images/shake_welcome.png',
    recordImg: website +"/assets/img/record.png",
    shareImg:website+"/share.jpg"


}