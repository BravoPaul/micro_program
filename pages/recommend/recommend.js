const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        param: {},
        major_hidden:true

    },

    onLoad: function (options) {
        // this.data.param['region'] = JSON.parse(options.region)
        // this.data.param['wenli'] = JSON.parse(options.wenli)
        // this.data.param['score'] = JSON.parse(options.score)

        // console.log(this.data)
    },

    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },

    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    get_major_list(){
        this.setData({
            major_hidden: !this.data.major_hidden
        })
    }

});

