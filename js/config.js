/* ============================================
   HELPYOU GROUP - Site Config
   此文件由后台管理系统 (admin.html) 自动生成/更新
   包含：主题颜色、布局、文字覆盖、统计设置
   ============================================ */

var siteConfig = {
    // 主题颜色（留空字符串则使用 CSS 默认值）
    colors: {
        primary: '',        // 主色（深色，如导航/标题）
        accent: '',         // 强调色（按钮/链接）
        bgLight: '',        // 页面底色
        border: ''          // 边框色
    },

    // 布局设置
    layout: {
        radius: '',         // 圆角（如 12px），留空用默认
        containerWidth: '', // 内容最大宽度（如 1200px），留空用默认
        headerDark: true    // 导航栏是否深色
    },

    // 文字覆盖（优先于 i18n.js 默认值，按 key 覆盖）
    texts: {
        'zh-TW': {},
        'en': {}
    },

    // 网站基础信息覆盖
    info: {
        phone: '',
        email: '',
        whatsapp: ''
    },

    // 统计分析设置（GoatCounter，免费注册：https://www.goatcounter.com）
    analytics: {
        enabled: false,
        gcCode: '',         // GoatCounter 站点代码，如 helpyouinfo
        gcToken: ''         // API Token（仅后台拉取数据用，不会泄露给访客）
    },

    // 最后发布信息
    _meta: {
        lastUpdated: '',
        updatedBy: 'system'
    }
};

window.siteConfig = siteConfig;
