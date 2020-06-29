Page(
    {
        data: {
            school: {
                id: 1,
                title: '测试文章标题',
                author: '红领巾雷锋',
                post_date: '2019-01-10',
                meta: [],
                detail: [],
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
            info: ''
        },
        onLoad: function (options) {
            var sch_id = JSON.parse(options.sch_id);
            console.log(sch_id)

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
                    var tags = ''
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


            wx.request({
                url: 'http://192.168.1.7:8080/gaokao/detail',
                method: 'POST',
                data: {
                    'sch_id': sch_id,
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                success: res => {
                    let that = this
                    let result_detail = []
                    let result_meta = []
                    let title = ''
                    let result_rank = this.data.school.rank
                    let result_people = this.data.school.people
                    if (res.statusCode == 200) { //服务端处理正常，登录成功
                        let result_list = res.data
                        result_list.forEach(function (value) {
                            if (value.model === 'gaokao.schooldetail') {
                                let value_field = value.fields
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_intro', '学校介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_scholarship', '奖学金介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'sch_fellowship', '助学金介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'canteen_desc', '食堂介绍')
                                result_detail = sch_detail_traitor(value_field, result_detail, 'stu_dorm_desc', '住宿介绍')
                            }
                            if (value.model === 'gaokao.school') {
                                let value_field = value.fields
                                title = value_field['sch_name']
                                let logo = {
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
                                }
                                result_meta = result_meta.concat(logo)
                                result_meta = sch_intro_traitor(value_field, result_meta, 'sch_english_name', '英文名')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'location', '地点')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'sch_create_time', '成立时间')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'sch_competent_desc', '直属机构')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'diploma_desc', '招生类型')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'sch_run_type_desc', '学校属性')
                                result_meta = sch_intro_traitor(value_field, result_meta, 'sch_tags', '学校标签')
                            }
                            if (value.model === 'gaokao.schoolrank') {
                                let value_field = value.fields
                                result_rank = sch_rank_traitor(value_field, result_rank)
                            }
                            if (value.model === 'gaokao.schoolfamous') {
                                let value_field = value.fields
                                result_people = sch_people_traitor(value_field, result_people)
                            }
                        });
                        that.setData({
                            'school.detail': that.data.school.detail.concat(result_detail),
                            'school.meta': that.data.school.meta.concat(result_meta),
                            'school.title': title,
                            'school.rank': that.data.school.meta.concat(result_rank),
                            'school.people': that.data.school.meta.concat(result_people),
                        })
                    }
                    console.log(res.data)
                },
            })
        },
    },
)
;