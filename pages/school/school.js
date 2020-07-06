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
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        Custom: app.globalData.Custom,
        TabCur: 'sch_0',
        MainCur: '全部院校',
        VerticalNavTop: 0,
        currentTab:0,
        sch_list: {
            catagory: ['全部院校', '985', '211', '双一流', '研究生点', '公立大学', '民办高校', '本科第一批', '本科第二批', '高职专科批', '一线城市', '新一线城市',
                '北京', '上海', '天津', '重庆', '广东', '河北', '辽宁', '吉林', '黑龙江', '山东', '江苏', '浙江', '安徽', '福建', '江西', '广西', '海南', '河南', '湖南', '湖北', '山西', '内蒙古', '宁夏', '青海', '陕西', '甘肃', '新疆', '四川', '贵州', '云南', '西藏', '香港', '澳门', '台湾'],
            sch_0: {
                first: 1,
                total: 2900,
                name: '全部院校',
                page_num_ex: 0,
                page_num_post: 1,
                content: []
            }
        },
        load:true
    },


    onLoad: function (options) {

        let that = this

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });
        wx.request({
            url: app.globalData.localhost_url + '/gaokao/listmeta',
            method: 'POST',
            data: {

            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                console.log(res.data)
                if (res.statusCode == 200) { //服务端处理正常，登录成功
                    let result_format = {}
                    //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                    res.data.forEach(function (value) {
                        result_format[value['condition']] = value['total']
                    });
                    let cate = that.data.sch_list.catagory
                    for (let i = 0; i < cate.length; i++) {
                        let index = 'sch_' + i
                        let sch_tmp = {}
                        sch_tmp['first'] = 0
                        sch_tmp['total'] = result_format[cate[i]]
                        sch_tmp['name'] = cate[i]
                        sch_tmp['page_num_ex'] = 0
                        sch_tmp['page_num_post'] = 1
                        sch_tmp['content'] = []
                        that.data.sch_list[index] = sch_tmp
                    }
                }
            },
        });

        wx.request({
            url: app.globalData.localhost_url + '/gaokao/list',
            method: 'POST',
            data: {
                'page_num_ex': this.data.sch_list.sch_0.page_num_ex,
                'page_num_post': this.data.sch_list.sch_0.page_num_post,
                'condition': this.data.sch_list.sch_0.name
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                let that = this
                let result = []

                if (res.statusCode == 200) {
                    console.log(res.data)
                    //服务端处理正常，登录成功
                    //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                    res.data.forEach(function (value) {
                        let value_field = value.fields
                        value_field['sch_id'] = value['pk']
                        value_field['sch_tags_1'] = tag_traitor(value_field['sch_tags'])[0]
                        value_field['sch_tags_2'] = tag_traitor(value_field['sch_tags'])[1]
                        result = result.concat(value_field)
                    });
                    that.setData({
                        'sch_list.sch_0.content': that.data.sch_list.sch_0.content.concat(result),
                        'sch_list.sch_0.page_num_ex': 1,
                        'sch_list.sch_0.page_num_post': 2,
                        'currentSch': that.data.sch_list.sch_0
                    })
                }

            },
        })
    },




    tabSelect(e) {
        wx.pageScrollTo({
            scrollTop: 0
        })
        this.setData({
            topNum: this.data.topNum = 0
        });
        this.data.toView = false
        this.setData({
            currentTab:e.currentTarget.dataset.id,
            TabCur: 'sch_' + e.currentTarget.dataset.id,
            MainCur: this.data.sch_list.catagory[parseInt(e.currentTarget.dataset.id)],
            toView: 'main_text'
        })

        let tabcur = this.data.TabCur
        let that = this

        if (this.data.sch_list[tabcur].first == 0) {
            wx.request({
                url: app.globalData.localhost_url + '/gaokao/list',
                method: 'POST',
                data: {
                    'page_num_ex': 0,
                    'page_num_post': 1,
                    'condition': this.data.sch_list[tabcur].name
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    if (res.statusCode == 200) {
                        let result = []
                        //服务端处理正常，登录成功
                        //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                        res.data.forEach(function (value) {
                            let value_field = value.fields
                            value_field['sch_id'] = value['pk']
                            value_field['sch_tags_1'] = tag_traitor(value_field['sch_tags'])[0]
                            value_field['sch_tags_2'] = tag_traitor(value_field['sch_tags'])[1]
                            result = result.concat(value_field)
                        });

                        that.data.sch_list[tabcur].content = result
                        that.data.sch_list[tabcur].page_num_ex = that.data.sch_list[tabcur].page_num_ex + 1
                        that.data.sch_list[tabcur].page_num_post = that.data.sch_list[tabcur].page_num_post + 1
                        that.data.sch_list[tabcur].first = 1
                        that.setData({
                            'currentSch': that.data.sch_list[tabcur]
                        })
                        // console.log(that.data.currentSch)
                    }
                },
            })
        }
        else {
            this.setData({
                'currentSch': this.data.sch_list[tabcur]
            })
        }

    },

    schClick: function (e) {
        var queryBean = JSON.stringify(e.currentTarget.id)
        wx.navigateTo({
            url: '/pages/school_detail/school_detail?sch_id=' + queryBean,
        })
    },

    scrolltoupper: function () {
        console.log('下拉到底')
        let tabcur = this.data.TabCur

        let that = this
        if (that.data.sch_list[tabcur].page_num_ex * 30 >= that.data.sch_list[tabcur].total) {
            this.setData({
                isHideLoad: true
            })
            wx.showLoading({ title: '无更多大学', icon: 'loading', duration: 1 });
        }
        else {
            wx.request({
                url: app.globalData.localhost_url + '/gaokao/list',
                method: 'POST',
                data: {
                    'page_num_ex': that.data.currentSch.page_num_ex,
                    'page_num_post': that.data.currentSch.page_num_post,
                    'condition': that.data.currentSch.name
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    if (res.statusCode == 200) {
                        let result = []
                        //服务端处理正常，登录成功
                        //wx.setStorageSync("cookies", res.header["Set-Cookie"]); //存进去的是所有cookie串在一起的字符串，包括csrftoken和sessionid，但我们不要用这个方式，原因见下文介绍
                        res.data.forEach(function (value) {
                            let value_field = value.fields
                            value_field['sch_id'] = value['pk']
                            value_field['sch_tags_1'] = tag_traitor(value_field['sch_tags'])[0]
                            value_field['sch_tags_2'] = tag_traitor(value_field['sch_tags'])[1]
                            result = result.concat(value_field)
                        });

                        that.data.sch_list[tabcur].content = that.data.sch_list[tabcur].content.concat(result)
                        that.data.sch_list[tabcur].page_num_ex = that.data.sch_list[tabcur].page_num_ex + 1
                        that.data.sch_list[tabcur].page_num_post = that.data.sch_list[tabcur].page_num_post + 1,
                            that.setData({
                                'currentSch': that.data.sch_list[tabcur]
                            })
                    }
                },
            })
        }
    },

    onReady() {
        wx.hideLoading()
    },

});

function tag_traitor(tags_o) {
    let tags = tags_o.replace(/[']+/g, "")
    tags = tags.replace(/\s+/g, "")
    tags = tags.replace("[", "")
    tags = tags.replace("]", "")
    var result_tag_1 = []
    var result_tag_2 = []
    let tag_list = tags.split(',')
    let first_stage = ['985', '211', '双一流']

    for (let i = 0; i < tag_list.length; i++) {
        if (first_stage.indexOf(tag_list[i]) >= 0) {
            result_tag_1 = result_tag_1.concat(tag_list[i])
        }
        else {
            result_tag_2 = result_tag_2.concat(tag_list[i])
        }
    }
    return [result_tag_1.join(','), result_tag_2.join(',')]
}