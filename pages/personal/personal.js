import request from "../../utils/request"

// pages/personal/personal.js
let startY=0;//手指起始坐标
let moveY=0;//手指移动坐标
let moveDistance=0;//手指移动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    userImformation:{},
    recentPlayListData:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const userImformation=wx.getStorageSync('userImformation')
    this.setData({
      userImformation:JSON.parse(userImformation),
     
    })
    
    this.getUserRecentPlayList(JSON.parse(userImformation).userId)
  },
  async getUserRecentPlayList(uid){
    let recentPlayListData=await request('/user/record',{uid:uid,type:0})
    this.setData({
      recentPlayListData:recentPlayListData.allData.slice(0,14)
    })
    // console.log('最近听歌列表',recentPlayListData)
  },
  toLogin(){
    // 跳转到登录界面
    wx.navigateTo({
      url:"/pages/login/login"
    })
  },
  handleTouchStart(event){
    startY=event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY=event.touches[0].clientY;
    moveDistance=moveY-startY
    if(moveDistance<=0){
      return
    }
    if(moveDistance>=80){
      moveDistance=80
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(event){
    this.setData({
      coverTransform:`translateY(0rpx)`
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
    if(!wx.getStorageSync('userImformation')){
      this.setData({
        userImformation:''
      })
    }
    // console.log('show',JSON.parse(userImformation))

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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