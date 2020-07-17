const app = getApp()
Page({
    data: {
        CustomBar: app.globalData.CustomBar,
        param: {},
        major_hidden: true,
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
            current_batch_school:[]
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


        this.data.param['province_id'] = JSON.parse(options.province_id)
        this.data.param['wenli'] = JSON.parse(options.wenli)
        this.data.param['score'] = JSON.parse(options.score)

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
                    });
                    result_batch_3.forEach(function (value) {
                        value['major_hidden'] = true
                    });
                    that.setData({
                        'rec_result.batch_1': result_batch_1,
                        'rec_result.batch_2': result_batch_2,
                        'rec_result.batch_3': result_batch_3,
                        
                    })

                    that.setData({
                        'rec_result.current_batch_school_ex':that.data.rec_result[that.data.current_batch.key].slice(0,100),
                        'rec_result.current_batch_school':that.data.rec_result[that.data.current_batch.key].slice(0,100),
                        'rec_result.current_batch_school_post':that.data.rec_result[that.data.current_batch.key].slice(0,30),
                    })

                    
                }

            },
        })
    },



    // scrolltoupper: function () {
        
    //     console.log('to up')
    //     if (this.data.page_ex>0){
    //         this.setData({
    //             'page_ex':this.data.page_ex-1,
    //             'page_post':this.data.page_post-1,
    //         })
    //     }
        
    //     let batch_tmp_1 =  this.data.rec_result[this.data.current_batch.key].slice(this.data.page_ex*30,this.data.page_post*30)

    //     if (this.data.rec_result[this.data.current_batch.key].length > this.data.page_ex*30) {
    //         this.setData({
    //             'rec_result.current_batch_school': batch_tmp_1.concat(this.data.rec_result.current_batch_school_post),
    //             'rec_result.current_batch_school_post': batch_tmp_1,
    //         })

    //         // this.setData({
    //         //     topNum: this.data.topNum = 0
    //         // });
    //     }
        
    // },

    // scrolltolower: function () {

    //     console.log('to low')
        
    //     if (this.data.rec_result[this.data.current_batch.key].length > this.data.page_ex*30){
    //         this.setData({
    //             'page_ex':this.data.page_ex+1,
    //             'page_post':this.data.page_post+1,
    //         })
    //         let batch_tmp_1 =  this.data.rec_result[this.data.current_batch.key].slice(this.data.page_ex*30,this.data.page_post*30)
    //         this.setData({
    //             'rec_result.current_batch_school': this.data.rec_result.current_batch_school_ex.concat(batch_tmp_1),
    //             'rec_result.current_batch_school_ex': batch_tmp_1,
    //         })
    //     }
        
    // },




    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },

    batchChange: function (e) {
        console.log(e)
        this.setData({
            'current_batch': this.data.batch[parseInt(e.detail.value)]
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },

    get_major_list(e) {
        let index = parseInt(e.currentTarget.id)

        this.data.rec_result.current_batch_school[index].major_hidden = !this.data.rec_result.current_batch_school[index].major_hidden

        this.setData({
            'rec_result': this.data.rec_result
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

