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

    doNeuralStyleTransfer: function() {
        var that = this

        wx.request({
            url: config.service.customURL + '?style=' + this.styleImgURL + '&' + '?content=' + this.contentImgURL,
            method: 'POST',
            success: function (res) {
                console.log('STATUS: ' + res.statusCode)
                console.log('HEADERS: ' + JSON.stringify(res.headers))
                that.setData({
                    previewImgURL: res.body
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
            url: config.service.artistURL + '?artist=cezanne2photo_256' + '&' + '?content=' + that.contentImgURL,
            method: 'POST',
            success: function (res) {
                console.log('STATUS: ' + res.statusCode)
                console.log('HEADERS: ' + JSON.stringify(res.headers))
                that.setData({
                    previewImgURL: res.body
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
    _chooseImgAndUpload (url, beforUpload, success, fail) {
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
                console.log(tempFilePaths)
                wx.uploadFile({
                    url, 
                    filePath,
                    name: 'file',
                    success: function(res){
                    var data = res.data
                            wx.showModal({
                            title: '上传文件返回状态',
                            content: '成功',
                            success: function(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        })
                    },
                    fail:function(res){
                        console.log(res)
                    }
                })
            },
            fail: fail
        })
    }

})
