/**
 * 站点数据 —— 想加网站就复制一行
 * 格式：{ name: "名字", url: "网址", desc: "一句话", alias: ["别名"] }
 * alias 可选，用来支持俗称搜索（比如 b站、cnki）
 */
const SITE_DATA = [
  {
    cat: "AI 工具",
    items: [
      { name: "DeepSeek 对话", url: "https://chat.deepseek.com", desc: "官方对话入口", alias: ["ds", "深度求索"] },
      { name: "DeepSeek 开放平台", url: "https://platform.deepseek.com", desc: "API Key 与余额", alias: ["api", "平台"] },
      { name: "zwaca 中转站", url: "https://new.zwaca.ggff.net/dashboard", desc: "我在用的 API 中转", alias: ["中转", "zwaca"] },
      { name: "Kimi", url: "https://kimi.moonshot.cn", desc: "长文本阅读", alias: ["月之暗面"] },
      { name: "通义", url: "https://tongyi.aliyun.com", desc: "阿里大模型", alias: ["千问", "qwen"] },
      { name: "智谱清言", url: "https://chatglm.cn", desc: "GLM 系列", alias: ["glm", "zhipu"] },
      { name: "豆包", url: "https://www.doubao.com/chat/", desc: "字节跳动", alias: ["doubao", "字节"] },
      { name: "ChatGPT", url: "https://chat.openai.com", desc: "需要代理", alias: ["gpt", "openai"] },
      { name: "Claude", url: "https://claude.ai", desc: "需要代理", alias: ["anthropic"] },
    ],
  },
  {
    cat: "学习与课程",
    items: [
      { name: "中国大学 MOOC", url: "https://www.icourse163.org", desc: "高校公开课", alias: ["慕课", "mooc"] },
      { name: "哔哩哔哩", url: "https://www.bilibili.com", desc: "课程与教程", alias: ["b站", "bilibili", "bili"] },
      { name: "知网", url: "https://www.cnki.net", desc: "文献检索", alias: ["cnki", "论文"] },
      { name: "超星学习通", url: "https://passport2.chaoxing.com", desc: "课程平台", alias: ["学习通", "chaoxing"] },
      { name: "菜鸟教程", url: "https://www.runoob.com", desc: "快速查语法", alias: ["runoob", "教程"] },
      { name: "学信网", url: "https://www.chsi.com.cn", desc: "学籍学历查询", alias: ["chsi", "学历"] },
    ],
  },
  {
    cat: "编程开发",
    items: [
      { name: "GitHub", url: "https://github.com", desc: "代码托管", alias: ["gh", "github"] },
      { name: "MDN", url: "https://developer.mozilla.org/zh-CN/", desc: "Web 文档", alias: ["mdn", "文档"] },
      { name: "Stack Overflow", url: "https://stackoverflow.com", desc: "报错搜索", alias: ["so", "stack"] },
      { name: "CSDN", url: "https://www.csdn.net", desc: "中文技术博客", alias: ["csdn"] },
      { name: "博客园", url: "https://www.cnblogs.com", desc: "老牌开发者社区", alias: ["cnblogs"] },
      { name: "Gitee", url: "https://gitee.com", desc: "国内代码托管", alias: ["码云", "gitee"] },
    ],
  },
  {
    cat: "资源下载",
    items: [
      { name: "阿里云盘", url: "https://www.alipan.com", desc: "不限速网盘", alias: ["alipan", "阿里"] },
      { name: "百度网盘", url: "https://pan.baidu.com", desc: "存资料", alias: ["bdwp", "百度盘"] },
      { name: "夸克网盘", url: "https://pan.quark.cn", desc: "资源分享常用", alias: ["夸克", "quark"] },
      { name: "蓝奏云", url: "https://www.lanzou.com", desc: "小文件免登录", alias: ["lanzou", "蓝奏"] },
      { name: "站酷", url: "https://www.zcool.com.cn", desc: "设计素材参考", alias: ["zcool", "设计"] },
      { name: "iconfont", url: "https://www.iconfont.cn", desc: "矢量图标库", alias: ["图标", "阿里图标"] },
    ],
  },
  {
    cat: "生活服务",
    items: [
      { name: "网易邮箱", url: "https://mail.163.com", desc: "收发邮件", alias: ["163", "mail"] },
      { name: "百度翻译", url: "https://fanyi.baidu.com", desc: "看英文文档", alias: ["翻译", "fanyi"] },
      { name: "中国天气", url: "https://www.weather.com.cn", desc: "天气预报", alias: ["天气", "weather"] },
      { name: "高德地图", url: "https://www.amap.com", desc: "查路线", alias: ["地图", "amap"] },
      { name: "快递 100", url: "https://www.kuaidi100.com", desc: "查物流", alias: ["快递", "物流"] },
    ],
  },
  {
    cat: "游戏",
    items: [
      { name: "Steam", url: "https://store.steampowered.com", desc: "PC 游戏商店", alias: ["steam", "蒸汽"] },
      { name: "游民星空", url: "https://www.gamersky.com", desc: "攻略与资讯", alias: ["gamersky", "攻略"] },
      { name: "NGA", url: "https://bbs.nga.cn", desc: "玩家论坛", alias: ["nga", "论坛"] },
      { name: "小黑盒", url: "https://www.xiaoheihe.cn", desc: "游戏社区", alias: ["xiaoheihe"] },
    ],
  },
];
