//index.js
//获取应用实例
const app = getApp()


Page({
    data: {
        options: {
            iconList: [
                {
                    icon: 'explorefill',
                    color: 'red',
                    badge: 120,
                    name: '找大学'
                }, {
                    icon: 'selection',
                    color: 'orange',
                    badge: 1,
                    name: '查专业'
                }, {
                    icon: 'rank',
                    color: 'cyan',
                    badge: 0,
                    name: '看排名'

                },

                {
                    icon: 'news',
                    color: 'yellow',
                    badge: 0,
                    name: '最新动态'
                },


                {
                    icon: 'message',
                    color: 'blue',
                    badge: 0,
                    name: '专家一对一'
                },
                {
                    icon: 'friendfill',
                    color: 'olive',
                    badge: 22,
                    name: '学生社区'
                }
            ],
        },

        recommend: {
            wenli_current: 'wenli_1',
            score: 200,
            province: app.globalData.province,
            province_current: app.globalData.province[4]
        }

    },

    RegionChange: function (e) {
        console.log(e)
        this.setData({
            'recommend.province_current': this.data.recommend.province[parseInt(e.detail.value)]
        })
    },

    wenliSelect: function (e) {
        let id = e.currentTarget.id
        this.setData({
            'recommend.wenli_current': id
        })

        console.log(this.data.recommend.wenli_current)
    },

    get_func: function (e) {
        console.log(e)

        if (e.currentTarget.id === "0") {
            wx.navigateTo({
                url: '/pages/school/school',
            })
        }
        else if (e.currentTarget.id === "1") {
            wx.navigateTo({
                url: '/pages/major/major',
            })
        }
    },


    get_score: function (e) {
        this.setData({
            'recommend.score': e.detail.value
        })
    },

    formSubmit: function (e) {

        let province_id = JSON.stringify(this.data.recommend.province_current.key)
        let province = JSON.stringify(this.data.recommend.province_current.value)
        let wenli = JSON.stringify(this.data.recommend.wenli_current.split('_')[1])
        let score = JSON.stringify(this.data.recommend.score)
        wx.navigateTo({
            url: '/pages/recommend/recommend?province_id=' + province_id + '&wenli=' + wenli + '&score=' + score + '&province=' + province,
        })
    }
})


