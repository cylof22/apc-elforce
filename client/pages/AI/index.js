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
        console.log(event)
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
            },

            function (e) {
                console.log(e)
            }
        )
    },

    selectVangogh: function() {
        var that = this
        styleArtist = 'vangogh2photo_256'
        styleImgURL = ''
    },

    selectCezanne: function() {
        styleArtist = 'cezanne2photo_256'
        styleImgURL = ''
    },

    selectMonet: function() {
        styleArtist = 'monet2photo_256'
        styleImgURL = ''
    },

    doStyleTransfer: function() {
        if(styleArtist && styleArtist != '') {
            doArtistStyleTransfer()
        } else {
            doNeuralStyleTransfer()
        }
    },

    doNeuralStyleTransfer: function() {
        var that = this

        wx.request({
            url: config.service.customURL + '?style=' + this.styleImgURL + '&' + '?content=' + this.contentImgURL,
            method: 'POST',
            success: function (res) {
                console.log('STATUS: ' + res.statusCode)
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
        wx.request({
            url: config.service.artistURL + '?artist=' + styleArtist + '&' + '?content=' + that.contentImgURL,
            method: 'POST',
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
