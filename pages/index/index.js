// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {

    this.getBannerList()
    this.getRecommendListData() 
    this.getTopListData()
  },
  // 获得banner图数据
  async getBannerList(){
    let bannerListData=await request('/banner',{type:2});
    this.setData({
      bannerList:bannerListData.banners
    })
  },
  // 获得推荐歌单数据
  async getRecommendListData(){
    let recommendListData=await request('/personalized',{limit:10})
    this.setData({
      recommendList:recommendListData.result
    })
  },
  // 获得排行榜数据
  async getTopListData(){
    // 排行榜数据
    let topListResult=[]
    let topListData=await request('/toplist')
    for(let i=0;i<5;i++){
      let topListDataDetail=await request('/playlist/detail',{id:topListData['list'][i].id})
      let topListItem={name:topListDataDetail.playlist.name,tracks:topListDataDetail.playlist.tracks.slice(0,3)}
      topListResult.push(topListItem)
      this.setData({
        topList:topListResult
      })

    }
  },
  handleToRecommend(){
    const userImformation=wx.getStorageSync('userImformation')
    if(userImformation){
      wx.navigateTo({
        url:"/pages/recommendSong/recommendSong"
      })
    }
    
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