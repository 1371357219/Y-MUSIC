// 发送ajax请求
import config from './config.js'

export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.host+url,
            data,
            method,
            header: {
                'cookie': wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find((item)=>item.indexOf('MUSIC_U')!=-1):"" // 默认值
            },
            success:(res)=>{
                
                if(data.isLogin){
                    //console.log('登录成功',res)
                    wx.setStorage({
                        key:'cookies',
                        data:res.cookies
                    })

                }
                // console.log('请求成功:',res)
                resolve(res.data)
                
            },
            fail:(err)=>{
                // console.log('请求失败:',err)
                reject(err)
                
                
            },
        })
    })
    
}