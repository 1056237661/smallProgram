//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    voidUrl:'',
    fileId:"",
    imagePath:'',
    num:1,
    src:''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 录音
  startVoid(){
    let _this = this;
    wx.showToast({
      icon: 'none',
      title: '开始录音'
    })
    const recorderManager = wx.getRecorderManager();

    recorderManager.onStart(() => {
      debugger
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      debugger
      _this.data.voidUrl = res.tempFilePath;
    })
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }

    recorderManager.start(options)

    // wx.startRecord({
    //   success(res) {
    //     _this.data.voidUrl = res.tempFilePath;
    //   }
    // })
    // setTimeout(function () {
    //   wx.stopRecord() // 结束录音
    //   wx.showToast({
    //     icon: 'none',
    //     title: '录音结束'
    //   })
    //   console.log("stop");
    // }, 5000)

    setTimeout(function () {
      recorderManager.stop() // 结束录音
    }, 5000)
  },

  // 上传
  uploadVoid(){
    let _this = this;
    let nameStr = _this.data.voidUrl.split('.');
    let cloudPath = `${nameStr[nameStr.length-2]}.${nameStr[nameStr.length-1]}`;
    wx.showToast({
      icon: 'none',
      title: '开始上传'
    })
    debugger
    console.log("上传URL"+_this.data.voidUrl);
    wx.cloud.uploadFile({
      cloudPath,
      filePath: _this.data.voidUrl, // 小程序临时文件路径
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '上传完毕'
        })
        _this.data.fileId = res.fileID;
        console.log(res)
      },
      fail: err => {
        // handle error
      }
    })
  },

  // 录音播放
  playVoid(tempFilePath) {
    console.log(`云播放地址${tempFilePath}`);
    wx.playVoice({
      filePath: `${tempFilePath}`
    })
  },
  // 录音播放
  playVoid_1() {
    console.log(this.data.voidUrl);
    let url = this.data.voidUrl;
    debugger
    wx.playVoice({
      filePath: url
    })
  },

  // 播放测试
  playVoid_1_test() {
      // 使用 wx.createAudioContext 获取 audio 上下文 context
      this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.setSrc('https://7a6a-zjyr--e475b2-1257679787.tcb.qcloud.la/DBG3CpTZA3sP2959eb1f6465fb9ea41c1a9e9fa2961b.silk?sign=6e6ebf0840614bb613165ee61d6c5fab&t=1540128093')
      this.audioCtx.play()
  },

  // 下载音频文件
  dowloadVoid(){
    let _this = this;
    wx.cloud.getTempFileURL({
      fileList: [_this.data.fileId],
      success: res => {
        let url = res.fileList[0].tempFileURL;
        _this.playVoid(url);
        console.log(`云文件：`)
        console.log(res)
      },
      fail: console.error
    })
  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        debugger
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
