/* ============================================
   HELPYOU GROUP - Admin Panel
   纯前端后台：GitHub API 直接发布 + GoatCounter 统计
   ============================================ */
var Admin = (function () {
    'use strict';

    // ==================== State ====================
    var S = {
        settings: {},          // localStorage: repo, token, gcToken, passHash
        cfg: null,             // siteConfig 副本（含未发布的草稿）
        products: [],          // productsData 副本
        news: [],              // newsData 副本
        i18nData: null,        // i18nData 副本（只读参考）
        prodStatic: {},        // brandList / brandColors / brandLogos
        productsDirty: false,
        newsDirty: false,
        textLang: 'zh-TW',
        editingProductId: null,
        editingNewsId: null,
        pendingImage: null     // {productId, dataUrl, base64}
    };

    var LS_KEY = 'hy_admin_settings';

    // ==================== Utils ====================
    function $(id) { return document.getElementById(id); }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
    function toast(msg, type) {
        var el = $('toast');
        el.textContent = msg;
        el.className = 'toast show ' + (type || '');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.className = 'toast'; }, 3200);
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
    function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
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
            // 首次使用：设置密码
            if (pass.length < 6) { $('loginHint').textContent = '首次使用：请设置至少 6 位的管理密码'; return; }
            S.settings.passHash = await sha256(pass);
            saveSettings();
        } else if (await sha256(pass) !== S.settings.passHash) {
            $('loginHint').textContent = '密码错误，请重试';
            $('loginPass').value = '';
            return;
        }
        $('loginOverlay').style.display = 'none';
        $('app').style.display = 'flex';
        boot();
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
        if (!S.settings.token) throw new Error('尚未配置 GitHub Token，请到「设置」页填写');
        var sha = null;
        try { sha = (await gh('contents/' + path)).sha; } catch (e) { /* 新文件 */ }
        return gh('contents/' + path, {
            method: 'PUT',
            body: JSON.stringify({ message: message, content: b64(content), sha: sha })
        });
    }
    async function testGithub() {
        $('ghTestResult').textContent = '测试中...';
        try {
            var repo = (await gh(''));
            $('ghTestResult').innerHTML = '✅ 连接成功：' + esc(repo.full_name) + '（权限：' + (S.settings.token ? '读写' : '只读/未配置 Token') + '）';
        } catch (e) {
            $('ghTestResult').innerHTML = '❌ ' + esc(e.message);
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
        var proCode = await fetchText('js/products.js');
        var d = sandboxEval(proCode, ['productsData', 'brandList', 'brandColors', 'brandLogos']);
        S.products = d.productsData || [];
        S.prodStatic = { brandList: d.brandList || [], brandColors: d.brandColors || {}, brandLogos: d.brandLogos || {} };

        var newsCode = await fetchText('js/news.js');
        var nd = sandboxEval(newsCode, ['newsData']);
        S.news = nd.newsData || [];
        // 捕获 news.js 前后静态部分（头注释 + 渲染函数），发布时原样保留
        var nIdx = newsCode.indexOf('var newsData');
        var nEnd = newsCode.indexOf('\n];', nIdx);
        if (nIdx < 0 || nEnd < 0) throw new Error('news.js 结构无法解析');
        S.newsPrefix = newsCode.slice(0, nIdx);
        S.newsSuffix = newsCode.slice(nEnd + 3);

        var cfgCode = await fetchText('js/config.js');
        S.cfg = sandboxEval(cfgCode, ['siteConfig']).siteConfig;

        var i18nCode = await fetchText('js/i18n.js');
        S.i18nData = sandboxEval(i18nCode, ['i18nData']).i18nData || {};

        S.productsDirty = false; S.newsDirty = false;
        // 深拷贝保护：编辑草稿直接改 S.cfg / S.products / S.news，发布时才提交
    }

    // ==================== 序列化 ====================
    function serializeConfig() {
        var c = JSON.parse(JSON.stringify(S.cfg)); // 深拷贝
        if (c.analytics) delete c.analytics.gcToken; // Token 绝不写入公开文件
        c._meta = { lastUpdated: new Date().toISOString(), updatedBy: 'admin' };
        return '/* ============================================\n' +
            '   HELPYOU GROUP - Site Config\n' +
            '   此文件由后台管理系统 (admin.html) 自动生成/更新\n' +
            '   包含：主题颜色、布局、文字覆盖、统计设置\n' +
            '   ============================================ */\n\n' +
            'var siteConfig = ' + JSON.stringify(c, null, 4) + ';\n\nwindow.siteConfig = siteConfig;\n';
    }
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
        // 保留原 news.js 中的所有渲染函数，只重新生成数据部分
        var prefix = S.newsPrefix || '';
        var suffix = S.newsSuffix || '';
        if (!prefix || suffix === undefined) throw new Error('news.js 结构解析失败，请刷新页面重试');
        return prefix + 'var newsData = ' + JSON.stringify(S.news, null, 4) + ';\n\n' + suffix;
    }

    // ==================== Tabs ====================
    function switchTab(name) {
        document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
        var panel = $('tab-' + name);
        if (panel) panel.classList.add('active');
        var nav = document.querySelector('.nav-item[data-tab="' + name + '"]');
        if (nav) nav.classList.add('active');
        if (name === 'dashboard') loadDashboard();
        if (name === 'analytics') initAnalyticsTab();
    }

    // ==================== Dashboard ====================
    async function loadDashboard() {
        $('dashProducts').textContent = S.products.length;
        $('dashNews').textContent = S.news.length;
        loadCommits();
        if (S.cfg && S.cfg.analytics && S.cfg.analytics.enabled && S.cfg.analytics.gcCode && S.settings.gcToken) {
            loadDashboardStats();
        } else {
            $('dashGcHint').style.display = '';
        }
    }
    async function loadCommits() {
        try {
            var commits = await gh('commits?per_page=6');
            $('dashCommits').innerHTML = commits.map(function (c) {
                return '<div class="rank-row"><span class="rank-name">' + esc(c.commit.message.split('\n')[0]) + '</span><span class="muted">' +
                    new Date(c.commit.author.date).toLocaleString('zh-CN') + '</span></div>';
            }).join('');
        } catch (e) {
            $('dashCommits').innerHTML = '<p class="muted">无法加载提交记录：' + esc(e.message) + '</p>';
        }
    }
    async function loadDashboardStats() {
        $('dashGcHint').style.display = 'none';
        try {
            var end = todayStr();
            var start = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
            var data = await gcGet('stats/total?start=' + start + '&end=' + end);
            var views = pick(data, ['views', 'total-views', 'pageviews']);
            $('dashViews7d').textContent = views != null ? views : '-';
            var today = await gcGet('stats/total?start=' + end + '&end=' + end);
            $('dashViewsToday').textContent = pick(today, ['views', 'total-views', 'pageviews']) || 0;
            // hits 图
            var hits = await gcGet('stats/hits?start=' + start + '&end=' + end + '&daily=true');
            renderHitsChart(hits);
        } catch (e) {
            $('dashGcHint').style.display = '';
            $('dashGcHint').textContent = '统计加载失败：' + e.message;
        }
    }
    function pick(obj, keys) {
        if (Array.isArray(obj)) obj = obj[0] || {};
        for (var i = 0; i < keys.length; i++) if (obj[keys[i]] != null) return obj[keys[i]];
        return null;
    }
    function renderHitsChart(hits) {
        var el = $('dashHitsChart');
        el.innerHTML = '';
        var rows = [];
        if (Array.isArray(hits)) rows = hits;
        else if (hits && hits.daily) rows = Object.keys(hits.daily).map(function (d) { return Object.assign({ day: d }, hits.daily[d]); });
        if (!rows.length) { el.innerHTML = '<p class="muted">暂无数据</p>'; return; }
        var max = Math.max.apply(null, rows.map(function (r) { return r.count || r.views || 0; })) || 1;
        rows.forEach(function (r) {
            var v = r.count || r.views || 0;
            var div = document.createElement('div');
            div.className = 'bar';
            div.style.height = Math.max(2, v / max * 100) + '%';
            div.innerHTML = '<span class="tip">' + (r.day || '') + '：' + v + ' 次浏览</span>';
            el.appendChild(div);
        });
    }

    // ==================== Appearance ====================
    function initAppearance() {
        var c = S.cfg.colors || {}, l = S.cfg.layout || {};
        bindColor('cPrimary', 'cPrimaryHex', c.primary);
        bindColor('cAccent', 'cAccentHex', c.accent);
        bindColor('cBg', 'cBgHex', c.bgLight);
        bindColor('cBorder', 'cBorderHex', c.border);
        $('cRadius').value = parseInt(l.radius) || 12;
        $('radiusVal').textContent = '(' + ($('cRadius').value) + 'px)';
        $('previewFrame').onload = function () { applyPreviewTheme(); };
    }
    function bindColor(pid, hid, val) {
        var p = $(pid), h = $(hid);
        if (val) { p.value = val; h.value = val; }
        p.oninput = function () { h.value = p.value; onColorChange(); };
        h.oninput = function () { if (/^#[0-9a-f]{6}$/i.test(h.value)) { p.value = h.value; onColorChange(); } };
    }
    function onColorChange() { S.cfg.colors = S.cfg.colors || {}; S.cfg.colors.primary = $('cPrimaryHex').value || ''; S.cfg.colors.accent = $('cAccentHex').value || ''; S.cfg.colors.bgLight = $('cBgHex').value || ''; S.cfg.colors.border = $('cBorderHex').value || ''; applyPreviewTheme(); }
    function onRadius(v) { $('radiusVal').textContent = '(' + v + 'px)'; (S.cfg.layout = S.cfg.layout || {}).radius = v + 'px'; applyPreviewTheme(); }
    function clearColor(k) {
        var map = { primary: 'cPrimaryHex', accent: 'cAccentHex', bgLight: 'cBgHex', border: 'cBorderHex' };
        $(map[k]).value = '';
        S.cfg.colors[k] = '';
        applyPreviewTheme();
    }
    function applyPreviewTheme() {
        var f = $('previewFrame');
        if (!f || !f.contentWindow) return;
        try {
            var root = f.contentWindow.document.documentElement.style;
            var c = S.cfg.colors || {};
            if (c.primary) { root.setProperty('--primary', c.primary); root.setProperty('--primary-light', c.primary); }
            if (c.accent) { root.setProperty('--accent', c.accent); root.setProperty('--accent-light', c.accent); root.setProperty('--accent-dark', c.accent); }
            if (c.bgLight) root.setProperty('--bg-light', c.bgLight);
            if (c.border) root.setProperty('--border', c.border);
            var l = S.cfg.layout || {};
            if (l.radius) { root.setProperty('--radius-btn', l.radius); root.setProperty('--radius-card', l.radius); }
        } catch (e) { /* 跨域时忽略 */ }
    }

    // ==================== 文字内容 ====================
    function switchTextLang(lang) {
        S.textLang = lang;
        document.querySelectorAll('.lang-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.lang === lang); });
        renderTextList();
    }
    function renderTextList() {
        var q = ($('textSearch').value || '').toLowerCase();
        var lang = S.textLang;
        var dict = (S.i18nData && S.i18nData[lang]) || {};
        var overrides = (S.cfg.texts && S.cfg.texts[lang]) || {};
        var keys = Object.keys(dict).filter(function (k) {
            if (q && k.toLowerCase().indexOf(q) < 0 && String(dict[k]).toLowerCase().indexOf(q) < 0) return false;
            return true;
        });
        $('textList').innerHTML = keys.slice(0, 400).map(function (k) {
            var val = overrides[k] != null ? overrides[k] : dict[k];
            var dirty = overrides[k] != null && overrides[k] !== '' && overrides[k] !== dict[k];
            return '<div class="text-item"><div class="text-key">' + esc(k) + '</div>' +
                '<input data-key="' + esc(k) + '" value="' + esc(val) + '"' + (dirty ? ' class="dirty"' : '') +
                ' oninput="Admin.onTextChange(this)"></div>';
        }).join('') || '<p class="muted">没有匹配的文字项</p>';
        updateTextDirty();
    }
    function onTextChange(input) {
        var k = input.dataset.key, v = input.value;
        S.cfg.texts = S.cfg.texts || {}; S.cfg.texts[S.textLang] = S.cfg.texts[S.textLang] || {};
        if (v === ((S.i18nData[S.textLang] || {})[k] || '')) delete S.cfg.texts[S.textLang][k];
        else S.cfg.texts[S.textLang][k] = v;
        input.classList.toggle('dirty', !!S.cfg.texts[S.textLang][k]);
        updateTextDirty();
    }
    function updateTextDirty() {
        var n = ['zh-TW', 'en'].reduce(function (acc, l) { return acc + Object.keys((S.cfg.texts || {})[l] || {}).length; }, 0);
        $('textDirtyCount').textContent = n + ' 处修改';
    }
    function resetTexts() {
        S.cfg.texts = { 'zh-TW': {}, 'en': {} };
        renderTextList();
        toast('已重置未发布的文字修改', 'success');
    }

    // ==================== 发布 ====================
    async function publishConfig() {
        try {
            await ghPut('js/config.js', serializeConfig(), 'admin: update site config (theme/texts/analytics)');
            toast('✅ 配置已发布，网站 1-2 分钟后生效', 'success');
        } catch (e) { toast('发布失败：' + e.message, 'error'); }
    }
    function downloadConfig() { download('config.js', serializeConfig()); }
    async function publishProducts() {
        if (!S.products.length) return toast('没有产品数据', 'error');
        try {
            await ghPut('js/products.js', serializeProducts(), 'admin: update products (' + S.products.length + ' items)');
            S.productsDirty = false; updateDirtyLabels();
            toast('✅ 产品已发布', 'success');
        } catch (e) { toast('发布失败：' + e.message, 'error'); }
    }
    function downloadProducts() { download('products.js', serializeProducts()); }
    async function publishNews() {
        if (!S.news.length) return toast('没有新闻数据', 'error');
        try {
            await ghPut('js/news.js', serializeNews(), 'admin: update news (' + S.news.length + ' items)');
            S.newsDirty = false; updateDirtyLabels();
            toast('✅ 新闻已发布', 'success');
        } catch (e) { toast('发布失败：' + e.message, 'error'); }
    }
    function downloadNews() { download('news.js', serializeNews()); }
    function updateDirtyLabels() {
        $('productDirty').textContent = S.productsDirty ? '⚠️ 有未发布的修改' : '与线上一致';
        $('newsDirty').textContent = S.newsDirty ? '⚠️ 有未发布的修改' : '与线上一致';
    }

    // ==================== 产品管理 ====================
    var CATEGORIES = { router: '路由器', switch: '交换机', firewall: '防火墙', wireless: '无线 AP', server: '服务器', voice: '语音通讯', security: '安全设备' };
    function renderProducts() {
        var q = ($('productSearch').value || '').toLowerCase();
        var rows = S.products.filter(function (p) {
            return !q || (p.brand + ' ' + p.model + ' ' + (p.name && p.name['zh-TW'] || '')).toLowerCase().indexOf(q) >= 0;
        });
        $('productRows').innerHTML = rows.map(function (p) {
            return '<tr>' +
                '<td>' + (p.image ? '<img class="img-thumb" src="' + esc(p.image) + '?t=' + Date.now() % 1e5 + '" loading="lazy">' : '-') + '</td>' +
                '<td><b>' + esc(p.brand) + '</b></td>' +
                '<td>' + esc(p.model) + '</td>' +
                '<td><span class="cat-badge">' + esc((CATEGORIES[p.category] || p.category)) + '</span></td>' +
                '<td>' + esc(p.name && (p.name['zh-TW'] || p.name.en) || '') + '</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="Admin.editProduct(\'' + p.id + '\')">编辑</button> ' +
                '<button class="btn-danger-sm" onclick="Admin.deleteProduct(\'' + p.id + '\')">删除</button></td></tr>';
        }).join('') || '<tr><td colspan="6" class="muted">无匹配产品</td></tr>';
        updateDirtyLabels();
    }
    function editProduct(id) {
        S.editingProductId = id;
        S.pendingImage = null;
        var p = id ? S.products.find(function (x) { return x.id === id; }) : null;
        $('productModalTitle').textContent = p ? '编辑产品 - ' + p.model : '新增产品';
        // 品牌下拉
        $('pBrand').innerHTML = S.prodStatic.brandList.map(function (b) { return '<option' + (p && p.brand === b ? ' selected' : '') + '>' + esc(b) + '</option>'; }).join('');
        $('pModel').value = p ? p.model : '';
        $('pCategory').value = p ? p.category : 'router';
        $('pIcon').value = p ? p.icon : '📦';
        $('pNameZh').value = p && p.name ? p.name['zh-TW'] : '';
        $('pNameEn').value = p && p.name ? p.name.en : '';
        $('pDescZh').value = p && p.desc ? p.desc['zh-TW'] : '';
        $('pDescEn').value = p && p.desc ? p.desc.en : '';
        $('pSpecs').value = p ? (p.specs || []).join('\n') : '';
        var img = $('pImgPreview');
        if (p && p.image) { img.src = p.image + '?t=' + Date.now() % 1e5; img.style.display = ''; } else { img.style.display = 'none'; }
        $('pImgNote').textContent = p && p.image ? '当前图片：' + p.image : '可选：选择图片后，保存时自动上传并处理为白底 400×300。';
        $('pImageFile').value = '';
        $('productModal').style.display = 'flex';
    }
    function onProductImagePick(input) {
        var f = input.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
            S.pendingImage = reader.result; // dataURL
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
        var brand = $('pBrand').value, model = $('pModel').value.trim();
        if (!model) return toast('请填写型号', 'error');
        var isEdit = !!S.editingProductId;
        var id = isEdit ? S.editingProductId : (slug(brand) + '-' + slug(model) || slug(model));
        if (!isEdit && S.products.some(function (p) { return p.id === id; })) id = id + '-' + Date.now() % 1000;

        var imagePath = (isEdit && S.products.find(function (x) { return x.id === id; }).image) || ('images/products/' + id + '.jpg');

        // 若选择了新图片：处理 + 上传
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

        var specs = $('pSpecs').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
        var item = {
            id: id, brand: brand,
            brandClass: 'brand-' + brand.toLowerCase().replace(/[^a-z0-9]/g, ''),
            category: $('pCategory').value, icon: $('pIcon').value || '📦',
            model: model, image: imagePath,
            name: { 'zh-TW': $('pNameZh').value, 'en': $('pNameEn').value },
            desc: { 'zh-TW': $('pDescZh').value, 'en': $('pDescEn').value },
            specs: specs
        };
        if (isEdit) {
            var i = S.products.findIndex(function (x) { return x.id === id; });
            S.products[i] = item;
        } else {
            // 新品牌自动补 brandList / brandColors
            if (S.prodStatic.brandList.indexOf(brand) < 0) {
                S.prodStatic.brandList.push(brand);
                S.prodStatic.brandColors[brand] = '#2563eb';
            }
            S.products.push(item);
        }
        S.productsDirty = true;
        closeModal('productModal');
        renderProducts();
        toast('已保存（记得点击「发布」按钮上线）', 'success');
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
    function deleteProduct(id) {
        if (!confirm('确定删除产品 ' + id + '？（需点击「发布」后生效）')) return;
        S.products = S.products.filter(function (p) { return p.id !== id; });
        S.productsDirty = true;
        renderProducts();
    }

    // ==================== 新闻管理 ====================
    function renderNews() {
        var sorted = S.news.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        $('newsRows').innerHTML = sorted.map(function (n) {
            var catName = { product: '产品资讯', company: '公司动态', industry: '行业趋势' }[n.category] || n.category;
            return '<tr><td>' + esc(n.date) + '</td>' +
                '<td><span class="cat-badge">' + catName + '</span></td>' +
                '<td><b>' + esc(n.title && (n.title['zh-TW'] || n.title.en)) + '</b></td>' +
                '<td class="muted">' + esc(String(n.summary && (n.summary['zh-TW'] || '')).slice(0, 60)) + '...</td>' +
                '<td><button class="btn btn-sm btn-ghost" onclick="Admin.editNews(\'' + n.id + '\')">编辑</button> ' +
                '<button class="btn-danger-sm" onclick="Admin.deleteNews(\'' + n.id + '\')">删除</button></td></tr>';
        }).join('') || '<tr><td colspan="5" class="muted">暂无新闻</td></tr>';
        updateDirtyLabels();
    }
    function editNews(id) {
        S.editingNewsId = id;
        var n = id ? S.news.find(function (x) { return x.id === id; }) : null;
        $('newsModalTitle').textContent = n ? '编辑新闻' : '发布新闻';
        $('nDate').value = n ? n.date : todayStr();
        $('nCategory').value = n ? n.category : 'product';
        $('nTitleZh').value = n ? n.title['zh-TW'] : '';
        $('nTitleEn').value = n ? n.title.en : '';
        $('nSummaryZh').value = n ? n.summary['zh-TW'] : '';
        $('nSummaryEn').value = n ? n.summary.en : '';
        $('nContentZh').value = n ? n.content['zh-TW'] : '';
        $('nContentEn').value = n ? n.content.en : '';
        $('nLink').value = n && n.link || '';
        $('newsModal').style.display = 'flex';
    }
    function saveNews() {
        var titleZh = $('nTitleZh').value.trim();
        if (!titleZh) return toast('请填写标题', 'error');
        var isEdit = !!S.editingNewsId;
        var id = isEdit ? S.editingNewsId : (slug($('nTitleEn').value || titleZh).slice(0, 60) || 'news-' + Date.now());
        if (!isEdit && S.news.some(function (n) { return n.id === id; })) id = id + '-' + Date.now() % 1000;
        var item = {
            id: id, date: $('nDate').value || todayStr(), category: $('nCategory').value,
            title: { 'zh-TW': titleZh, 'en': $('nTitleEn').value },
            summary: { 'zh-TW': $('nSummaryZh').value, 'en': $('nSummaryEn').value },
            content: { 'zh-TW': $('nContentZh').value, 'en': $('nContentEn').value },
            link: $('nLink').value || ''
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
        toast('已保存（记得点击「发布」按钮上线）', 'success');
    }
    function deleteNews(id) {
        if (!confirm('确定删除这条新闻？（需点击「发布」后生效）')) return;
        S.news = S.news.filter(function (n) { return n.id !== id; });
        S.newsDirty = true;
        renderNews();
    }

    // ==================== 图片管理 ====================
    async function uploadImage(input) {
        var f = input.files[0];
        if (!f) return;
        if (!S.settings.token) return toast('请先在「设置」中配置 GitHub Token', 'error');
        $('uploadStatus').textContent = '处理并上传中...';
        try {
            var dataUrl = await new Promise(function (res, rej) {
                var r = new FileReader();
                r.onload = function () { res(r.result); };
                r.onerror = rej;
                r.readAsDataURL(f);
            });
            var processed = await processImage(dataUrl);
            var name = f.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase() + '.jpg';
            await ghPutImage('images/products/' + name, processed.split(',')[1], 'admin: upload image ' + name);
            $('uploadStatus').textContent = '✅ 已上传：images/products/' + name;
            loadImages();
        } catch (e) {
            $('uploadStatus').textContent = '❌ 上传失败：' + e.message;
        }
    }
    async function loadImages() {
        var grid = $('imageGrid');
        grid.innerHTML = '<p class="muted">加载中...</p>';
        try {
            var files = await gh('contents/images/products');
            grid.innerHTML = files.filter(function (f) { return f.type === 'file'; }).map(function (f) {
                return '<div class="image-cell"><img src="' + f.download_url + '" loading="lazy"><div class="img-name">' + esc(f.name) + '</div></div>';
            }).join('');
        } catch (e) {
            grid.innerHTML = '<p class="muted">无法加载：' + esc(e.message) + '（需要配置 Token）</p>';
        }
    }

    // ==================== 统计 (GoatCounter) ====================
    function gcBase() { return 'https://' + (S.cfg.analytics.gcCode || S.settings.gcCode) + '.goatcounter.com'; }
    async function gcGet(path) {
        var r = await fetch(gcBase() + '/api/v0/' + path, {
            headers: { 'Authorization': 'Bearer ' + S.settings.gcToken }
        });
        if (!r.ok) throw new Error('GoatCounter ' + r.status + '（请检查站点代码与 Token）');
        return r.json();
    }
    function initAnalyticsTab() {
        var code = S.cfg.analytics && S.cfg.analytics.gcCode || '';
        $('gcCode').value = code;
        $('gcToken').value = S.settings.gcToken || '';
        if (code && S.settings.gcToken) { $('gcStatsArea').style.display = ''; loadAnalytics(); }
        else { $('gcStatsArea').style.display = 'none'; }
    }
    async function saveAnalytics() {
        var code = $('gcCode').value.trim();
        S.settings.gcCode = code;
        S.settings.gcToken = $('gcToken').value.trim();
        saveSettings();
        S.cfg.analytics = S.cfg.analytics || {};
        S.cfg.analytics.enabled = !!code;
        S.cfg.analytics.gcCode = code;
        // gcToken 不写入 config.js（公开文件）
        try {
            await publishConfig();
            $('gcStatsArea').style.display = '';
            loadAnalytics();
        } catch (e) {
            toast('Token 已保存本机，但发布到网站失败：' + e.message, 'error');
        }
    }
    async function testAnalytics() {
        if (!$('gcToken').value.trim()) return toast('请先填写 API Token', 'error');
        S.settings.gcCode = $('gcCode').value.trim();
        S.settings.gcToken = $('gcToken').value.trim();
        saveSettings();
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
    function renderPages(items) {
        var rows = (Array.isArray(items) ? items : []);
        // 分离停留时长事件与页面
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
        initAppearance();
        try {
            await loadAllData();
            renderProducts();
            renderNews();
            renderTextList();
            initAppearance(); // cfg 加载后回填颜色控件
            loadDashboard();
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
        doLogin: doLogin,
        switchTab: switchTab,
        // appearance
        clearColor: clearColor, onRadius: onRadius,
        publishConfig: publishConfig, downloadConfig: downloadConfig,
        // texts
        switchTextLang: switchTextLang, renderTextList: renderTextList,
        onTextChange: onTextChange, resetTexts: resetTexts,
        // products
        renderProducts: renderProducts, editProduct: editProduct, saveProduct: saveProduct,
        deleteProduct: deleteProduct, publishProducts: publishProducts, downloadProducts: downloadProducts,
        onProductImagePick: onProductImagePick,
        // news
        editNews: editNews, saveNews: saveNews, deleteNews: deleteNews,
        publishNews: publishNews, downloadNews: downloadNews,
        // images
        uploadImage: uploadImage, loadImages: loadImages,
        // analytics
        saveAnalytics: saveAnalytics, testAnalytics: testAnalytics, loadAnalytics: loadAnalytics,
        // settings
        saveSettings: saveSettingsBtn, testGithub: testGithub, changePassword: changePassword,
        closeModal: closeModal
    };
})();
