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
            info: ''
        },
        onLoad: function (options) {

            var sch_id = JSON.parse(options.sch_id);
            this.data.sch_id = sch_id

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
                    let result_intro = []
                    let result_meta = {}
                    let result_rank = this.data.school.rank
                    let result_people = this.data.school.people
                    let result_meta_detail = []
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
                                result_meta_detail = sch_intro_traitor(value_field, result_meta_detail, 'sch_tel_num', '电话')
                                result_meta_detail = sch_intro_traitor(value_field, result_meta_detail, 'sch_web_url', '地址')
                            }
                            if (value.model === 'gaokao.school') {
                                let value_field = value.fields
                                let title = value_field['sch_name']
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
                            if (value.model === 'gaokao.schoolrank') {
                                let value_field = value.fields
                                result_rank = sch_rank_traitor(value_field, result_rank)
                            }
                            if (value.model === 'gaokao.schoolfamous') {
                                let value_field = value.fields
                                result_people = sch_people_traitor(value_field, result_people)
                            }
                        });
                        result_intro = result_intro.concat(result_meta_detail)
                        console.log(result_meta)
                        that.setData({
                            'school.detail': that.data.school.detail.concat(result_detail),
                            'school.intro': that.data.school.intro.concat(result_intro),
                            'school.rank': result_rank,
                            'school.people': result_people,
                            'school.meta': result_meta
                        })
                    }
                },
            })

            // 计算详情页高度

            let that = this
            wx.getSystemInfo({
                success: function (res) {
                    that.setData({
                        clientHeight: res.windowHeight
                    });
                }
            })

        },

        swiperchange: function (e) {
            let that = this
            console.log(e.detail.current)
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

    },
)
    ;