const app = getApp()
Page(
    {
        data: {
            school: {
                meta: {},
                sch_id: '',
                post_date: '2019-01-10',
                intro: [
                    {
                        name: 'h3',
                        attrs: {
                            class: 'p_class'
                        },
                        children: [{
                            type: 'text',
                            text: '基础信息'
                        }]
                    },
                ],
                detail: [],
                winWidth: 0,
                winHeight: 0,
                currentTab: 0,
                rank: [
                    {
                        name: 'h3',
                        attrs: {
                            class: 'p_class'
                        },
                        children: [{
                            type: 'text',
                            text: '学校排名'
                        }]
                    },
                ],
                people: [
                    {
                        name: 'h3',
                        attrs: {
                            class: 'p_class'
                        },
                        children: [{
                            type: 'text',
                            text: '知名校友'
                        }]
                    },
                ],
                views: 1000,
                votes: 100
            },

            score: {
                wenli: [{
                    wenli_id: '2',
                    wenli_name: '理科'
                },
                ],
                wenli_selected: {
                    id: '1',
                    name: '文科'
                },
                wenli_defaut: {
                    id: '1',
                    name: '文科'
                },
                wenli_major: [{
                    wenli_id: '2',
                    wenli_name: '理科'
                },
                ],
                wenli_major_selected: {
                    id: '1',
                    name: '文科'
                },
                wenli_major_defaut: {
                    id: '1',
                    name: '文科'
                },
                year_major: [
                    {
                        wenli_id: '2018',
                        wenli_name: '2018'
                    },
                    {
                        wenli_id: '2017',
                        wenli_name: '2017'
                    },
                    {
                        wenli_id: '2016',
                        wenli_name: '2016'
                    },
                ],
                year_major_selected: {
                    id: '2019',
                    name: '2019'
                },
                year_major_defaut: {
                    id: '2019',
                    name: '2019'
                },

                yearScore: {
                    content: [],
                    titles: ['年份', '批次', '分数/排名', '录取数目', '最低分线差'],
                    props: ['year', 'diploma', 'score_rank', 'admission', 'diff'],
                    columnWidths: ['120rpx', '150rpx', '250rpx', '80rpx', '150rpx'],
                    border: true,
                    stripe: true,
                },
                yearScore_wenke_content: [],
                yearScore_like_content: [],

                majorScore: {
                    content: [],
                    titles: ['专业名', '批次', '分数/排名', '录取数目', '最低分线差'],
                    props: ['year', 'diploma', 'score_rank', 'admission', 'diff'],
                    columnWidths: ['170rpx', '150rpx', '250rpx', '80rpx', '100rpx'],
                    border: true,
                    stripe: true,
                },
                major_content: {
                    wenli_1: {
                        year_2019: [],
                        year_2018: [],
                        year_2017: [],
                        year_2016: []
                    },
                    wenli_2: {
                        year_2019: [],
                        year_2018: [],
                        year_2017: [],
                        year_2016: []
                    }
                }

            }
        },

        onLoad: function (options) {

            // 计算详情页高度
            let that = this
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        clientHeight: res.windowHeight,
                        clientWidth: res.windowWidth
                    });
                }
            })

            var sch_id = JSON.parse(options.sch_id);
            this.data.sch_id = sch_id

            console.log('正在获取sch_id',sch_id)

            wx.request({
                url: app.globalData.localhost_url+'/gaokao/detail',
                method: 'POST',
                data: {
                    'sch_id': sch_id,
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    console.log(res.data)
                    let that = this
                    let result_detail = []
                    let result_intro = []
                    let result_meta = {}
                    let result_rank = this.data.school.rank
                    let result_people = this.data.school.people
                    let result_meta_detail = []
                    let result_score_wenke = []
                    let result_score_like = []
                    if (res.statusCode == 200) { //服务端处理正常，登录成功
                        let result_list = res.data
                        console.log(result_list)
                        result_list.forEach(function (value) {
                            if (value.model === 'gaokao.schooldetail') {
                                let value_field = value.fields
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_intro', '学校介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_scholarship', '奖学金介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_fellowship', '助学金介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'canteen_desc', '食堂介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'stu_dorm_desc', '住宿介绍')
                                result_meta_detail = sch_intro_traitor(value_field, result_meta_detail, 'sch_tel_num', '电话')
                                result_meta_detail = sch_intro_traitor(value_field, result_meta_detail, 'sch_web_url', '地址')
                            }
                            else if (value.model === 'gaokao.school') {
                                let value_field = value.fields

                                let title = [{
                                    name: 'h3',
                                    attrs: {
                                        class: 'p_class'
                                    },
                                    children: [{
                                        type: 'text',
                                        text: value_field['sch_name']
                                    }]
                                }]

                                let logo = [{
                                    name: 'p',
                                    attrs: {
                                        class: 'p_class'
                                    },
                                    children: [{
                                        type: 'node',
                                        name: 'img',
                                        attrs: {
                                            class: 'img_class',
                                            src: value_field['sch_logo']
                                        }
                                    }]
                                }]
                                let tags = value_field['sch_tags'].replace(/[']+/g, "")
                                tags = tags.replace("[", "")
                                tags = tags.replace("]", "")
                                result_meta['tag'] = tags
                                result_meta['logo'] = logo
                                result_meta['title'] = title
                                result_intro = sch_intro_traitor(value_field, result_intro, 'sch_english_name', '英文名')
                                result_intro = sch_intro_traitor(value_field, result_intro, 'location', '地点')
                                result_intro = sch_intro_traitor(value_field, result_intro, 'sch_create_time', '成立时间')
                                result_intro = sch_intro_traitor(value_field, result_intro, 'sch_competent_desc', '直属机构')
                                result_intro = sch_intro_traitor(value_field, result_intro, 'diploma_desc', '招生类型')
                                result_intro = sch_intro_traitor(value_field, result_intro, 'sch_run_type_desc', '学校属性')
                                // result_intro = sch_intro_traitor(value_field, result_intro, 'sch_tags', '学校标签')

                            }
                            else if (value.model === 'gaokao.schoolrank') {
                                let value_field = value.fields
                                result_rank = sch_rank_traitor(value_field, result_rank)
                            }
                            else if (value.model === 'gaokao.schoolfamous') {
                                let value_field = value.fields
                                result_people = sch_people_traitor(value_field, result_people)
                            }
                            else if (value.model === 'gaokao.schoolscore') {
                                let value_field = value.fields
                                result_score_wenke = sch_score_traitor(value_field, result_score_wenke, '1')
                                result_score_like = sch_score_traitor(value_field, result_score_like, '2')
                            }
                            else if (value.model === 'gaokao.schoolmajor') {
                                let value_field = value.fields
                                let index_wenli = 'wenli_' + value_field['wenli']
                                let index_year = 'year_' + value_field['academic_year']
                                that.data.score.major_content[index_wenli][index_year] = sch_major_traitor(value_field, that.data.score.major_content[index_wenli][index_year])
                            }
                        });
                        result_intro = result_intro.concat(result_meta_detail)
                        that.setData({
                            'school.detail': that.data.school.detail.concat(result_detail),
                            'school.intro': that.data.school.intro.concat(result_intro),
                            'school.rank': result_rank,
                            'school.people': result_people,
                            'school.meta': result_meta,
                            'score.yearScore_wenke_content': result_score_wenke,
                            'score.yearScore_like_content': result_score_like,
                            'score.yearScore.content': result_score_wenke,
                            'score.majorScore.content': that.data.score.major_content['wenli_1']['year_2019'],
                        })
                    }
                },
            })

        },


        change_score_wenli: function (e) {
            // let tmp = this.score.yearScore.content
            this.setData({
                'score.wenli_selected': { ...e.detail },
            })
            if (this.data.score.wenli_selected.id == '1') {
                this.setData({
                    'score.yearScore.content': this.data.score.yearScore_wenke_content
                })
            }
            else {
                this.setData({
                    'score.yearScore.content': this.data.score.yearScore_like_content
                })
            }
        },

        change_major_year: function (e) {
            this.setData({
                'score.year_major_selected': { ...e.detail },
            })
            let wenli_select = 'wenli_' + this.data.score.wenli_major_selected.id
            let year_select = 'year_' + this.data.score.year_major_selected.id
            this.setData({
                'score.majorScore.content': this.data.score.major_content[wenli_select][year_select]
            })
        },

        change_major_wenli: function (e) {
            this.setData({
                'score.wenli_major_selected': { ...e.detail },
            })
            let wenli_select = 'wenli_' + this.data.score.wenli_major_selected.id
            let year_select = 'year_' + this.data.score.year_major_selected.id
            console.log(this.data.score.majorScore)
            console.log(wenli_select)
            console.log(year_select)
            this.setData({
                'score.majorScore.content': this.data.score.major_content[wenli_select][year_select]
            })

        },

        close() {
            // 关闭select
            this.selectComponent('#select').close()
        },

        swiperchange: function (e) {
            let that = this
            that.setData({
                'currentTab': e.detail.current
            })
        },

        bindChange: function (e) {
            let that = this;
            that.setData({ currentTab: e.detail.current });
        },
        swichNav: function (e) {

            let that = this;

            if (this.data.currentTab === e.target.dataset.current) {
                return false;
            } else {
                that.setData({
                    currentTab: e.target.dataset.current
                })
            }
        },

        /* =======加减页面操作========*/
        /* 点击减号 */
        bindMinus: function () {
            var page = this.data.page;
            // 如果大于1时，才可以减  
            if (page > 1) {
                page--;
            }
            // 只有大于0的时候，才能normal状态，否则disable状态  
            var minusStatus = page <= 1 ? 'disabled' : 'normal';
            // 将数值与状态写回  
            this.setData({
                page: page,
                minusStatus: minusStatus
            });
        },
        /* 点击加号 */
        bindPlus: function () {
            var page = this.data.page;
            // 不作过多考虑自增1  
            page++;
            // 只有大于一件的时候，才能normal状态，否则disable状态  
            var minusStatus = page < 1 ? 'disabled' : 'normal';
            // 将数值与状态写回  
            this.setData({
                page: page,
                minusStatus: minusStatus
            });
        },
        /* 输入框事件 */
        bindManual: function (e) {
            var page = e.detail.value;
            // 将数值与状态写回  
            this.setData({
                page: page
            });
        },

        bindShowMsg() {
            this.setData({ select: !this.data.select })
        },
        mySelect(e) {
            var name = e.currentTarget.dataset.name
            this.setData({ tihuoWay: name, select: false })
        },


    },
)
// 获取详情页所有数据
function sch_detail_traitor(value, result, field, showname) {
    if (value[field] !== '') {
        let tmp_key = {
            name: 'h3',
            attrs: {
                class: 'p_class'
            },
            children: [{
                type: 'text',
                text: showname
            }]
        }
        result = result.concat(tmp_key)

        let tmp_value = {
            name: 'p',
            attrs: {
                class: 'h3_class',
            },
            children: [{
                type: 'text',
                text: value[field]
            }]
        }
        result = result.concat(tmp_value)
    }
    return result
}

