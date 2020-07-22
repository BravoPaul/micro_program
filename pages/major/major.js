const app = getApp()
Page({
    data: {
        haha:false,
        major_list: [
            {
                code: '01',
                name: '哲学',
                hidden: false,
                major_2: [
                    {
                        code: '02',
                        name: '哲学类',
                        hidden: false,
                        major_3: [
                            {
                                code: '03',
                                name: '本我'
                            },
                            {
                                code: '03',
                                name: '超我'
                            },
                            {
                                code: '03',
                                name: '自我'
                            },
                            {
                                code: '03',
                                name: '无我'
                            }

                        ]
                    },
                    {
                        code: '02',
                        name: '心理学类',
                        hidden: false,
                        major_3: [
                            {
                                code: '03',
                                name: '认知心理学'
                            },
                            {
                                code: '03',
                                name: '行为心理学'
                            },
                            {
                                code: '03',
                                name: '怪诞学'
                            },
                        ]
                    }
                ]
            },
            {
                code: '01',
                name: '哲学',
                hidden: false,
                major_2: [
                    {
                        code: '02',
                        name: '哲学类',
                        hidden: false,
                        major_3: [
                            {
                                code: '03',
                                name: '本我'
                            },
                            {
                                code: '03',
                                name: '超我'
                            },
                            {
                                code: '03',
                                name: '自我'
                            },
                            {
                                code: '03',
                                name: '无我'
                            }

                        ]
                    },
                    {
                        code: '02',
                        name: '心理学类',
                        hidden: false,
                        major_3: [
                            {
                                code: '03',
                                name: '认知心理学'
                            },
                            {
                                code: '03',
                                name: '行为心理学'
                            },
                            {
                                code: '03',
                                name: '怪诞学'
                            },
                        ]
                    }
                ]
            }
        ]
    },

    showMoreMajor(e) {
        
        let index_s = parseInt(e.currentTarget.id.split('_')[0])
        let index_c = parseInt(e.currentTarget.id.split('_')[1])
        if (index_c == -1) {
            let result_1 = this.data.major_list[index_s]
            console.log(result_1)
            result_1.hidden = !result_1.hidden
            this.setData({
                ['major_list[' + index_s + '].hidden']: true
            })
        }
        
        else {
            let result_1 = this.data.major_list[index_s].major_2[index_c]
            result_1.hidden = !result_1.hidden
            this.setData({
                ['major_list[' + index_s + '].major_2[' + index_c + ']']: result_1
            })
        }
    },


})