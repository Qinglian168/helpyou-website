/* ============================================
   HELPYOU GROUP - Analytics Tracker
   基于 GoatCounter：页面浏览量、停留时长、浏览器/系统
   配置来自 js/config.js 的 siteConfig.analytics
   ============================================ */
(function () {
    'use strict';

    var cfg = window.siteConfig && window.siteConfig.analytics;
    if (!cfg || !cfg.enabled || !cfg.gcCode) return;

    // 动态加载 GoatCounter 官方统计脚本
    var s = document.createElement('script');
    s.async = true;
    s.src = '//gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', 'https://' + cfg.gcCode + '.goatcounter.com/count');
    document.head.appendChild(s);

    // ===== 停留时长（分桶统计，页面离开时上报）=====
    var start = Date.now();
    var sent = false;

    function bucket(sec) {
        if (sec < 10) return '0-10s';
        if (sec < 30) return '10-30s';
        if (sec < 60) return '30-60s';
        if (sec < 180) return '1-3min';
        if (sec < 600) return '3-10min';
        return '10min+';
    }

    function sendDuration() {
        if (sent) return;
        sent = true;
        var sec = Math.round((Date.now() - start) / 1000);
        var b = bucket(sec);
        try {
            if (window.goatcounter && typeof window.goatcounter.count === 'function') {
                window.goatcounter.count({
                    path: 'duration-' + b,
                    event: true,
                    referer: document.referrer
                });
            } else {
                // 脚本尚未加载完成时用 sendBeacon 兜底
                var url = 'https://' + cfg.gcCode + '.goatcounter.com/count?e=true&p=' +
                    encodeURIComponent('duration-' + b) + '&q=' + location.pathname;
                if (navigator.sendBeacon) {
                    navigator.sendBeacon(url);
                }
            }
        } catch (e) { /* 静默失败，不影响网站 */ }
    }

    window.addEventListener('pagehide', sendDuration);
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') sendDuration();
    });
})();
