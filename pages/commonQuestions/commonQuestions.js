//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        questionsArray:[
            {
                title:"如何提现到微信钱包",
                content:"如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包",
                flag:false
            },
            {
                title: "如何提现到微信钱包",
                content: "如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包",
                flag: false
            },
            {
                title: "如何提现到微信钱包",
                content: "如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包如何提现到微信钱包",
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
