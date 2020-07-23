const app = getApp()
Page({
    data: {
        major_detail:{
            intro:'intro',
            knowleage_requirement:'knowleage_requirement',
            training_objective:'training_objective',
            main_course:'main_course',
            teaching_practice:'teaching_practice',
            employment_info:'employment_info',
            career:'career'
        }
        
    },

    // onLoad: function (options) {

    //     let that = this
    //     let result = []

    //     wx.getSystemInfo({
    //         success: function (res) {
    //             that.setData({
    //                 scrollHeight: res.windowHeight
    //             });
    //         }
    //     });
    //     wx.request({
    //         url: app.globalData.localhost_url + '/gaokao/majorlist',
    //         method: 'POST',
    //         data: {

    //         },
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded',
    //         },
    //         success: res => {
    //             if (res.statusCode == 200) { //服务端处理正常，登录成功
    //                 console.log(res.data)
    //                 result = res.data
    //                 that.setData({
    //                     'major_list':res.data
    //                 })
    //             }
    //         },
    //     });
    // },


})