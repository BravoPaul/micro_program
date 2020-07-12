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
            region_current: '河北省',
            region: [],
            wenli_current: 'wenli_1',
            score: 200
        }

    },

    RegionChange: function (e) {
        this.setData({
            'recommend.region_current': e.detail.value[0]
        })
        console.log(this.data.recommend.region_current)
    },

    wenliSelect: function (e) {
        let id = e.currentTarget.id
        this.setData({
            'recommend.wenli_current': id
        })

        console.log(this.data.recommend.wenli_current)
    },

    get_all_school() {
        wx.navigateTo({
            url: '/pages/school/school',
        })
    },

    get_score: function (e) {
        this.setData({
            'recommend.score': e.detail.value
        })
    },

    formSubmit: function (e) {

        let region = JSON.stringify(this.data.recommend.region_current)
        let wenli = JSON.stringify(this.data.recommend.wenli_current.split('_')[1])
        let score = JSON.stringify(this.data.recommend.score)
        wx.navigateTo({
            url: '/pages/recommend/recommend?region=' + region + '&wenli=' + wenli + '&score=' + score,
        })
    }
})


