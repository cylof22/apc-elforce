var config = require('../../config')
var util = require('../../utils/util.js')

var app = getApp()

Page({
  data: {
    style: '',
    previewImgURL : ''
  },

  onLoad: function(params) {
      this.setData({
          previewImgURL: params['result'],
          style: params['style']
      })
  },

  onShareAppMessage: function(res) {
    return {
        title: '🙋‍♂，我的第一幅' + this.data.style + '作品',
        path: '/pages/Result/index?result=' + this.data.previewImgURL,
        imageUrl: this.data.previewImgURL
      }
  },

  save() {
    // Todo: How to add qrcode to the image, right corner?
    wx.downloadFile({url: this.data.previewImgURL, success: function(res) {
            wx.showLoading({
                title: '正在保存图片...',
                mask: true,
            });
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success:function (data) {
                    console.log(data);
                    wx.hideLoading()
                },
                fail:function (err) {
                    console.log(err);
                    if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                        console.log("用户一开始拒绝了，我们想再次发起授权")
                        console.log('打开设置窗口')
                        wx.openSetting({
                            success(settingdata) {
                                console.log(settingdata)
                                if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                                } else {
                                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                                }
                            }
                        })  
                    }
                }
            })

            wx.hideLoading();
        },
        fail: function(res) {
            // Todo: Please retry again
            wx.hideLoading()
        },
        complete: function(res) {
            wx.hideLoading()
        }
    })
  },
  
  OnPreviewResult: function() {
    wx.previewImage({
      urls: [this.data.previewImgURL],
    })
  },
})