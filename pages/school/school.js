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
        page_num_ex: 0,
        page_num_post: 1,
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: 'http://192.168.1.7:8080/gaokao/index',
            method: 'POST',
            data: {
                'page_num_ex': this.data.page_num_ex,
                'page_num_post': this.data.page_num_post
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                var result = []
                if (res.statusCode == 200) { //服务端处理正常，登录成功
                    //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                    res.data.forEach(function (value) {
                        var value_format = value.fields
                        value_format.sch_id = value.pk
                        result = result.concat(value_format)
                    });
                    that.setData({
                        'item': result
                    })
                }
            },
        })
    },
    onPullDownRefresh: function () {
        let that = this
        // 标题栏显示刷新图标，转圈圈
        wx.showNavigationBarLoading()

        console.log("onPullDownRefresh");

        // 请求最新数据
        that.getData();

        setTimeout(() => {
            // 标题栏隐藏刷新转圈圈图标
            wx.hideNavigationBarLoading()

        }, 2000);

    },


    onReachBottom: function () {

        this.setData({
            'page_num_ex': this.data.page_num_ex + 1,
            'page_num_post': this.data.page_num_post + 1
        })
        var that = this
        wx.request({
            url: 'http://192.168.1.7:8080/gaokao/index',
            method: 'POST',
            data: {
                'page_num_ex': this.data.page_num_ex,
                'page_num_post': this.data.page_num_post
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                let result = []
                if (res.statusCode == 200) { //服务端处理正常，登录成功
                    //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                    res.data.forEach(function (value) {
                        let value_format = value.fields
                        value_format.sch_id = value.pk
                        result = result.concat(value_format)
                    });
                    that.setData({
                        'item': that.data.item.concat(result)

                    })
                }
            },
        })
    },
    schClick: function (e) {
        var queryBean = JSON.stringify(e.currentTarget.id)
        wx.navigateTo({
            url: '/pages/school_detail/school_detail?sch_id=' + queryBean,
        })
        console.log('跳转到详情页')
    }
});