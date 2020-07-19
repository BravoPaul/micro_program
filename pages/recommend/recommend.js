const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        param: {},
        major_hidden: true,
        province: app.globalData.province,
        current_batch: {
            key: 'batch_1',
            value: '本科第一批'
        },
        batch: [{
            key: 'batch_1',
            value: '本科第一批'
        },
        {
            key: 'batch_2',
            value: '本科第二批'
        },
        {
            key: 'batch_3',
            value: '高职专科批'
        }],
        rec_result: {
            batch_1: [],
            batch_2: [],
            batch_3: [],
            current_batch_school: []
        },
        page_ex: 0,
        page_post: 1,
        flag: 0

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

        this.setData({
            'param.province_id': JSON.parse(options.province_id),
            'param.wenli': JSON.parse(options.wenli),
            'param.score': JSON.parse(options.score),
            'param.province': JSON.parse(options.province),
        })


        wx.request({
            url: app.globalData.localhost_url + '/gaokao/recommend',
            method: 'POST',
            data: {
                'province_id': this.data.param.province_id,
                'wenli': this.data.param.wenli,
                'score': this.data.param.score,
                'academic_year': '2019',
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: res => {
                let that = this
                let result_batch_1 = []
                let result_batch_2 = []
                let result_batch_3 = []
                let current_batch = {}

                if (res.statusCode == 200) {
                    console.log(res.data)
                    result_batch_1 = res.data['本科第一批']
                    result_batch_2 = res.data['本科第二批']
                    result_batch_3 = res.data['高职专科批']
                    if (result_batch_1.length > 5) {
                        current_batch = {
                            key: 'batch_1',
                            value: '本科第一批'
                        }
                    }
                    else if (result_batch_2.length > 5) {
                        current_batch = {
                            key: 'batch_2',
                            value: '本科第二批'
                        }
                    }
                    else {
                        current_batch = {
                            key: 'batch_3',
                            value: '高职专科批'
                        }
                    }

                    result_batch_1.forEach(function (value) {
                        value['major_hidden'] = true
                        value['sch_first_tags'] = tag_traitor(value['sch_tags'])[0]
                    });
                    result_batch_2.forEach(function (value) {
                        value['major_hidden'] = true
                        value['sch_first_tags'] = tag_traitor(value['sch_tags'])[0]
                    });
                    result_batch_3.forEach(function (value) {
                        value['major_hidden'] = true
                        value['sch_first_tags'] = tag_traitor(value['sch_tags'])[0]
                    });
                    that.setData({
                        'rec_result.batch_1': result_batch_1,
                        'rec_result.batch_2': result_batch_2,
                        'rec_result.batch_3': result_batch_3,
                        'current_batch':current_batch
                    })

                    that.setData({
                        'rec_result.current_page': 0,
                        ['rec_result.current_batch_school[' + 0 + ']']: that.data.rec_result[that.data.current_batch.key].slice(0, 30),
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
    },


    scrolltolower: function () {

        console.log('下拉触发')
        let current_page = this.data.rec_result.current_page + 1
        let index_0 = current_page * 30
        let index_1 = (current_page * 30) * 30

        console.log('to low')
        this.setData({
            ['rec_result.current_batch_school[' + current_page + ']']: this.data.rec_result[this.data.current_batch.key].slice(index_0, index_1),
            'rec_result.current_page': current_page
        })


    },


    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },

    batchChange: function (e) {
        console.log(e)
        let current_batch = this.data.batch[parseInt(e.detail.value)]
        this.setData({
            'current_batch': current_batch,
            'rec_result.current_page': 0,
            ['rec_result.current_batch_school[' + 0 + ']']: this.data.rec_result[current_batch.key].slice(0, 30),
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    get_major_list(e) {
        console.log('正在请求专业')
        console.log(this.data.rec_result.current_batch_school[page_num])
        let page_num = parseInt(e.currentTarget.id.split('_')[0])
        let index = parseInt(e.currentTarget.id.split('_')[1])
        // this.data.rec_result.current_batch_school[index].major_hidden = !this.data.rec_result.current_batch_school[index].major_hidden
        this.setData({
            ['rec_result.current_batch_school[' + page_num + ']['+index+'].major_hidden']:!this.data.rec_result.current_batch_school[page_num][index].major_hidden
            // 'rec_result': this.data.rec_result
        })
    }

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

