
var iconPath = "../../images/icons/"
var tabs = [
    {
        "icon": iconPath + "mark.png",
        "iconActive": iconPath + "markHL.png",
        "title": "发布",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "collect.png",
        "iconActive": iconPath + "collectHL.png",
        "title": "收藏",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "like.png",
        "iconActive": iconPath + "likeHL.png",
        "title": "喜欢",
        "extraStyle": "",
    },
    {
        "icon": iconPath + "more.png",
        "iconActive": iconPath + "moreHL.png",
        "title": "更多",
        "extraStyle": "border:none;",
    },
]

var userInfo = {
    avatar: "https://pic4.zhimg.com/e515adf3b_xl.jpg",
    nickname: "小闹钟",
    sex: "♂",  // 0, male; 1, female
    meta: '未发布作品',
}

Page({
    // data
    data: {
        // 展示的tab标签
        tabs: tabs,

        // 当前选中的标签
        currentTab: "tab1",

        // 高亮的标签索引
        highLightIndex: "0",

        // 模态对话框样式 
        modalShowStyle: "",

        // 待新建的日记标题
        diaryTitle: "",

        // TODO 用户信息
        userInfo: userInfo,
    },
})