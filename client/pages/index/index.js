//index.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        // Content Image
        contentImgURL: '',

        // Style Image
        styleImgURL: '',

        // Preview Image
        previewImgURL: '',
    },

    selectContent: function() {
        var that = this
        this._chooseImgAndUpload(
            config.service.contentURL,
            function(filePath) {
                that.setData({
                    contentImgURL: filePath
                })
            },
            function (res) {
                console.log(res)
            },

            function (e) {
                console.log(e)
                util.showModel('选择内容失败' + e.message)
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
                util.showModel('选择样式失败' + e.message)
            }
        )
    },

    doNeuralStyleTransfer: function() {
        var that = this

        transferUrL = config.service.transferURL + '?style=' + this.styleImgURL + '&' + '?content=' + this.contentImgURL

        wx.request({
            url: transferURL,
            method: 'POST',
            success: function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                res.on('data', function(chunk) {
                    // You can process streamed parts here...
                    bodyChunks.push(chunk);
                }).on('end', function() {
                    var body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);

                    // hwo to set the preview file
                    previewImgURL = body;
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
                util.showBusy('正在加载')
                var filePath = res.tempFilePaths[0]

                beforUpload(filePath)

                // 上传图片
                wx.uploadFile({
                    url,
                    filePath: filePath,
                    name: 'file',
                    success: success,
                    fail: fail
                })
            },
            fail: fail
        })
    }

})
