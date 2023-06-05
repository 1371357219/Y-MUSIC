// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    login_model: 2,//模式1是手机密码登录；模式2是二维码登录
    qrimg: "",//登录二维码
    show_qrimg: true,
    tips_text: '',//二维码失败反馈
    userImformation: {}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    wx.setStorageSync("userImformation","")
    this.loginSubmit()
  },
  bindInput(event) {
    let type = event.currentTarget.id


    this.setData({
      [type]: event.detail.value
    })
  },
  async loginSubmit() {
    
    if (this.data.login_model === 1) {

      const { phone, password } = this.data
      console.log(phone, password)
      if (!phone) {
        wx.showToast({
          title: "手机号为空",
          icon: "none"
        })
        return;
      }
      let phoneReg = /^1[34578]\d{9}$/;
      if (!phoneReg.test(phone)) {
        wx.showToast({
          title: "手机号格式错误",
          icon: "none"
        })
        return
      }
      if (!password) {
        wx.showToast({
          title: "密码不能为空",
          icon: "none"
        })
        return
      }

      wx.showToast({
        title: "前端通过",

      })
    }

    if (this.data.login_model === 2) {
      // 初始化
      this.setData({
        userImformation: {},
        show_qrimg: true,
        tips_text: ""
      })
      // 二维码登录
      // 二维码 key 生成接口
      let key = await request('/login/qr/key', { timestamp: Date.now() })
      const unikey = key.data.unikey;
      console.log(unikey)
      // 生成二维码
      let qrcode = await request('/login/qr/create', { key: unikey, qrimg: true, timestamp: Date.now() })
      console.log(qrcode)
      this.setData({
        qrimg: qrcode.data.qrimg
      })
      // 二维码检测扫码状态接口
      this.qrtimer = setInterval(async () => {
        const statusRes = await request('/login/qr/check', { key: unikey,isLogin:true, timestamp: Date.now() })
        if (statusRes.code === 800) {
          wx.showToast({
            title: "二维码已过期,请重新获取",
            icon: "none"
          })

          this.setData({
            show_qrimg: false,
            tips_text: "二维码已过期,请重新获取"
          })
          clearInterval(this.qrtimer)
        }
        if (statusRes.code === 803) {
          // 这一步会返回cookie
          clearInterval(this.qrtimer)
          wx.showToast({
            title: "登录成功",

          })
          console.log('----login------',statusRes)
          const cookie=statusRes.cookie?statusRes.cookie:''
          const res=await request('/login/status',{cookie:cookie},"post")
          this.setData({
            userImformation: res.data.profile,
            show_qrimg: false,
            tips_text: "登录成功"
          })
          console.log('----loginstatus------',res)
         
          wx.setStorage({
            key:"userImformation",
            data:JSON.stringify(res.data.profile)
            
          })

         
          
          // 跳转到个人中心界面
          wx.reLaunch({
            url: "/pages/personal/personal"
          })
          
        }

      }, 3000)
    }


  },
  // 切换登录方式
  changeLogin() {
    this.setData({
      login_model: this.data.login_model === 1 ? 2 : 1
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.qrtimer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.qrtimer)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})