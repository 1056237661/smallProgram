// 0 开发环境 1 测试环境 2 生产环境
const env = 0

let host = ''
if (env === 0) {
  host = 'https://miaohudong.com'
  // host = 'http://39.105.107.81:443'
  // host = 'http://apiapiopen.top'
} else if (env == 1) {
  host = 'https://xiaoyounger.com'
} else {
  host = 'https://yiiiblog.com'
}

module.exports = {
  host: host,
  url: host,
  login: '/api/login',
  check_openid: '/mydb/User_login',    // 获取openid
  env: env, 
  mapKey: '',
  appid: 'wx2e3556204fecd790'      //
}