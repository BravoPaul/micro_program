Page({
    data: {
      showTotal1: false,
      showTotal2: false,
      showTotal3: false,
    },
    onLoad: function() {
  
      wx.getSystemInfo({
        success: res => {
          console.log(res)
          //获取屏幕宽度
          this.data.screenWidth = res.screenWidth
        },
      })
  
      this.setData({
        text1: '我不是懒，我是享受不作为',
        text2: '微信小程序展开全文，解决方案，实现这个功能并不难，难的是开始没思路，。。。。。。怎么就凑不齐刚刚好两行半呢。。。',
        text3: `雅各布一个35岁的欧洲生产经理，每天为了解决各种问题从工厂的这一头跑到另一头，仅仅是为了保证生产能正常进行。雅各布清楚的知道如果想成为一名优秀的领导者，他必须为自己留有空余时间思考。为部门的战略布局所出谋划策，扩大业务。但每天的繁杂琐事让他无从顾忌。
  
  那么雅各布应该如何增强企业内部各部门之间的合作呢？
  
  如何预测这瞬息万变的市场呢？
  
  那他的解决方法是什么呢？
  
  也许像雅各布一样，你也正处于一个混乱期，有太多的事情要处理，而没有足够的时间去反思业务的变化情况以及去思考如何成为一名优秀的领导者。很多需要紧急处理的事情限制着你，让你没有办法去做那些更重要的事。但是在努力学会做好一个领导者的问题上，你面临着一个更大的挑战：那就是只有先行动起来，你才能知道关于自己，关于工作你需要做些什么，而不仅仅是思考。
  
  作者：沐轻舟
  链接：https://www.jianshu.com/p/6d51bade33b9
  來源：简书
  简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。`,
      }, () => {
        let query1 = wx.createSelectorQuery()
        query1.select(".des-short1").boundingClientRect(data => {
          //获取屏幕宽度
          let height = data.height * 750 / this.data.screenWidth
          console.log(height)
          
          this.setData({
            lineNum1: 3,
            showTotalBtn1: height > 130 ? true : false 
          })
          
        }).exec()
  
        let query2 = wx.createSelectorQuery()
        query2.select(".des-short2").boundingClientRect(data => {
          //获取屏幕宽度
          let height = data.height * 750 / this.data.screenWidth
          console.log(height)
  
          this.setData({
            lineNum2: 3,
            showTotalBtn2: height > 130 ? true : false
          })
        }).exec()
  
        let query3 = wx.createSelectorQuery()
        query3.select(".des-short3").boundingClientRect(data => {
          //获取屏幕宽度
          let height = data.height * 750 / this.data.screenWidth
          console.log(height)
  
          this.setData({
            lineNum3: 3,
            showTotalBtn3: height > 130 ? true : false
          })
        }).exec()
      })
    },
  
    showAll: function() {
      this.setData({
        showTotal3: true,
        showTotalBtn3: false
      })
    },
  })