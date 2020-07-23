//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    localhost_url: "http://30.77.54.14:8080",
    province: [
      { key: '11', value: '北京市' },
      { key: '43', value: '湖南省' },
      { key: '12', value: '天津市' },
      { key: '44', value: '广东省' },
      { key: '13', value: '河北省' },
      { key: '45', value: '广西壮族自治区' },
      { key: '14', value: '山西省' },
      { key: '46', value: '海南省' },
      { key: '15', value: '内蒙古自治区' },
      { key: '50', value: '重庆市' },
      { key: '21', value: '辽宁省' },
      { key: '51', value: '四川省' },
      { key: '22', value: '吉林省' },
      { key: '52', value: '贵州省' },
      { key: '23', value: '黑龙江省' },
      { key: '53', value: '云南省' },
      { key: '31', value: '上海市' },
      { key: '54', value: '西藏自治区' },
      { key: '32', value: '江苏省' },
      { key: '61', value: '陕西省' },
      { key: '33', value: '浙江省' },
      { key: '62', value: '甘肃省' },
      { key: '34', value: '安徽省' },
      { key: '63', value: '青海省' },
      { key: '35', value: '福建省' },
      { key: '64', value: '宁夏回族自治区' },
      { key: '36', value: '江西省' },
      { key: '65', value: '新疆维吾尔自治区' },
      { key: '37', value: '山东省' },
      { key: '71', value: '台湾省' },
      { key: '41', value: '河南省' },
      { key: '81', value: '香港特别行政区' },
      { key: '42', value: '湖北省' },
      { key: '82', value: '澳门特别行政区' },
    ]
  }
})