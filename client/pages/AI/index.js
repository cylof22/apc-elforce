//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

var app = getApp()

Page({
    data: {
        // Preview Image
        previewImgURL: '',
    },

    selectVangogh: function() {
      let that = this
      this._chooseImgAndUpload(
        config.service.contentURL,
        function (filePath) {
          console.log(filePath)
          
        },
        function (res) {
          console.log(res)
          that.doArtistStyleTransfer('vangogh2photo_256', res.data)
        },

        function (e) {
          console.log(e)
        }
      ) 
    },

    selectCezanne: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doArtistStyleTransfer('cezanne2photo_256', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectMonet: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doArtistStyleTransfer('monet2photo_256', res.data)
            },

            function (e) {
                console.log(e)
            }
        )        
    },

    selectLamuse: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('la_muse', res.data)
                that.setData({
                    contentImgURL: res.data
                })
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectRainPrincess: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('rain_princess', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectScreem: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('scream', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectShipwreck: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('wreck', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectUdnie: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('udnie', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectWave: function() {
        let that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function (filePath) {
                console.log(filePath)
                
            },
            function (res) {
                console.log(res)
                that.doFixedStyleTransfer('wave', res.data)
            },

            function (e) {
                console.log(e)
            }
        )
    },
    
    doFixedStyleTransfer: function(style, contentURL) {
        var that = this
        var contentInfo = util.base64_encode(contentURL)
        wx.showLoading({
            title: '正在生成图片...',
            mask: true,
        });
        wx.request({
            url: config.service.fixedURL + '?style=' + style + '&' + 'content=' + contentInfo,
            method: 'GET',
            success: function (res) {
                console.log(res)
                that.setData({
                    previewImgURL: res.data
                })
                wx.hideLoading()
            },
            fail: function (res) {
                console.log('转换失败' + JSON.stringify(res))
                wx.hideLoading()
            },
        })
    },
    doNeuralStyleTransfer: function() {
        var that = this
        var styleInfo = util.base64_encode(that.data.styleImgURL)
        var contentInfo = util.base64_encode(that.data.contentImgURL)
        wx.showLoading({
            title: '正在生成图片...',
            mask: true,
        });
        wx.request({
            url: config.service.customURL + '?style=' + styleInfo + '&' + 'content=' + contentInfo,
            method: 'GET',
            success: function (res) {
                console.log(res)
                that.setData({
                    previewImgURL: res.data
                })
                wx.hideLoading()
            },
            fail: function (res) {
                console.log('转换失败' + JSON.stringify(res))
                wx.hideLoading()
            },
        })
    },

    doArtistStyleTransfer: function(artist, contentURL) {
        var that = this
        var contentInfo = util.base64_encode(contentURL)
        wx.showLoading({
            title: '正在生成图片...',
            mask: true,
        });

        wx.request({
            url: config.service.artistURL + '?artist=' + artist + '&' + 'content=' + contentInfo,
            method: 'GET',
            success: function (res) {
                that.setData({
                    previewImgURL: res.data
                })
                wx.hideLoading();
            },
            fail: function (res) {
                console.log('转换失败' + JSON.stringify(res))
                wx.hideLoading()
            },
        })
    },

    saveAndShare() {
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
    /**
     * 统一封装选择图片和上传图片的 API
     * @param {Function} beforUpload 开始上传图片之前执行的函数
     * @param {Function} success     调用成功时执行的函数
     * @param {Function} fail        调用失败时执行的函数
     */
    _chooseImgAndUpload (url, beforUpload, successfunc, failfunc) {
        var that = this
        
        // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success: function(res){
                //util.showBusy('正在加载')
                var filePath = res.tempFilePaths[0]

                beforUpload(filePath)

                // 上传图片
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url, 
                    filePath,
                    name: 'file',
                    success: successfunc,
                    fail:failfunc
                })
            },
            fail: failfunc
        })
    }

})
