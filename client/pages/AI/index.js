//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

var app = getApp()

Page({
    data: {
        // Content Image
        contentImgURL: '',

        // Style Image
        styleImgURL: '',

        // Artist type
        styleArtist: '',

        // Preview Image
        previewImgURL: '',
    },

    selectContent: function(event) {
        var that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function(filePath) {
                console.log(filePath)
                that.setData({
                    contentImgURL: filePath
                })
            },
            function (res) {
                console.log(res)
                that.setData({
                  contentImgURL: res.data
                })
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectStyle: function() {
        var that = this
        this._chooseImgAndUpload(
            config.service.styleURL,
            function(filePath) {
                that.setData({
                    styleImgURL: filePath
                })
            },
            function (res) {
                console.log(res)
                that.setData({
                  styleImgURL: res.data
                })
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectVangogh: function() {
        this.data.styleArtist = 'vangogh2photo_256'
        this.data.styleImgURL = ''
    },

    selectCezanne: function() {
        this.data.styleArtist = 'cezanne2photo_256'
        this.data.styleImgURL = ''
    },

    selectMonet: function() {
        this.data.styleArtist = 'monet2photo_256'
        this.data.styleImgURL = ''
    },

    doStyleTransfer: function() {
        var that = this
        if(this.data.styleArtist && this.data.styleArtist != '') {
          this.doArtistStyleTransfer()
        } else {
          this.doNeuralStyleTransfer()  
        }
    },

    doNeuralStyleTransfer: function() {
        var that = this
        var styleInfo = util.base64_encode(that.data.styleImgURL)
        var contentInfo = util.base64_encode(that.data.contentImgURL)
        wx.request({
            url: config.service.customURL + '?style=' + styleInfo + '&' + 'content=' + contentInfo,
            method: 'GET',
            success: function (res) {
                console.log(res)
                that.setData({
                    previewImgURL: res.data
                })
            },
            fail: function (res) {
                console.log('转换失败' + JSON.stringify(res))
            },
        })
    },

    doArtistStyleTransfer: function() {
        var that = this
        var contentInfo = util.base64_encode(that.data.contentImgURL)
        wx.request({
            url: config.service.artistURL + '?artist=' + that.data.styleArtist + '&' + 'content=' + contentInfo,
            method: 'GET',
            success: function (res) {
                console.log('STATUS: ' + res.statusCode)
                console.log('HEADERS: ' + JSON.stringify(res.headers))
                that.setData({
                    previewImgURL: res.data
                })
            },
            fail: function (res) {
                console.log('转换失败' + JSON.stringify(res))
            },
        })
    },

    saveAndShare() {
        // 
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
            sizeType: ['compressed'],
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
