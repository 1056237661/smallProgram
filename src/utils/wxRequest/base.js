import wepy from 'wepy'
import Host from '@/utils/host'
import Tip from '@/utils/tip'
import Session from '@/utils/session'
import wx_req from '@/utils/wxRequest/wx_req'

// 登录重试次数
let retryCount = 0

// 登录凭证键值
const loginKey = Session.key.login
let getAuthPromise = null

// 刷新登录状态（ 用户已经授权 ）
const reLogin = async () => {

  // 防止并发请求 openid
  if (getAuthPromise) { return getAuthPromise }

  return getAuthPromise = new Promise(async (resolve, reject) => {

    const wxLogin = await wx_req.login();

    const userInfo = await wx_req.getUserInfo();  //获取用户信息

    const params = {
      code: wxLogin.code,
      name: userInfo.userInfo.nickName,
      imgurl: userInfo.userInfo.avatarUrl,
      sex: userInfo.userInfo.gender
    }

    const data = await wx_req.request( Host.check_openid, 'get', {}, params);

    if(data.data.code == 'G_0000'){
      Session.set(loginKey, data.data.result)
      setTimeout(() => { getAuthPromise = null }, 30000);
      resolve(data.data.result)
    }else{
      Tip.error('登录失败')
    }
  })
}

const doRequest = async (url, method, params, options = {}) => {
  let result = {}   //返回值
  let session = wx_req.getSession_id();

  let request_data = {};
  session && (request_data = {'session_id':session})
  result = await wx_req.request(url, method, request_data, params);

  // G_0000成功，G_0001是session没传，G_0002是session过期，G_0003是代码错误
  if(result.data.code === "G_0000"){
    result = result.data.result
    return result
  }else if((result.data.code === "G_0002" || result.data.code === "G_0001") && result.statusCode == 200 && retryCount <= 5 ) {
    // 过期尝试重连
    Session.clear(loginKey);
    await reLogin();
    retryCount += 1
    return doRequest(url, method, params)
  }else{
    Tip.error(result.data.code+'')
    console.log(result.data.code)
  }
}

// 上传文件
const wxUpload = async (url, params = {}) => {
  if (params.file_path == undefined) {
    console.log('无效的文件')
    return false
  }
  const uploadResult = await wepy.uploadFile({
    url: url,
    header: { 'Content-Type': 'application/json', 'X-WX-Skey': await getSession_id() },
    filePath: params.file_path,
    formData: params.query,
    name: 'file'
  })
  return uploadResult
}

export default {
  doRequest,
  wxUpload,
  reLogin
}
