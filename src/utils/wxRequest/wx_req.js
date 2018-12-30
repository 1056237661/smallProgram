
import Host from '@/utils/host'
import Session from '@/utils/session'

const loginKey = Session.key.login

export default class wx_req{

  // 登录
  static login(){
    return new Promise((resolve, reject)=>{
      wx.login({
        success(res){
          if(res.code){ resolve(res) }
          else{ reject(res) }
        }
      })
    })
  }

  // 获取授权信息
  static getSetting(){
    return new Promise((resolve, reject)=>{
      wx.getSetting({
        success(res){
          resolve(res)
        }
      })
    })
  }

  // 获取用户信息
  static async getUserInfo(){
    return new Promise((resolve, reject)=>{
      wx.getUserInfo({
        success(res){ 
          resolve(res)
        }
      })
    })

    // 判断是否已经授权 
    // const wx_setting = await this.getSetting();
    // if (!wx_setting.authSetting['scope.userInfo']){
    //   wx.navigateTo({ url: '/pages/authorize/index' })
    //   return false;
    // }
  }

  // 请求
  static request(url, method, header_data, params){
    return new Promise((resolve, reject)=>{
      wx.request({
        url: `${Host.url}${url}`,
        method: method,
        data: params,
        header: header_data,
        success:function(res){
          resolve(res)
        },
        fail(res){
          reject(res)
        }
      })
    })
  }

  // 获取 session_id
  static getSession_id() {
    return Session.get(loginKey) || null ; 
  }

}