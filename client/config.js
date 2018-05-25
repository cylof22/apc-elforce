/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'http://localhost:5000';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,
        
        contentURL: `${host}/content`,
        styleURL: `${host}/style`,
        customURL: `${host}/styleTransfer`,
        artistURL: `${host}/artistStyle`
    }
};

module.exports = config;
