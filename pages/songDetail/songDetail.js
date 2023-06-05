// pages/songDetail/songDetail.
import PubSub from 'pubsub-js'
import moment from 'moment';
import request from '../../utils/request'
const appInstance = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicId:'',
    song: {},
    musicLinkUrl:"",
    currentTime:'00:00',
    endTime:'00:00',
    currentWidth:"0"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.songId) {
      this.setData({
        isPlay: true
      })
    }
    this.setData({
      musicId:options.songId
    })
    // console.log('当前歌曲id',options.songId)
    this.getSongDetail(options.songId)

    this.BackgroundAudioManager = wx.getBackgroundAudioManager()

    this.BackgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      appInstance.globalData.isMusicPlay = true
      appInstance.globalData.musicId = options.songId
    })
    this.BackgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
      appInstance.globalData.musicId = options.songId
    })
    this.BackgroundAudioManager.onStop(() => {
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay = false
      appInstance.globalData.musicId = options.songId
    })
    this.BackgroundAudioManager.onEnded(() => {
      this.handleChangeSong("next")
    })
    this.BackgroundAudioManager.onTimeUpdate(()=>{
      // console.log("音频的长度",this.BackgroundAudioManager.duration)
      // console.log("播放位置",this.BackgroundAudioManager.currentTime)
      let currentTime=moment(this.BackgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth=Math.floor(this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration*450)
      this.setData({
        currentTime,
        currentWidth
      })
    })

  },
  // 根据id获取歌曲详情
  async getSongDetail(id) {
    let detail = await request('/song/detail', { ids: id })
    console.log('shuju', detail)
    this.setData({
      song: detail.songs[0],
      endTime:moment(detail.songs[0].dt).format('mm:ss')

    })
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },
  // 点击暂停/播放的回调
  handlePlay() {

    let { isPlay } = this.data
    isPlay = !isPlay;
    this.setData({
      isPlay
    })

    this.musicControl(isPlay,this.data.musicId,this.data.musicLinkUrl)
  },
  // 控制音乐播放暂停的功能函数
  async musicControl(isPlay,musicId,musicLinkUrl) {

    if (isPlay) {
      if(!musicLinkUrl){
        let musicLinkData = await request("/song/url", { id: musicId })
        musicLinkUrl=musicLinkData.data[0].url
        this.setData({
          musicLinkUrl
        })
      }
      

      this.BackgroundAudioManager.src = musicLinkUrl
      this.BackgroundAudioManager.title = this.data.song.name
    } else {
      this.BackgroundAudioManager.pause()
    }
  },
  // 切换上一首/下一首事件函数
  ChangeSong(event) {
    const type = event.currentTarget.id
    this.handleChangeSong(type)
    
  },
  handleChangeSong(type){
    // 订阅消息
    PubSub.subscribe('MusicId', (msg,musicId)=>{
      console.log(msg,musicId)
      this.setData({
        musicId
      })
      this.BackgroundAudioManager.stop()
      this.getSongDetail(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe('MusicId')
    });
    // 发布消息
    PubSub.publish('SwitchType', type);
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