const app = getApp()
Page({
    data: {},

    showMoreMajor(e) {
        
        let index_s = parseInt(e.currentTarget.id.split('_')[0])
        let index_c = parseInt(e.currentTarget.id.split('_')[1])
        if (index_c == -1) {
            let result_1 = this.data.major_list[index_s]
            console.log(result_1)
            result_1.hidden = !result_1.hidden
            this.setData({
                ['major_list[' + index_s + ']']: result_1
            })
        }
        
        else {
            let result_1 = this.data.major_list[index_s].major_2[index_c]
            result_1.hidden = !result_1.hidden
            this.setData({
                ['major_list[' + index_s + '].major_2[' + index_c + ']']: result_1
            })
        }
    },

    onLoad: function (options) {

        let that = this
        let result = []

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        wx.request({
            url: app.globalData.localhost_url + '/gaokao/majorlist',
            method: 'POST',
            data: {

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                if (res.statusCode == 200) { //服务端处理正常，登录成功
                    console.log(res.data)
                    result = res.data
                    that.setData({
                        'major_list':res.data
                    })
                }
            },
        });
    },


})