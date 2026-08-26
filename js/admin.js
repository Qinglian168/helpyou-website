/* ============================================
   HELPYOU GROUP - Admin Panel (v2 Simplified)
   纯前端后台：GitHub API 直接发布 + GoatCounter 统计
   ============================================ */
var Admin = (function () {
    'use strict';

    // ==================== State ====================
    var S = {
        settings: {},          // localStorage: repo, token, gcToken, passHash
        products: [],          // productsData 副本
        news: [],              // newsData 副本
        prodStatic: {},        // brandList / brandColors / brandLogos
        productsDirty: false,
        newsDirty: false,
        editingProductId: null,
        editingNewsId: null,
        pendingImage: null,    // {dataUrl, base64}
        // news.js prefix/suffix（保留渲染函数）
        newsPrefix: '',
        newsSuffix: ''
    };

    var LS_KEY = 'hy_admin_settings';
    var CATEGORIES = { router: '路由器', switch: '交换机', firewall: '防火墙', wireless: '无线AP', server: '服务器', voice: '语音通讯', security: '安全设备' };
    var NEWS_CATS  = { product: '产品资讯', company: '公司动态', industry: '行业趋势' };

    // ==================== Utils ====================
    function $(id) { return document.getElementById(id); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function toast(msg, type) {
        var el = $('toast');
        el.textContent = msg;
        el.className = 'toast show ' + (type || '');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.className = 'toast'; }, 3000);
    }
    function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
    function todayStr() { return new Date().toISOString().slice(0, 10); }
    function download(filename, content) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }
    function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
    async function sha256(s) {
        var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }

    // ==================== Storage ====================
    function loadSettings() {
        try { S.settings = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch (e) { S.settings = {}; }
    }
    function saveSettings() { localStorage.setItem(LS_KEY, JSON.stringify(S.settings)); }

    // ==================== Login ====================
    async function doLogin() {
        var pass = $('loginPass').value;
        if (!S.settings.passHash) {
            if (pass.length < 6) { $('loginHint').textContent = '首次使用：请设置至少 6 位的管理密码'; return; }
            S.settings.passHash = await sha256(pass);
            saveSettings();
        } else if (await sha256(pass) !== S.settings.passHash) {
            $('loginHint').textContent = '密码错误，请重试';
            $('loginPass').value = '';
            return;
        }
        $('loginOverlay').style.display = 'none';
        $('app').style.display = 'block';
        boot();
    }
    function doLogout() {
        $('app').style.display = 'none';
        $('loginOverlay').style.display = 'flex';
        $('loginPass').value = '';
        $('loginPass').focus();
    }

    // ==================== GitHub API ====================
    function ghHeaders() {
        var h = { 'Accept': 'application/vnd.github+json' };
        if (S.settings.token) h['Authorization'] = 'Bearer ' + S.settings.token;
        return h;
    }
    async function gh(path, opts) {
        var repo = S.settings.repo || 'Qinglian168/helpyou-website';
        var r = await fetch('https://api.github.com/repos/' + repo + '/' + path.replace(/^\//, ''), Object.assign({ headers: ghHeaders() }, opts || {}));
        if (!r.ok) {
            var body = '';
            try { body = (await r.json()).message || ''; } catch (e) { }
            throw new Error('GitHub API ' + r.status + (body ? '：' + body : ''));
        }
        return r.status === 204 ? null : r.json();
    }
    async function ghPut(path, content, message) {
        if (!S.settings.token) throw new Error('尚未配置 GitHub Token，请到「系统设置」填写');
        var sha = null;
        try { sha = (await gh('contents/' + path)).sha; } catch (e) { /* 新文件 */ }
        return gh('contents/' + path, {
            method: 'PUT',
            body: JSON.stringify({ message: message, content: b64(content), sha: sha })
        });
    }
    async function ghPutImage(path, b64data, message) {
        if (!S.settings.token) throw new Error('未配置 GitHub Token');
        var sha = null;
        try { sha = (await gh('contents/' + path)).sha; } catch (e) { }
        return gh('contents/' + path, {
            method: 'PUT',
            body: JSON.stringify({ message: message, content: b64data, sha: sha })
        });
    }
    async function testGithub() {
        $('ghTestResult').textContent = '测试中...';
        try {
            var repo = (await gh(''));
            $('ghTestResult').innerHTML = '<span style="color:var(--success)">✅ 连接成功：</span>' + esc(repo.full_name) + '（权限：' + (S.settings.token ? '读写' : '只读/未配置 Token') + '）';
        } catch (e) {
            $('ghTestResult').innerHTML = '<span style="color:var(--danger)">❌ ' + esc(e.message) + '</span>';
        }
    }

    // ==================== Sandbox 加载站点 JS 数据 ====================
    function sandboxEval(code, varNames) {
        var w = {};
        var stubDoc = { getElementById: function () { return null; }, addEventListener: function () { }, querySelectorAll: function () { return []; } };
        var stubLS = { getItem: function () { return null; }, setItem: function () { } };
        var fn = new Function('window', 'document', 'localStorage', 'navigator', code + '\n;return window;');
        w = fn(w, stubDoc, stubLS, { userAgent: 'admin' });
        var out = {};
        varNames.forEach(function (n) { out[n] = w[n]; });
        return out;
    }
    async function fetchText(path) {
        var r = await fetch(path + '?t=' + Date.now());
        if (!r.ok) throw new Error('无法加载 ' + path);
        return r.text();
    }

    async function loadAllData() {
        // 产品
        var proCode = await fetchText('js/products.js');
        var pd = sandboxEval(proCode, ['productsData', 'brandList', 'brandColors', 'brandLogos']);
        S.products = (pd.productsData || []).map(normalizeProduct);
        S.prodStatic = {
            brandList: pd.brandList || [],
            brandColors: pd.brandColors || {},
            brandLogos: pd.brandLogos || {}
        };

        // 新闻（保留渲染函数）
        var newsCode = await fetchText('js/news.js');
        var idx = newsCode.indexOf('var newsData');
        if (idx < 0) throw new Error('news.js 中未找到 newsData 定义');
        // 找 newsData 结束位置（首个 ';\n\n' 或 ';\n' 后接非 var/function）
        var endIdx = newsCode.indexOf(';', idx);
        while (endIdx > 0) {
            var after = newsCode.slice(endIdx + 1, endIdx + 10);
            if (/^(\s*\n)/.test(after) || /^(\s*window\.)/.test(after)) break;
            endIdx = newsCode.indexOf(';', endIdx + 1);
        }
        S.newsPrefix = newsCode.slice(0, idx);
        S.newsSuffix = newsCode.slice(endIdx + 1);
        var nd = sandboxEval(newsCode, ['newsData']);
        S.news = (nd.newsData || []).map(normalizeNews);
    }
    function normalizeProduct(p) {
        return {
            id: p.id, brand: p.brand, brandClass: p.brandClass, category: p.category, icon: p.icon || '📦',
            model: p.model || '',
            image: p.image || '',
            name: { 'zh-TW': (p.name && (p.name['zh-TW'] || p.name.zh || '')) || '', en: (p.name && p.name.en) || '' },
            desc: { 'zh-TW': (p.desc && (p.desc['zh-TW'] || p.desc.zh || '')) || '', en: (p.desc && p.desc.en) || '' },
            specs: Array.isArray(p.specs) ? p.specs.slice() : [],
            useCases: Array.isArray(p.useCases) ? p.useCases.slice() : []
        };
    }
    function normalizeNews(n) {
        return {
            id: n.id, date: n.date, category: n.category,
            title: { 'zh-TW': (n.title && (n.title['zh-TW'] || n.title.zh || '')) || '', en: (n.title && n.title.en) || '' },
            summary: { 'zh-TW': (n.summary && (n.summary['zh-TW'] || n.summary.zh || '')) || '', en: (n.summary && n.summary.en) || '' },
            content: { 'zh-TW': (n.content && (n.content['zh-TW'] || n.content.zh || '')) || '', en: (n.content && n.content.en) || '' },
            link: n.link || ''
        };
    }

    // ==================== Serializers ====================
    function serializeProducts() {
        var st = S.prodStatic;
        return '/* ============================================\n' +
            '   HELPYOU GROUP - Product Data\n' +
            '   ' + st.brandList.length + ' Brands | 由后台管理系统生成\n' +
            '   ============================================ */\n\n' +
            'var brandList = ' + JSON.stringify(st.brandList, null, 4) + ';\n\n' +
            'var brandColors = ' + JSON.stringify(st.brandColors, null, 4) + ';\n\n' +
            'var brandLogos = ' + JSON.stringify(st.brandLogos, null, 4) + ';\n\n' +
            'function brandClassFor(brand) {\n    return \'brand-\' + brand.toLowerCase().replace(/[^a-z0-9]/g, \'\');\n}\n\n' +
            'var productsData = ' + JSON.stringify(S.products, null, 4) + ';\n\n' +
            'window.brandList = brandList;\nwindow.brandColors = brandColors;\nwindow.brandLogos = brandLogos;\nwindow.brandClassFor = brandClassFor;\nwindow.productsData = productsData;\n';
    }
    function serializeNews() {
        if (!S.newsPrefix || S.newsSuffix === undefined) throw new Error('news.js 结构解析失败，请刷新页面重试');
        return S.newsPrefix + 'var newsData = ' + JSON.stringify(S.news, null, 4) + ';\n\n' + S.newsSuffix;
    }
    function publishProducts() { return _publish(serializeProducts, 'js/products.js', 'admin: update products', 'productDirty', 'productsDirty', '产品已发布'); }
    function publishNews()     { return _publish(serializeNews,     'js/news.js',     'admin: update news',     'newsDirty',     'newsDirty',     '新闻已发布'); }
    function downloadProducts(){ download('products.js', serializeProducts()); }
    function downloadNews()    { download('news.js', serializeNews()); }
    async function _publish(serializeFn, path, msg, labelId, dirtyKey, okMsg) {
        try {
            await ghPut(path, serializeFn(), msg + ' (' + (path === 'js/products.js' ? S.products.length : S.news.length) + ' items)');
            S[dirtyKey] = false;
            $(labelId).textContent = '与线上一致';
            toast('✅ ' + okMsg, 'success');
        } catch (e) {
            toast('发布失败：' + e.message, 'error');
        }
    }

    // ==================== Tabs ====================
    function switchTab(name) {
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        document.querySelectorAll('.menu-item').forEach(function (n) { n.classList.remove('active'); });
        var panel = $('tab-' + name);
        if (panel) panel.classList.add('active');
        var nav = document.querySelector('.menu-item[data-tab="' + name + '"]');
        if (nav) nav.classList.add('active');
        if (name === 'analytics') initAnalyticsTab();
        if (name === 'appearance') initAppearanceTab();
        if (name === 'texts') initTextsTab();
        if (name === 'dashboard') renderDashboard();
    }

    // ==================== Site Config (config.js) ====================
    var DEFAULT_COLORS = { primary: '#0f172a', accent: '#3b82f6', bgLight: '#ffffff', border: '#e2e8f0' };
    var DEFAULT_LAYOUT = { radius: '16px', containerWidth: '1200px', headerDark: true };
    var DEFAULT_INFO   = { phone: '', email: '', whatsapp: '' };

    function ensureConfigDefaults(cfg) {
        if (!cfg) cfg = {};
        cfg.colors = Object.assign({}, DEFAULT_COLORS, cfg.colors || {});
        cfg.layout = Object.assign({}, DEFAULT_LAYOUT, cfg.layout || {});
        cfg.info   = Object.assign({}, DEFAULT_INFO,   cfg.info   || {});
        cfg.texts  = cfg.texts  || { 'zh-TW': {}, en: {} };
        cfg.analytics = cfg.analytics || { enabled: false, gcCode: '', gcToken: '' };
        cfg._meta = cfg._meta || { lastUpdated: '', updatedBy: 'admin' };
        return cfg;
    }

    async function loadConfig() {
        try {
            var code = await fetchText('js/config.js');
            // 简单粗暴：eval 整个文件拿到 siteConfig
            var w = sandboxEval(code, ['siteConfig']);
            S.config = ensureConfigDefaults(w.siteConfig || null);
        } catch (e) {
            S.config = ensureConfigDefaults(null);
        }
        S.settings.gcCode = S.settings.gcCode || (S.config.analytics.gcCode || '');
        S.settings.gcToken = S.settings.gcToken || (S.config.analytics.gcToken || '');
        saveSettings();
    }

    function serializeConfig() {
        var c = ensureConfigDefaults(S.config);
        c._meta = c._meta || {};
        c._meta.lastUpdated = new Date().toISOString();
        c._meta.updatedBy = 'admin';
        // 重新写为标准 JS 格式
        return '/* ============================================\n' +
            '   HELPYOU GROUP - Site Config\n' +
            '   此文件由后台管理系统 (admin.html) 自动生成/更新\n' +
            '   包含：主题颜色、布局、文字覆盖、统计设置\n' +
            '   最后更新：' + c._meta.lastUpdated + '\n' +
            '   ============================================ */\n\n' +
            'var siteConfig = ' + JSON.stringify(c, null, 4) + ';\n\n' +
            'window.siteConfig = siteConfig;\n';
    }

    async function publishConfig() {
        try {
            await ghPut('js/config.js', serializeConfig(), 'admin: update site config');
            toast('✅ 站点配置已发布', 'success');
        } catch (e) {
            toast('发布失败：' + e.message, 'error');
        }
    }

    // ==================== 仪表盘 ====================
    function renderDashboard() {
        $('dsProducts').textContent = S.products.length;
        $('dsNews').textContent = S.news.length;
        $('dsBrands').textContent = (S.prodStatic.brandList || []).length;
        var c = ensureConfigDefaults(S.config);
        $('dsPrimaryCode').textContent = c.colors.primary || '使用默认（' + DEFAULT_COLORS.primary + '）';
        var swatch = $('dsPrimaryColor');
        swatch.style.background = c.colors.primary || DEFAULT_COLORS.primary;
        var ana = c.analytics || {};
        $('dsAnalyticsStatus').innerHTML = ana.enabled && ana.gcCode
            ? '<span style="color:var(--success)">✅ 已启用：' + esc(ana.gcCode) + '.goatcounter.com</span>'
            : '<span class="muted">未配置（到「访问统计」标签页设置）</span>';
        if (S.settings.repo) $('dsRepoLink').textContent = S.settings.repo;

        // 最近 5 条新闻
        var recent = S.news.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); }).slice(0, 5);
        $('dsRecentNews').innerHTML = recent.length ? recent.map(function (n) {
            var title = (n.title && (n.title['zh-TW'] || n.title.zh)) || '(无标题)';
            return '<div class="recent-item">' +
                '<span class="recent-date">' + esc(n.date) + '</span>' +
                '<span class="recent-title">' + esc(title) + '</span>' +
                '</div>';
        }).join('') : '<p class="muted">暂无新闻</p>';
    }

    // ==================== 外观与布局 ====================
    function initAppearanceTab() {
        var c = ensureConfigDefaults(S.config);
        ['primary', 'accent', 'bgLight', 'border'].forEach(function (k) {
            var pickerId = k === 'bgLight' ? 'apBg' : 'ap' + k[0].toUpperCase() + k.slice(1);
            var txtId    = pickerId + 'Txt';
            var v = c.colors[k] || '';
            if ($(pickerId)) $(pickerId).value = v || DEFAULT_COLORS[k];
            if ($(txtId))    $(txtId).value = v;
        });
        $('apRadiusTxt').value = c.layout.radius || DEFAULT_LAYOUT.radius;
        $('apRadius').value = parseInt(c.layout.radius) || parseInt(DEFAULT_LAYOUT.radius);
        $('apWidthTxt').value = c.layout.containerWidth || DEFAULT_LAYOUT.containerWidth;
        $('apWidth').value = parseInt(c.layout.containerWidth) || parseInt(DEFAULT_LAYOUT.containerWidth);
        $('apHeaderDark').checked = c.layout.headerDark !== false;
        $('apPhone').value = c.info.phone || '';
        $('apEmail').value = c.info.email || '';
        $('apWhatsapp').value = c.info.whatsapp || '';
        applyAppearancePreview();
    }

    function collectAppearance() {
        var c = ensureConfigDefaults(S.config);
        c.colors.primary = $('apPrimaryTxt').value.trim() || '';
        c.colors.accent  = $('apAccentTxt').value.trim()  || '';
        c.colors.bgLight = $('apBgTxt').value.trim()     || '';
        c.colors.border  = $('apBorderTxt').value.trim()  || '';
        c.layout.radius = ($('apRadius').value || '0') + 'px';
        c.layout.containerWidth = ($('apWidth').value || '1200') + 'px';
        c.layout.headerDark = $('apHeaderDark').checked;
        c.info.phone = $('apPhone').value.trim();
        c.info.email = $('apEmail').value.trim();
        c.info.whatsapp = $('apWhatsapp').value.trim();
        return c;
    }

    function resetAppearance() {
        if (!confirm('确定恢复所有外观设置为默认值？')) return;
        S.config = ensureConfigDefaults({ colors: {}, layout: {}, info: {} });
        initAppearanceTab();
        toast('已恢复默认值，点「保存并发布」即可上线', 'success');
    }

    function publishAppearance() {
        S.config = collectAppearance();
        return publishConfig();
    }

    function syncColor(pickerId, val) {
        var picker = $(pickerId);
        if (picker && val && /^#[0-9a-f]{6}$/i.test(val)) picker.value = val;
        applyAppearancePreview();
    }

    function applyAppearancePreview() {
        var c = collectAppearance();
        var root = $('apPreview');
        if (!root) return;
        root.style.setProperty('--preview-primary', c.colors.primary || DEFAULT_COLORS.primary);
        root.style.setProperty('--preview-accent',  c.colors.accent  || DEFAULT_COLORS.accent);
        root.style.setProperty('--preview-bg',      c.colors.bgLight || DEFAULT_COLORS.bgLight);
        root.style.setProperty('--preview-border',  c.colors.border  || DEFAULT_COLORS.border);
        root.style.setProperty('--preview-radius',  c.layout.radius  || DEFAULT_LAYOUT.radius);
    }

    // ==================== 文字内容 ====================
    var _i18nCache = null;
    function loadTextsFromI18n() {
        try {
            var code = ''; // 直接 fetch
            fetch('js/i18n.js?t=' + Date.now()).then(function (r) { return r.text(); }).then(function (t) {
                var w = sandboxEval(t, ['i18nData']);
                _i18nCache = w.i18nData || {};
                // 把所有 key 同步到当前语言的覆盖表（保留已有覆盖）
                var lang = $('textsLang').value;
                S.config = ensureConfigDefaults(S.config);
                S.config.texts[lang] = S.config.texts[lang] || {};
                Object.keys(_i18nCache[lang] || {}).forEach(function (k) {
                    if (!S.config.texts[lang].hasOwnProperty(k)) {
                        S.config.texts[lang][k] = '';
                    }
                });
                renderTexts();
                toast('已同步 ' + Object.keys(_i18nCache[lang] || {}).length + ' 个 key', 'success');
            });
        } catch (e) {
            toast('同步失败：' + e.message, 'error');
        }
    }
    function initTextsTab() {
        S.config = ensureConfigDefaults(S.config);
        if (!_i18nCache) {
            // 尝试加载
            fetch('js/i18n.js?t=' + Date.now()).then(function (r) { return r.text(); }).then(function (t) {
                var w = sandboxEval(t, ['i18nData']);
                _i18nCache = w.i18nData || {};
                renderTexts();
            }).catch(function () { renderTexts(); });
        } else {
            renderTexts();
        }
    }
    function renderTexts() {
        S.config = ensureConfigDefaults(S.config);
        var lang = $('textsLang').value;
        var q = ($('textsSearch').value || '').toLowerCase();
        var overrides = S.config.texts[lang] || {};
        var keys = Object.keys(_i18nCache && _i18nCache[lang] ? _i18nCache[lang] : {});
        keys.sort();
        if (q) keys = keys.filter(function (k) {
            return k.toLowerCase().indexOf(q) >= 0 || String(_i18nCache[lang][k]).toLowerCase().indexOf(q) >= 0;
        });
        $('textsCount').textContent = keys.length + ' 个 key';
        if (!keys.length) {
            $('textsList').innerHTML = '<p class="muted" style="padding:24px;text-align:center">未找到匹配的 key。先点上方「从 i18n.js 同步键值」</p>';
            return;
        }
        $('textsList').innerHTML = keys.map(function (k) {
            var defaultVal = (_i18nCache[lang] || {})[k] || '';
            var overrideVal = overrides[k] || '';
            return '<div class="text-row">' +
                '<div class="text-key">' + esc(k) + '</div>' +
                '<div class="text-default muted">默认：' + esc(defaultVal) + '</div>' +
                '<input type="text" class="text-override" data-key="' + esc(k) + '" value="' + esc(overrideVal) + '" placeholder="留空使用默认" oninput="Admin.onTextChange(\'' + esc(k).replace(/'/g, "\\'") + '\', this.value)">' +
                '</div>';
        }).join('');
    }
    function onTextChange(k, v) {
        S.config = ensureConfigDefaults(S.config);
        var lang = $('textsLang').value;
        S.config.texts[lang] = S.config.texts[lang] || {};
        if (v.trim()) S.config.texts[lang][k] = v;
        else delete S.config.texts[lang][k];
    }
    function publishTexts() {
        return publishConfig();
    }

    // ==================== 产品管理 ====================
    function renderProducts() {
        var q = ($('productSearch').value || '').toLowerCase();
        var rows = S.products.filter(function (p) {
            var nameZh = (p.name && p.name['zh-TW']) || '';
            return !q || (p.brand + ' ' + p.model + ' ' + nameZh).toLowerCase().indexOf(q) >= 0;
        });
        $('productRows').innerHTML = rows.map(function (p) {
            var nameZh = (p.name && p.name['zh-TW']) || '';
            return '<tr>' +
                '<td>' + (p.image ? '<img class="img-thumb" src="' + esc(p.image) + '?t=' + Date.now() % 1e5 + '" loading="lazy">' : '-') + '</td>' +
                '<td><b>' + esc(nameZh) + '</b></td>' +
                '<td>' + esc(p.brand) + '</td>' +
                '<td>' + esc(p.model) + '</td>' +
                '<td><span class="cat-badge">' + esc(CATEGORIES[p.category] || p.category) + '</span></td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="Admin.editProduct(\'' + p.id + '\')">编辑</button> ' +
                '<button class="btn-danger-sm" onclick="Admin.deleteProduct(\'' + p.id + '\')">删除</button></td></tr>';
        }).join('') || '<tr><td colspan="6" class="muted" style="text-align:center;padding:24px">暂无产品</td></tr>';
        $('pCount').textContent = S.products.length;
        $('productDirty').textContent = S.productsDirty ? '⚠️ 有未发布的修改' : (S.products.length ? '共 ' + S.products.length + ' 个产品' : '');
    }

    function editProduct(id) {
        S.editingProductId = id;
        S.pendingImage = null;
        var p = id ? S.products.find(function (x) { return x.id === id; }) : null;
        $('productModalTitle').textContent = p ? '编辑产品' : '新增产品';

        // 品牌 datalist
        $('brandOptions').innerHTML = (S.prodStatic.brandList || []).map(function (b) { return '<option value="' + esc(b) + '">'; }).join('');

        $('pNameZh').value = p ? (p.name && p.name['zh-TW']) || '' : '';
        $('pNameEn').value = p ? (p.name && p.name.en) || '' : '';
        $('pBrand').value = p ? p.brand : '';
        $('pModel').value = p ? p.model : '';
        $('pCategory').value = p ? p.category : 'router';
        $('pDescZh').value = p ? (p.desc && p.desc['zh-TW']) || '' : '';
        $('pDescEn').value = p ? (p.desc && p.desc.en) || '' : '';
        $('pImageUrl').value = p ? p.image : '';

        // 图片预览
        var img = $('pImgPreview');
        if (p && p.image) { img.src = p.image + '?t=' + Date.now() % 1e5; img.style.display = ''; }
        else { img.style.display = 'none'; }
        $('pImgNote').textContent = p && p.image ? '当前图片：' + p.image : '可选：上传图片自动处理为白底 400×300，或直接粘贴已存在的图片路径。';
        $('pImageFile').value = '';

        // 规格参数（specs 数组当作 "name | value" 解析，或纯文本数组）
        renderSpecRows(p ? (p.specs || []) : []);
        renderUseCaseRows(p ? (p.useCases || []) : []);

        $('productModal').style.display = 'flex';
    }

    // 规格参数：每行两个输入框（参数名 / 参数值）
    function renderSpecRows(specs) {
        var html = '';
        if (!specs.length) {
            html = kvRowHtml('', '');
        } else {
            specs.forEach(function (s) {
                // 兼容旧数据：如果是 "name | value" 形式拆分，否则整体作为参数名
                var sep = s.indexOf(' | ');
                if (sep > 0) html += kvRowHtml(s.slice(0, sep), s.slice(sep + 3));
                else html += kvRowHtml(s, '');
            });
        }
        $('pSpecsList').innerHTML = html;
    }
    function kvRowHtml(key, val) {
        return '<div class="kv-row">' +
            '<input class="kv-key" placeholder="参数名（如：端口）" value="' + esc(key) + '">' +
            '<input class="kv-val" placeholder="参数值（如：24 口千兆）" value="' + esc(val) + '">' +
            '<button class="kv-del" type="button" onclick="this.parentNode.remove()" title="删除">×</button>' +
            '</div>';
    }
    function addSpecRow() {
        var div = document.createElement('div');
        div.innerHTML = kvRowHtml('', '');
        $('pSpecsList').appendChild(div.firstChild);
    }

    // 适用场景：每行一个输入框
    function renderUseCaseRows(useCases) {
        var html = '';
        if (!useCases.length) html = '<div class="text-list-row"><input placeholder="场景（如：企业办公网络）" value=""><button class="kv-del" type="button" onclick="this.parentNode.remove()">×</button></div>';
        else {
            useCases.forEach(function (u) {
                html += '<div class="text-list-row"><input placeholder="场景" value="' + esc(u) + '"><button class="kv-del" type="button" onclick="this.parentNode.remove()">×</button></div>';
            });
        }
        $('pUseCasesList').innerHTML = html;
    }
    function addUseCaseRow() {
        var div = document.createElement('div');
        div.innerHTML = '<div class="text-list-row"><input placeholder="场景" value=""><button class="kv-del" type="button" onclick="this.parentNode.remove()">×</button></div>';
        $('pUseCasesList').appendChild(div.firstChild);
    }

    function onProductImagePick(input) {
        var f = input.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
            S.pendingImage = reader.result;
            $('pImgPreview').src = reader.result;
            $('pImgPreview').style.display = '';
            $('pImgNote').textContent = '已选择新图片，保存时自动上传。';
        };
        reader.readAsDataURL(f);
    }

    // 白底居中 400×300 处理
    function processImage(dataUrl) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                var cv = document.createElement('canvas');
                cv.width = 400; cv.height = 300;
                var ctx = cv.getContext('2d');
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, 400, 300);
                var scale = Math.min(400 / img.width, 300 / img.height);
                var w = img.width * scale, h = img.height * scale;
                ctx.drawImage(img, (400 - w) / 2, (300 - h) / 2, w, h);
                resolve(cv.toDataURL('image/jpeg', 0.88));
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }

    async function saveProduct() {
        var nameZh = $('pNameZh').value.trim();
        var brand = $('pBrand').value.trim();
        var model = $('pModel').value.trim();
        var descZh = $('pDescZh').value.trim();
        if (!nameZh) return toast('请填写产品名称', 'error');
        if (!brand) return toast('请填写品牌', 'error');
        if (!descZh) return toast('请填写产品描述', 'error');

        var isEdit = !!S.editingProductId;
        var id = isEdit ? S.editingProductId : (slug(brand) + '-' + slug(model || nameZh));
        if (!isEdit && S.products.some(function (p) { return p.id === id; })) id = id + '-' + (Date.now() % 1000);

        // 图片：URL 优先，否则处理上传，否则保留
        var imageUrl = $('pImageUrl').value.trim();
        var imagePath = imageUrl || ((isEdit && (S.products.find(function (x) { return x.id === id; }) || {}).image) || ('images/products/' + id + '.jpg'));

        if (S.pendingImage) {
            try {
                var processed = await processImage(S.pendingImage);
                var b64data = processed.split(',')[1];
                await ghPutImage('images/products/' + id + '.jpg', b64data, 'admin: upload product image ' + id);
                imagePath = 'images/products/' + id + '.jpg';
            } catch (e) {
                toast('图片上传失败（' + e.message + '），产品信息仍会保存', 'error');
            }
        }

        // 收集规格参数（key-value 拼接为 "name | value"，纯 key 也保留）
        var specs = [];
        $('pSpecsList').querySelectorAll('.kv-row').forEach(function (row) {
            var k = row.querySelector('.kv-key').value.trim();
            var v = row.querySelector('.kv-val').value.trim();
            if (k && v) specs.push(k + ' | ' + v);
            else if (k) specs.push(k);
        });

        // 收集适用场景
        var useCases = [];
        $('pUseCasesList').querySelectorAll('.text-list-row').forEach(function (row) {
            var v = row.querySelector('input').value.trim();
            if (v) useCases.push(v);
        });

        var item = {
            id: id, brand: brand,
            brandClass: 'brand-' + brand.toLowerCase().replace(/[^a-z0-9]/g, ''),
            category: $('pCategory').value, icon: '📦',
            model: model, image: imagePath,
            name: { 'zh-TW': nameZh, en: $('pNameEn').value.trim() },
            desc: { 'zh-TW': descZh, en: $('pDescEn').value.trim() },
            specs: specs,
            useCases: useCases
        };

        if (isEdit) {
            var i = S.products.findIndex(function (x) { return x.id === id; });
            S.products[i] = item;
        } else {
            if (S.prodStatic.brandList.indexOf(brand) < 0) {
                S.prodStatic.brandList.push(brand);
                S.prodStatic.brandColors[brand] = '#2563eb';
            }
            S.products.push(item);
        }
        S.productsDirty = true;
        closeModal('productModal');
        renderProducts();
        toast('已保存（点击「发布」按钮后上线）', 'success');
    }

    function deleteProduct(id) {
        var p = S.products.find(function (x) { return x.id === id; });
        if (!confirm('确定删除产品「' + ((p && p.name && p.name['zh-TW']) || id) + '」？\n（需点击「发布」后生效）')) return;
        S.products = S.products.filter(function (x) { return x.id !== id; });
        S.productsDirty = true;
        renderProducts();
    }

    // ==================== 新闻管理 ====================
    function renderNews() {
        var q = ($('newsSearch').value || '').toLowerCase();
        var sorted = S.news.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        var rows = sorted.filter(function (n) {
            var titleZh = (n.title && n.title['zh-TW']) || '';
            return !q || (titleZh + ' ' + n.category).toLowerCase().indexOf(q) >= 0;
        });
        $('newsRows').innerHTML = rows.map(function (n) {
            var titleZh = (n.title && n.title['zh-TW']) || '';
            var summaryZh = (n.summary && n.summary['zh-TW']) || '';
            return '<tr>' +
                '<td>' + esc(n.date) + '</td>' +
                '<td><span class="cat-badge">' + esc(NEWS_CATS[n.category] || n.category) + '</span></td>' +
                '<td><b>' + esc(titleZh) + '</b>' + (summaryZh ? '<div class="muted" style="margin-top:2px;font-size:12px">' + esc(summaryZh.slice(0, 80)) + (summaryZh.length > 80 ? '...' : '') + '</div>' : '') + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="Admin.editNews(\'' + n.id + '\')">编辑</button> ' +
                '<button class="btn-danger-sm" onclick="Admin.deleteNews(\'' + n.id + '\')">删除</button></td></tr>';
        }).join('') || '<tr><td colspan="4" class="muted" style="text-align:center;padding:24px">暂无新闻</td></tr>';
        $('nCount').textContent = S.news.length;
        $('newsDirty').textContent = S.newsDirty ? '⚠️ 有未发布的修改' : '';
    }

    function editNews(id) {
        S.editingNewsId = id;
        var n = id ? S.news.find(function (x) { return x.id === id; }) : null;
        $('newsModalTitle').textContent = n ? '编辑新闻' : '发布新闻';
        $('nDate').value = n ? n.date : todayStr();
        $('nCategory').value = n ? n.category : 'product';
        $('nTitleZh').value = n ? (n.title && n.title['zh-TW']) || '' : '';
        $('nTitleEn').value = n ? (n.title && n.title.en) || '' : '';
        $('nSummaryZh').value = n ? (n.summary && n.summary['zh-TW']) || '' : '';
        $('nSummaryEn').value = n ? (n.summary && n.summary.en) || '' : '';
        $('nContentZh').value = n ? (n.content && n.content['zh-TW']) || '' : '';
        $('nContentEn').value = n ? (n.content && n.content.en) || '' : '';
        $('nLink').value = n && n.link || '';
        $('newsModal').style.display = 'flex';
    }

    function saveNews() {
        var titleZh = $('nTitleZh').value.trim();
        if (!titleZh) return toast('请填写标题', 'error');
        var isEdit = !!S.editingNewsId;
        var id = isEdit ? S.editingNewsId : (slug($('nTitleEn').value || titleZh).slice(0, 60) || 'news-' + Date.now());
        if (!isEdit && S.news.some(function (n) { return n.id === id; })) id = id + '-' + (Date.now() % 1000);
        var item = {
            id: id, date: $('nDate').value || todayStr(), category: $('nCategory').value,
            title: { 'zh-TW': titleZh, en: $('nTitleEn').value.trim() },
            summary: { 'zh-TW': $('nSummaryZh').value.trim(), en: $('nSummaryEn').value.trim() },
            content: { 'zh-TW': $('nContentZh').value, en: $('nContentEn').value },
            link: $('nLink').value.trim()
        };
        if (isEdit) {
            var i = S.news.findIndex(function (x) { return x.id === id; });
            S.news[i] = item;
        } else {
            S.news.push(item);
        }
        S.newsDirty = true;
        closeModal('newsModal');
        renderNews();
        toast('已保存（点击「发布」按钮后上线）', 'success');
    }

    function deleteNews(id) {
        if (!confirm('确定删除这条新闻？\n（需点击「发布」后生效）')) return;
        S.news = S.news.filter(function (n) { return n.id !== id; });
        S.newsDirty = true;
        renderNews();
    }

    // ==================== 统计 (GoatCounter) ====================
    function gcBase() { return 'https://' + ($('gcCode').value.trim() || S.settings.gcCode) + '.goatcounter.com'; }
    async function gcGet(path) {
        var token = $('gcToken').value.trim() || S.settings.gcToken;
        var r = await fetch(gcBase() + '/api/v0/' + path, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!r.ok) throw new Error('GoatCounter ' + r.status + '（请检查站点代码与 Token）');
        return r.json();
    }
    function initAnalyticsTab() {
        var code = S.settings.gcCode || '';
        $('gcCode').value = code;
        $('gcToken').value = S.settings.gcToken || '';
        if (code && (S.settings.gcToken || $('gcToken').value.trim())) {
            $('gcStatsArea').style.display = '';
            loadAnalytics();
        } else {
            $('gcStatsArea').style.display = 'none';
        }
    }
    async function saveAnalytics() {
        var code = $('gcCode').value.trim();
        var token = $('gcToken').value.trim();
        S.settings.gcCode = code;
        S.settings.gcToken = token;
        saveSettings();
        if (!code || !token) return toast('请填写站点代码和 Token', 'error');
        $('gcStatsArea').style.display = '';
        loadAnalytics();
    }
    async function testAnalytics() {
        if (!$('gcToken').value.trim()) return toast('请先填写 API Token', 'error');
        try {
            await gcGet('stats/total?start=' + todayStr() + '&end=' + todayStr());
            toast('✅ GoatCounter 连接成功', 'success');
        } catch (e) {
            toast('❌ ' + e.message, 'error');
        }
    }
    async function loadAnalytics() {
        var days = parseInt($('gcRange').value) || 30;
        var end = todayStr();
        var start = new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
        $('gcStatus').textContent = '加载中...';
        try {
            var total = await gcGet('stats/total?start=' + start + '&end=' + end);
            var views = pick(total, ['views', 'total-views', 'pageviews']);
            var visitors = pick(total, ['visitors', 'total-visitors']);
            $('gcViews').textContent = views != null ? views : '-';
            $('gcVisitors').textContent = visitors != null ? visitors : '-';
            $('gcAvg').textContent = views != null && days ? Math.round(views / days) : '-';
            $('gcRangeLabel').textContent = days + ' 天';

            var pages = await gcGet('stats/paths?start=' + start + '&end=' + end);
            renderPages(pages);
            var browsers = await gcGet('stats/browsers?start=' + start + '&end=' + end);
            renderRank('gcBrowsers', browsers, function (x) { return x.browser || x.name; });
            var systems = await gcGet('stats/systems?start=' + start + '&end=' + end);
            renderRank('gcSystems', systems, function (x) { return x.system || x.name; });
            var locs = await gcGet('stats/locations?start=' + start + '&end=' + end);
            renderRank('gcLocations', Array.isArray(locs) ? locs : (locs && locs.statistics) || [], function (x) { return x.country || x.name || x.location; });
            $('gcStatus').textContent = '更新于 ' + new Date().toLocaleTimeString('zh-CN');
        } catch (e) {
            $('gcStatus').textContent = '加载失败：' + e.message;
        }
    }
    function pick(obj, keys) {
        if (Array.isArray(obj)) obj = obj[0] || {};
        for (var i = 0; i < keys.length; i++) if (obj[keys[i]] != null) return obj[keys[i]];
        return null;
    }
    function renderPages(items) {
        var rows = (Array.isArray(items) ? items : []);
        var durations = rows.filter(function (x) { return String(x.path || '').indexOf('duration-') === 0; });
        var pages = rows.filter(function (x) { return String(x.path || '').indexOf('duration-') !== 0; }).slice(0, 10);
        var order = ['0-10s', '10-30s', '30-60s', '1-3min', '3-10min', '10min+'];
        var dMap = {};
        durations.forEach(function (d) { dMap[String(d.path).replace('duration-', '')] = d.count; });
        var dTotal = Object.keys(dMap).reduce(function (a, k) { return a + dMap[k]; }, 0) || 1;
        $('gcDuration').innerHTML = order.map(function (b) {
            var v = dMap[b] || 0;
            var pct = Math.round(v / dTotal * 100);
            return '<div class="rank-row"><span class="rank-name">' + b + '</span>' +
                '<div class="rank-bar-bg"><div class="rank-bar" style="width:' + pct + '%"></div></div>' +
                '<span class="rank-count">' + v + ' (' + pct + '%)</span></div>';
        }).join('') || '<p class="muted">暂无停留时长数据（访客浏览一段时间后才会产生）</p>';
        renderRank('gcPages', pages, function (x) { return x.path; });
    }
    function renderRank(elId, rows, nameFn) {
        var el = $(elId);
        rows = (Array.isArray(rows) ? rows : []).slice(0, 10);
        if (!rows.length) { el.innerHTML = '<p class="muted">暂无数据</p>'; return; }
        var max = Math.max.apply(null, rows.map(function (r) { return r.count || 0; })) || 1;
        el.innerHTML = rows.map(function (r) {
            var v = r.count || 0;
            return '<div class="rank-row"><span class="rank-name">' + esc(nameFn(r) || '-') + '</span>' +
                '<div class="rank-bar-bg"><div class="rank-bar" style="width:' + (v / max * 100) + '%"></div></div>' +
                '<span class="rank-count">' + v + '</span></div>';
        }).join('');
    }

    // ==================== 设置 ====================
    function initSettings() {
        $('ghRepo').value = S.settings.repo || 'Qinglian168/helpyou-website';
        $('ghToken').value = S.settings.token || '';
    }
    async function saveSettingsBtn() {
        S.settings.repo = $('ghRepo').value.trim() || 'Qinglian168/helpyou-website';
        S.settings.token = $('ghToken').value.trim();
        saveSettings();
        toast('设置已保存到本机浏览器', 'success');
    }
    async function changePassword() {
        var p1 = $('newPass1').value, p2 = $('newPass2').value;
        if (p1.length < 6) return toast('密码至少 6 位', 'error');
        if (p1 !== p2) return toast('两次输入不一致', 'error');
        S.settings.passHash = await sha256(p1);
        saveSettings();
        $('newPass1').value = $('newPass2').value = '';
        toast('密码已更新', 'success');
    }

    // ==================== Modal ====================
    function closeModal(id) { $(id).style.display = 'none'; }

    // ==================== Boot ====================
    async function boot() {
        initSettings();
        try {
            await Promise.all([loadAllData(), loadConfig()]);
            renderDashboard();
            renderProducts();
            renderNews();
        } catch (e) {
            toast('数据加载失败：' + e.message, 'error');
        }
    }

    // ==================== Init ====================
    loadSettings();
    document.addEventListener('DOMContentLoaded', function () {
        if (!S.settings.passHash) {
            $('loginHint').textContent = '首次使用：请设置管理密码（至少 6 位）';
        }
        $('loginOverlay').style.display = 'flex';
        $('loginPass').focus();
    });

    // 公开 API
    return {
        doLogin: doLogin, doLogout: doLogout,
        switchTab: switchTab,
        // dashboard
        renderDashboard: renderDashboard,
        // appearance
        initAppearanceTab: initAppearanceTab, publishAppearance: publishAppearance,
        resetAppearance: resetAppearance, syncColor: syncColor,
        // texts
        initTextsTab: initTextsTab, renderTexts: renderTexts,
        onTextChange: onTextChange, publishTexts: publishTexts,
        loadTextsFromI18n: loadTextsFromI18n,
        // products
        renderProducts: renderProducts, editProduct: editProduct, saveProduct: saveProduct,
        deleteProduct: deleteProduct, publishProducts: publishProducts, downloadProducts: downloadProducts,
        onProductImagePick: onProductImagePick,
        addSpecRow: addSpecRow, addUseCaseRow: addUseCaseRow,
        // news
        editNews: editNews, saveNews: saveNews, deleteNews: deleteNews,
        publishNews: publishNews, downloadNews: downloadNews, renderNews: renderNews,
        // analytics
        saveAnalytics: saveAnalytics, testAnalytics: testAnalytics, loadAnalytics: loadAnalytics,
        // settings
        saveSettings: saveSettingsBtn, testGithub: testGithub, changePassword: changePassword,
        closeModal: closeModal
    };
})();