function sch_intro_traitor(value, result, field, showname) {
    if (value[field] !== '') {
        let tags = ''
        if (field === 'sch_tags') {
            tags = value[field].replace(/[']+/g, "")
            tags = tags.replace("[", "")
            tags = tags.replace("]", "")
        } else {
            tags = value[field]
        }
        let tmp_value = {
            name: 'p',
            attrs: {
                class: 'h3_class',
            },
            children: [{
                type: 'text',
                text: showname + ' : ' + tags
            }]
        }
        result = result.concat(tmp_value)
    }
    return result
}

function sch_rank_traitor(value, result) {
    if (value !== '') {
        if (value['rank_year'] === 2019) {
            let tmp_value = {
                name: 'p',
                attrs: {
                    class: 'h3_class',
                },
                children: [{
                    type: 'text',
                    text: value['rank_type_desc'] + ' : ' + '国内第' + value['rank_idx'] + '名'
                }]
            }
            result = result.concat(tmp_value)
        }
    }
    return result
}

function sch_people_traitor(value, result) {
    if (value !== '') {
        let tmp_value = {
            name: 'p',
            attrs: {
                class: 'h3_class',
            },
            children: [{
                type: 'text',
                text: value['celebrity_name'] + ' ，' + value['celebrity_desc']
            }]
        }
        result = result.concat(tmp_value)
    }
    return result
}

function sch_score_traitor(value, result, wenli) {

    function legal_int_verify(num, min_num = -1000000, max_num = 1000000) {
        try {
            if (parseInt(num) > min_num && parseInt(num) < max_num) {
                return num
            }
            else {
                return '-'
            }
        } catch (error) {
            return '-'
        }
    }

    function formant_score(score, rank, prefix) {
        let result_format = ''
        result_format = result_format + legal_int_verify(score, 0, 1000) + '/'
        result_format = result_format + legal_int_verify(rank, 0, 50000000)
        return prefix + result_format
    }

    if (value['wenli'] === wenli) {

        let min_score_format = formant_score(value['min_score'], value['min_score_rank'], '最低:')
        let avg_score_format = formant_score(value['avg_score'], value['avg_score_rank'], '平均:')
        let max_score_format = formant_score(value['max_score'], value['max_score_rank'], '最高:')

        let score_format = min_score_format + '\n' + avg_score_format + '\n' + max_score_format
        let admission_format = legal_int_verify(value['admission_count'], 0, 1000000)
        let diff_format = legal_int_verify(value['min_score_diff'], 0, 1000)

        let tmp_result = {
            year: value['academic_year'],
            diploma: value['batch_name'],
            score_rank: score_format,
            admission: admission_format,
            diff: diff_format
        }
        result = result.concat(tmp_result)
    }

    return result
}


function sch_major_traitor(value, result) {

    function legal_int_verify(num, min_num = -1000000, max_num = 1000000) {
        try {
            if (parseInt(num) > min_num && parseInt(num) < max_num) {
                return num
            }
            else {
                return '-'
            }
        } catch (error) {
            return '-'
        }
    }

    function formant_score(score, rank, prefix) {
        let result_format = ''
        result_format = result_format + legal_int_verify(score, 0, 1000) + '/'
        result_format = result_format + legal_int_verify(rank, 0, 50000000)
        return prefix + result_format
    }


    let min_score_format = formant_score(value['min_score'], value['min_score_rank'], '最低:')
    let avg_score_format = formant_score(value['avg_score'], value['avg_score_rank'], '平均:')
    let max_score_format = formant_score(value['max_score'], value['max_score_rank'], '最高:')
    let score_format = min_score_format + '\n' + avg_score_format + '\n' + max_score_format
    let admission_format = legal_int_verify(value['admission_count'], 0, 1000000)
    let diff_format = legal_int_verify(value['min_score_diff'], 0, 1000)
    let tmp_result = {
        year: value['enroll_major_name'],
        diploma: value['batch_name'],
        score_rank: score_format,
        admission: admission_format,
        diff: diff_format
    }
    result = result.concat(tmp_result)

    return result
}