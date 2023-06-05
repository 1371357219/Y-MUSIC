// pages/search/search.js
import request from '../../utils/request'
let sendSearch = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '',
    searchHotLists: [],
    isSearch: false,
    searchContent: '',
    searchList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchHot()
    this.getPlaceholdeDefault()
    if (wx.getStorageSync('historyList')) {
      this.setData({
        historyList: wx.getStorageSync('historyList')
      })
    }

  },
  // 输入内容删除时间
  clearInput() {
    this.setData({
      searchContent: '',
      isSearch: false
    })

  },

  delHistory() {
    let that =this
    wx.showModal({
      title: '提示',
      content: '确定要删除嘛',
      success (res) {
        if (res.confirm) {
          
          that.setData({
            historyList: []
          })
          wx.setStorageSync('historyList',[])
          wx.showToast({
            title: '删除成功',
            icon: 'success',
          })
        } else if (res.cancel) {
          
        }
      }
    })
    
  },
  // input输入事件
  handleSearch(event) {
    let value = event.detail.value
    this.setData({
      searchContent: value
    })
    if (this.data.searchContent) {
      this.setData({
        isSearch: true
      })
    } else {
      this.setData({
        isSearch: false
      })
    }



    if (sendSearch !== null) {
      clearTimeout(sendSearch)
    }
    sendSearch = setTimeout(() => {
      this.getSearchData()
    }, 300);

  },
  async getSearchData() {

    let { historyList } = this.data
    let searchList = await request('/search', { keywords: this.data.searchContent.trim(), limit: 10 })
    if (searchList.result) {
      this.setData({
        searchList: searchList.result.songs
      })
      // 搜索记录
      if(historyList.indexOf(this.data.searchContent)!==-1){
        historyList.splice(historyList.indexOf(this.data.searchContent),1)
        historyList.unshift(this.data.searchContent)
      }else{
        historyList.unshift(this.data.searchContent)
      }
      
      wx.setStorageSync('historyList', historyList)
      this.setData({
        historyList: wx.getStorageSync('historyList')
      })
    } else {
      this.setData({
        searchList: []
      })
    }



  },
  // 获取默认搜索框文本
  async getPlaceholdeDefault() {
    let content = await request('/search/default')
    this.setData({
      placeholderContent: content.data.showKeyword
    })
    console.log('默认关键词', content)
  },
  // 得到热搜列表数据
  async getSearchHot() {
    let hotList = await request('/search/hot/detail')
    this.setData({
      searchHotLists: hotList.data.slice(0, 8)
    })

    console.log('searchHot!!!', hotList)
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