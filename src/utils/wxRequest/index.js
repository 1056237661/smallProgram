import Base from './base'
import Host from '@/utils/host'
const Get = async (url, params, options = {}) => await Base.doRequest(url, 'GET', params, options)
const Put = async (url, params, options = {}) => await Base.doRequest(url, 'PUT', params, options)
const Post = async (url, params, options = {}) => await Base.doRequest(url, 'POST', params, options)
const Destroy = async (url, params, options = {}) => await Base.doRequest(url, 'DELETE', params, options)
const Upload = async (url, params, options = {}) => await Base.wxUpload(url, params, options)
const reLogin = async () => await Base.reLogin()
export default {
  Get,
  Put,
  Post,
  Destroy,
  Upload,
  reLogin
}