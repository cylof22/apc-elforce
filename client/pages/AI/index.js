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

        // fixed style 
        fixedStyle: false,
        fixedStyleType: '',

        // Artist type
        styleArtist: '',
        masterPiece: '',

        // Preview Image
        previewImgURL: '',

        highLightIndex: -1,
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
                    artistTransfer: false,
                    styleArtist: '',
                    masterPiece: '',
                    styleImgURL: filePath,
                    fixedStyle: false,
                    highLightIndex: 4,
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
        this.setData({
            styleArtist: 'vangogh2photo_256',
            masterPiece: 'still-life-vase-with-fifteen-sunflowers-1888-1.jpg',
            styleImgURL: '',
            fixedStyle: false,
            highLightIndex: 0,
        })
        
    },

    selectCezanne: function() {
        this.setData({
            styleArtist: 'cezanne2photo_256',
            masterPiece: 'forest.jpg',
            styleImgURL: '',
            fixedStyle: false,
            highLightIndex: 2,
        })
    },

    selectMonet: function() {
        this.setData({
            styleArtist: 'monet2photo_256',
            masterPiece: 'autumn-on-the-seine-at-argenteuil.jpg',
            styleImgURL: '',
            fixedStyle: false,
            highLightIndex: 1,
        })
        
    },

    selectLamuse: function() {
        this.data.fixedStyleType = "la_muse"
    },

    selectRainPrincess: function() {
        this.data.fixedStyleType = "rain_princess"
    },

    selectScreem: function() {
        this.data.fixedStyleType = "scream"
    },

    selectShipwreck: function() {
        this.data.fixedStyleType = "wreck"
    },

    selectUdnie: function() {
        this.data.fixedStyleType = "udnie"
    },

    selectWave: function() {
        this.data.fixedStyleType = "wave"
    },

    selectFixedStyle: function() {
        this.setData({
            fixedStyle: true,
            styleArtist: '',
            masterPiece: '',
            styleImgURL: '',
            highLightIndex: 3,
        })
    },

    doStyleTransfer: function() {
        var that = this
        if(this.data.fixedStyle) {
            this.doFixedStyleTransfer()
        } else if(this.data.styleArtist && this.data.styleArtist != '') {
            this.doArtistStyleTransfer()
        } else {
            this.doNeuralStyleTransfer()  
        }
    },
    
    doFixedStyleTransfer: function() {
        var that = this
        var contentInfo = util.base64_encode(that.data.contentImgURL)
        wx.request({
            url: config.service.fixedURL + '?style=' + that.data.fixedStyleType + '&' + 'content=' + contentInfo,
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
