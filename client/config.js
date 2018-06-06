/**
 * 小程序配置文件
 */

var host = 'https://tulian.17dodo.com';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        
        contentURL: `${host}/content`,
        styleURL: `${host}/style`,
        customURL: `${host}/styleTransfer`,
        artistURL: `${host}/artistStyle`,
        fixedURL: `${host}/fixedStyle`
    }
};

module.exports = config;
