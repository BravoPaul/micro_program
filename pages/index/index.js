//index.js
//获取应用实例
const app = getApp()
//
// Page({
//   data: {
//     motto: '小眼睛是个笨蛋',
//     time: (new Date()).toString(),
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })

Page({
    data: {
        select: false,
        tihuoWay: '省份',
        items: [
            {value: 1, name: '文科', checked: 'false'},
            {value: 2, name: '理科', checked: 'true'},
        ],
        wenli: 2,
        score: -1,
        result_list: [],
    },
    onLoad: function (options) {
    },
    bindShowMsg() {
        this.setData({select: !this.data.select})
    },
    mySelect(e) {
        var name = e.currentTarget.dataset.name
        this.setData({tihuoWay: name, select: false})
    },
    onShareAppMessage: function () {
    },
    radioChange(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        this.data.wenli = e.detail.value

        const items = this.data.items
        for (let i = 0, len = items.length; i < len; ++i) {
            items[i].checked = items[i].value === e.detail.value
        }

        this.setData({
            items
        })
    },
    bindKeyInput: function (e) {
        this.data.score = parseInt(e.detail.value)

    },
    recommend() {

        if (this.data.score < 0) {
            console.log('请输入正确的分数')
        } else {
            console.log('省份：', this.data.tihuoWay)
            console.log('文理科：', this.data.wenli)
            console.log('分数：', this.data.score)
            wx.request({
                url: 'http://30.77.54.40:8080/gaokao/index',
                method: 'POST',
                data: {
                    'name': '清华大学',

                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    if (res.statusCode == 200) { //服务端处理正常，登录成功
                        //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                        console.log(res.data)
                    }
                },
            })
        }
    },
    // formSubmit: function (e) {
    //     var obj = this;
    //     var post = e.detail.value;
    //     // console.log(e.detail.value);
    //     //请求接口
    //     wx.request({
    //         //这里是你要调用的接口
    //         url: 'http://192.168.1.7:8080/gaokao',
    //         header: {
    //             "Content-Type": "application/x-www-form-urlencoded",
    //             "Cookie": "csrftoken=vmYa1IXXNsPfs5h3i1YxNR9PTXkm07wYwkaJylbw7av2UfzG02ZfpvQl7cxlBLbF",
    //             "Host": "192.168.1.7:8080",
    //             "Referer": "http://192.168.1.7:8080/polls/1/"
    //
    //         },
    //         method: "POST",
    //         data: {
    //             "csrfmiddlewaretoken": 'r5Faea31nrflNxm5Oxi6Bs9zskL8xkT3s3RJLNhAH9V8fHEIwyjOd6Q5GzY78YyK&choice=3'
    //
    //         },
    //         success: function (res) {
    //             //请求成功后的回调
    //             console.log(res.data.result);
    //             // var result = res.data.result,
    //             //赋值
    //             obj.setData({
    //                 item: res.data.result,
    //                 // realtime: res.data.result.city.realtime
    //             })
    //         },
    //         fail: function () {
    //             console.log('提交失败');
    //         }
    //     })
    // },
    handlePushAbout() {
        wx.navigateTo({
            url: '/pages/school/school',
        })
    }
})
