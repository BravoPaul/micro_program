const app = getApp()
Page(
    {
        data: {
            sch_info: {},
            sch_score: {},
            currentCur: 'info',
            info_container_hidden: false,
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

            console.log('正在获取sch_id', sch_id)

            wx.request({
                url: app.globalData.localhost_url + '/gaokao/detail',
                method: 'POST',
                data: {
                    'sch_id': sch_id,
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    console.log(res.data)
                    if (res.statusCode == 200) { //服务端处理正常，登录成功
                        let that = this
                        let result_tmp = {}
                        result_tmp['sch_meta'] = {}
                        result_tmp['sch_intro'] = {}
                        result_tmp['sch_contact'] = {}
                        result_tmp['sch_rank'] = []
                        result_tmp['sch_famous'] = []
                        result_tmp['sch_scholarship'] = {}
                        result_tmp['famous_people'] = []
                        let result_score_wenke = []
                        let result_score_like = []
                        res.data.forEach(function (value) {
                            if (value.model === 'gaokao.schooldetail') {
                                result_tmp['sch_intro']['content_simple'] = value['fields']['sch_intro'].slice(0, 100) + '...'
                                result_tmp['sch_intro']['content_full'] = value['fields']['sch_intro']
                                result_tmp['sch_intro']['useFullNow'] = false

                                // 联系方式
                                result_tmp['sch_contact']['tel'] = value['fields']['sch_tel_num']
                                result_tmp['sch_contact']['net'] = value['fields']['sch_web_url']

                                //奖助学金
                                result_tmp['sch_scholarship']['content_simple'] = (value['fields']['sch_scholarship'] + value['fields']['sch_fellowship']).slice(0, 100) + '...'
                                result_tmp['sch_scholarship']['content_full'] = (value['fields']['sch_scholarship'] + value['fields']['sch_fellowship'])
                                result_tmp['sch_scholarship']['useFullNow'] = false

                            }
                            else if (value.model === 'gaokao.school') {
                                let result_rank_tmp = {}
                                result_rank_tmp['sch_logo'] = value['fields']['sch_logo']
                                result_rank_tmp['sch_name'] = value['fields']['sch_name']
                                result_rank_tmp['sch_tags_1'] = tag_traitor(value['fields']['sch_tags'])[0]
                                result_rank_tmp['sch_tags_2'] = tag_traitor(value['fields']['sch_tags'])[1].concat(value['fields']['province'])
                                result_tmp['meta'] = result_rank_tmp
                            }
                            else if (value.model === 'gaokao.schoolrank') {
                                let result_rank_tmp = {}
                                result_rank_tmp['name'] = value['fields']['rank_type_desc']
                                result_rank_tmp['num'] = value['fields']['rank_idx']
                                result_rank_tmp['year'] = value['fields']['rank_year']
                                result_tmp['sch_rank'] = result_tmp['sch_rank'].concat(result_rank_tmp)
                            }
                            else if (value.model === 'gaokao.schoolfamous') {
                                let people = value['fields']['celebrity_name'] + '：' + value['fields']['celebrity_desc']
                                result_tmp['famous_people'] = result_tmp['famous_people'].concat(people)
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
                        that.setData({
                            'sch_info.sch_intro': result_tmp['sch_intro'],
                            'sch_info.sch_rank': result_tmp['sch_rank'],
                            'sch_info.sch_contact': result_tmp['sch_contact'],
                            'sch_info.sch_scholarship': result_tmp['sch_scholarship'],
                            'sch_info.famous_people': result_tmp['famous_people'],
                            'sch_info.sch_meta': result_tmp['meta'],
                            'score.yearScore_wenke_content': result_score_wenke,
                            'score.yearScore_like_content': result_score_like,
                            'score.yearScore.content': result_score_wenke,
                            'score.majorScore.content': that.data.score.major_content['wenli_1']['year_2019'],

                        })
                        console.log(result_tmp['sch_rank'])
                    }
                },
            })

        },
        toggle(e) {
            console.log(e)
            let id = e.currentTarget.id
            if (id === 'sch_intro') {
                this.setData({
                    'sch_info.sch_intro.useFullNow': !this.data.sch_info['sch_intro'].useFullNow
                })
            }

            if (id === 'sch_scholarship') {
                this.setData({
                    'sch_info.sch_scholarship.useFullNow': !this.data.sch_info['sch_scholarship'].useFullNow
                })
            }


            console.log(this.data.sch_info['sch_intro'].useFullNow)

        },
        tabSelect(e) {
            console.log(e)
            let info_container_hidden = true
            if (e.currentTarget.id == 'info') {
                info_container_hidden = false
            }
            else {
                info_container_hidden = true
            }
            this.setData({
                'currentCur': e.currentTarget.id,
                'info_container_hidden': info_container_hidden
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
    return [result_tag_1, result_tag_2]
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
