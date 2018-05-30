Page({
    data: {
        // 图片列表
        productList: [{
          id: 1,
          image: 'http://localhost:5000/preview/outputs/BtoA_cezanne2photo_256_DSC_0119.jpg',
          name: '丰收的玉米',
        }, {
          id: 2,
          image: 'http://localhost:5000/preview/outputs/7HL_8671.jpg',
          name: '飞瀑',
        }, {
          id: 3,
          image: 'http://localhost:5000/preview/outputs/7Inch_4.jpg',
          name: '蝴蝶',
        }, {
          id: 4,
          image: 'http://localhost:5000/preview/outputs/BtoA_cezanne2photo_256_DSC_0126.jpg',
          name: '故乡的石桥',
        }, {
          id: 5,
          image: 'http://localhost:5000/preview/outputs/BtoA_cezanne2photo_256_DSC_7442.jpg',
          name: '春节',
        },
        {
          id: 6,
          image: 'http://localhost:5000/preview/outputs/DSC_8128.jpg',
          name: '雪乡',
        }], // 商品列表
    
        // 是否显示loading
        showLoading: false,
    
        // loading提示语
        loadingMessage: '',
      },

      onLoad() {
        this.getProducts();
      },

      // request all the products
      getProducts() {

      },

      // 预览图片
      previewProduct(event) {
        var imgURL = event.target.dataset.src; 
        console.log(imgURL)
        wx.previewImage({  
            current: imgURL, // 当前显示图片的http链接  
            urls: [imgURL]// 需要预览的图片http链接列表  
        })  
      }
})