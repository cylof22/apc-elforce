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
        showPreview: false,
    },

    doNeuralStyleTransfer: function() {
        var that = this
        that.setData({
            showPreview: false
        })

        // Select Picture and transfer
        this._chooseImgAndUpload(
            // Add more data for target and artist type
            config.service.ciUrl + '?action=transfer',
            function(filePath) {
                that.setData({
                    contentImgURL: filePath
                })
            },
            function (res) {
                console.log(res)
                // Show the preview data
            },
            function (e) {
                console.log(e)
                util.showModel('转换失败' + e.message)
            }
        )
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
                util.showBusy('正在识别')
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
