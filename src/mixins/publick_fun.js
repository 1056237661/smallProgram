
import wepy from 'wepy'

import wxRequest from '@/utils/wxRequest'
import wx_req from '@/utils/wxRequest/wx_req'

import Host from '@/utils/host'
import Session from '@/utils/session'
import tip from '@/utils/tip'

export default class TestMixin extends wepy.mixin {
  data = {
    mixin: 'This is mixin data.'
  }

  // 点赞
  async fun_praise(mu_id, mu_status){
    wxRequest.Get("/mydb/likestatus", { 
      mu_id: mu_id,
      mu_status: mu_status?true:false
    })
  }

  // 获取未读消息数目
  async Get_MessageCount() {
    // 判断有无session 有->请求 无——>直接返回0
    let session_id = wx_req.getSession_id();
    let text = '';
    if ( session_id !== null) {
      let data = await wxRequest.Post( '/mydb/Get_MessageCount', {'session_id':session_id});
      data > 0 && ( text = data > 99 ? '99+' : data )
    }
    let api = text ? 'setTabBarBadge' : 'removeTabBarBadge';
    wx[api]({ index: 0, text: text+'' })
  }


  onShow() {
    console.log('fun mixin onShow')
  }

  onLoad() {
    console.log('fun mixin onLoad')
  }
}
