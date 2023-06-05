// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    songsList: [],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.getRecommendSongs()
    // 订阅事件
    let that=this
    var mySubscriber = function (msg, type) {
      let {index,songsList} =that.data
      if(type==="pre"){
        if(index===0){
          index=songsList.length-1
        }else{
          index-=1
        }
        
      }else{
        if(index===songsList.length-1){
          index=0
        }else{
          index+=1
        }
        
      }
      that.setData({
        index
      })
      let musicId=songsList[index].id
      PubSub.publish('MusicId', musicId);
      
    };
    PubSub.subscribe('SwitchType', mySubscriber);

  },

  toSongDetail(event) {
    let {index,song} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?songId=' + song
    })
  },
  async getRecommendSongs() {
    let songsList = await request('/recommend/songs')
    // console.log(result.data.dailySongs)
    this.setData({
      songsList: songsList.data.dailySongs
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