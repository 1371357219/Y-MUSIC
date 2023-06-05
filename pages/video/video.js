// pages/video/video.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroup: [],
    videoList: [],
    videoUrlList: [],
    currentId: "",
    videoId: "",
    videoUpdateTime: [],
    isplay: false,
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGroupList()

  },
  toSearch(){
    wx.navigateTo({
      url:'/pages/search/search'
    })
  },
  async getGroupList() {
    const list = await request("/video/group/list")
    this.setData({
      videoGroup: list.data.slice(0, 14)
    })
    let defaultId = this.data.videoGroup[0].id
    this.setData({
      currentId: defaultId
    })
    this.getVideoGroup(this.data.currentId)
    // console.log(this.data.videoGroup)
  },
  async getVideoGroup(id) {
    let urlList = []
    const list = await request("/video/group", { id: id })
    this.setData({
      videoList: list
    })

    list.datas.forEach(async (item) => {
      const videoUrl = await request("/video/url", { id: item.data.vid })
      urlList.push(videoUrl)
      this.setData({
        videoUrlList: urlList
      })
    })
    this.setData({
      isTriggered: false
    })
    wx.hideLoading()
    // console.log(urlList)
    //console.log("标签的视频列表-----",list)
  },
  async getVideoUrl(vid) {
    const videoUrl = await request("/video/url", { id: vid })

  },
  // 下拉被触发
  handleRefresh() {
    
    this.getVideoGroup(this.data.currentId)
    console.log('被刷新了')
  },
  // 点击视频播放
  videoPlay(event) {

    let vid = event.currentTarget.id;
    // this.vid!==vid&&this.videoContent&&this.videoContent.stop();
    // this.vid=vid;
    this.setData({
      videoId: vid,
      isplay: false
    })
    let { videoUpdateTime } = this.data;
    this.videoContent = wx.createVideoContext(vid);
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if (videoItem) {
      // console.log('跳转',videoItem.currentTime)
      this.videoContent.seek(videoItem.currentTime)
    }


    setTimeout(() => {
      this.videoContent.play()
      this.setData({
        isplay: true
      })
    }, 200)




  },
  // 监听播放进度事件
  handleTimeUpDate(event) {
    if (this.data.isplay) {
      let videoTimeObj = { vid: event.currentTarget.id, currentTime: event.detail.currentTime };
      let { videoUpdateTime } = this.data;

      let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
      if (videoItem) {
        videoItem.currentTime = event.detail.currentTime
      } else {
        videoUpdateTime.push(videoTimeObj)
      }

      this.setData({
        videoUpdateTime
      })
    }

  },
  // 点击导航事件
  changeNav(event) {
    let navId = event.currentTarget.dataset.navid
    this.setData({
      currentId: navId,
      videoList: [],
      videoUrlList: []
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getVideoGroup(this.data.currentId)
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