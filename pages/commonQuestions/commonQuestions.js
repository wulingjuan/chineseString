//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        // 问题列表
        questionsArray:[
            {
                title:"嘻嘻包怎么玩？",
                content: "你可以设置一个成语接龙的红包，好友在完成成语接龙才能领取红包奖励。",
                flag:false
            },
            {
                title: "好友可以转发我的红包么？",
                content: "可以的，你把红包分享给好友或者微信群，其他好友均可以再次转发。",
                flag: false
            },
            {
                title: "我支付好了，红包没有发出去？",
                content: "请在【我的记录】中找到相应的记录，点击进入详情后点击【去转发】将红包转发出去。",
                flag: false
            },
            {
                title: "未领取的金额怎么处理？",
                content: "未领取的金额72小时后，可以将红包作废，返还到小程序余额，可直接提现。",
                flag: false
            },
            {
                title: "发成语接龙的红包收取其他费用吗？",
                content: "发红包不收取其他任何费用。",
                flag: false
            },
            {
                title: "如何提现到微信钱包？",
                content: "在首页底部的【余额提现】，或者在红包页面点击【去提现】，均可以进行提现。单次提现金额不得少于1元，平台会收取2%的手续费。提现1-3个工作日到账。",
                flag: false
            },
            {
                title: "金额不足1元如何提现？",
                content: "去红包广场多抢一些红包，或者自己创建一个红包自己领取，将余额凑足1元即可提现。",
                flag: false
            },
            {
                title: "自己发的成语接龙在哪里查看？",
                content: "在首页左下角点击【我的记录】，或者在红包页面点击【红包记录】，即可以查到自己发出和收到的红包记录。",
                flag: false
            },
        ]
    },
    // 点击展开
    tapHandler(e){
        var index =  e.target.dataset.index;
        this.data.questionsArray[index].flag = !this.data.questionsArray[index].flag
        this.setData({
            questionsArray: this.data.questionsArray
        })
    }
})
