const app = getApp()
Page({
    data: {
        select: false,
        tihuoWay: '省份',
        items: [
            { value: 1, name: '文科', checked: 'false' },
            { value: 2, name: '理科', checked: 'true' },
        ],
        wenli: 2,
        score: -1,
        result_list: [],
        page_num_ex: 0,
        page_num_post: 1,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        list: [],
        load: true,
    },
    onLoad: function (options) {
        var that = this
        wx.request({
            url: 'http://192.168.1.5:8080/gaokao/index',
            method: 'POST',
            data: {
                'page_num_ex': this.data.page_num_ex,
                'page_num_post': this.data.page_num_post,
                'index':'全部高校'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                console.log(res.data)
                let result = []
                if (res.statusCode == 200) { //服务端处理正常，登录成功
                    //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                    res.data.forEach(function (value) {
                        let value_format = value.fields
                        value_format.sch_id = value.pk
                        result = result.concat(value_format)
                    });
                    that.setData({
                        'item': result
                    })
                }
            },
        })
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        let list = [{}];
        let index = ['全部院校', '985', '211', '双一流', '研究生点', '民办高校', '公立大学', '本科第一批', '本科第二批', '高职专科批', '一线城市', '新一线城市', '北京',
            '上海',
            '天津',
            '重庆',
            '广东',
            '河北',
            '辽宁',
            '吉林',
            '黑龙江',
            '山东',
            '江苏',
            '浙江',
            '安徽',
            '福建',
            '江西',
            '广西',
            '海南',
            '河南',
            '湖南',
            '湖北',
            '山西',
            '内蒙古',
            '宁夏',
            '青海',
            '陕西',
            '甘肃',
            '新疆',
            '四川',
            '贵州',
            '云南',
            '西藏',
            '香港',
            '澳门',
            '台湾']
        for (let i = 0; i < index.length; i++) {
            list[i] = {};
            list[i].type = index[i]
            list[i].page_num_ex = 0
            list[i].page_num_post = 30
            list[i].content = [{}]
            for (let j = 0; j < 4; j++) {
                if (i < 4) {
                    list[i].content[j] = {}
                    list[i].content[j].name = '凯尔'
                    list[i].content[j].langue = '我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。我已天理为凭，踏入这片荒芜，不再受凡人的枷锁遏制。'

                }
            }
            list[i].id = i;
        }

        this.setData({
            list: list,
            listCur: list[0]
        })
        console.log(this.data.list)
    },

    schClick: function (e) {
        var queryBean = JSON.stringify(e.currentTarget.id)
        wx.navigateTo({
            url: '/pages/school_detail/school_detail?sch_id=' + queryBean,
        })
        console.log('跳转到详情页')
    },

    onReachBottom: function () {

        console.log('下拉到底')

        this.setData({
            'page_num_ex': this.data.page_num_ex + 1,
            'page_num_post': this.data.page_num_post + 1
        })
        var that = this
        wx.request({
            url: 'http://192.168.1.5:8080/gaokao/index',
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

    onReady() {
        wx.hideLoading()
    },
    tabSelect(e) {
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            MainCur: e.currentTarget.dataset.id,
            VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
        })
    },
    VerticalMain(e) {
        let that = this;
        let list = this.data.list;
        let tabHeight = 0;
        if (this.data.load) {
            for (let i = 0; i < list.length; i++) {
                let view = wx.createSelectorQuery().select("#main-" + list[i].id);
                view.fields({
                    size: true
                }, data => {
                    list[i].top = tabHeight;
                    tabHeight = tabHeight + data.height;
                    list[i].bottom = tabHeight;
                }).exec();
            }
            that.setData({
                load: false,
                list: list
            })
        }
        let scrollTop = e.detail.scrollTop + 20;
        for (let i = 0; i < list.length; i++) {
            if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                that.setData({
                    VerticalNavTop: (list[i].id - 1) * 50,
                    TabCur: list[i].id
                })
                return false
            }
        }
    }
});