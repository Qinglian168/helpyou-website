/* ============================================
   HELPYOU GROUP - Main JavaScript
   ============================================ */

// ==================== Shared Header & Footer ====================
function injectHeader() {
    var brands = window.brandList || ['Cisco', 'Fortinet', 'Dell', 'Juniper', 'Aruba', 'HPE', 'Huawei', 'H3C'];
    var brandNav = brands.slice(0, 8).map(function(b) {
        return '<li><a href="products.html?brand=' + encodeURIComponent(b) + '" class="nav-link" data-page="brand-' + b + '">' + b + '</a></li>';
    }).join('');

    var header = `
    <header class="header" id="header">
        <div class="header-container">
            <a href="index.html" class="logo">
                <img src="images/helpyou-logo.png" alt="HELPYOU GROUP" class="logo-img">
                <div class="logo-text">
                    <span class="logo-main">HELPYOU</span>
                    <span class="logo-sub">GROUP CO., LTD.</span>
                </div>
            </a>
            <ul class="nav-menu" id="navMenu">
                <li><a href="index.html" class="nav-link" data-page="home" data-i18n="nav_home">首頁</a></li>
                <li><a href="products.html" class="nav-link" data-page="products" data-i18n="nav_products">產品</a></li>
                <li><a href="index.html#solutions" class="nav-link" data-page="solutions" data-i18n="nav_solutions">解決方案</a></li>
                <li><a href="index.html#news" class="nav-link" data-page="news" data-i18n="nav_news">新聞</a></li>
                <li><a href="about.html" class="nav-link" data-page="about" data-i18n="nav_about">關於我們</a></li>
                <li><a href="contact.html" class="nav-link" data-page="contact" data-i18n="nav_contact">聯絡我們</a></li>
            </ul>
            <div class="header-actions">
                <button class="lang-toggle" id="langToggle" onclick="toggleLang()">
                    <span id="langLabel">English</span>
                </button>
                <a href="contact.html" class="btn-quote" data-i18n="nav_getquote">獲取報價</a>
                <button class="mobile-menu-btn" id="mobileMenuBtn" onclick="toggleMobileMenu()">&#9776;</button>
            </div>
        </div>
    </header>`;

    var headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = header;
    }
}

function injectFooter() {
    var brands = window.brandList || ['Cisco', 'Fortinet', 'Dell', 'Juniper', 'Aruba', 'HPE', 'Huawei', 'H3C'];
    var footerBrandSpans = brands.slice(0, 8).map(function(b) {
        return '<span class="brand-marquee-item" style="font-size: 1rem;">' + b + '</span>';
    }).join('');

    var footerBrandLinks = brands.slice(0, 8).map(function(b) {
        return '<li><a href="products.html?brand=' + encodeURIComponent(b) + '">' + b + '</a></li>';
    }).join('');

    var footer = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-grid">
                <div>
                    <div class="footer-brand">
                        <img src="images/helpyou-logo.png" alt="HELPYOU GROUP" class="logo-img">
                        <div class="logo-text">
                            <span class="logo-main">HELPYOU GROUP</span>
                            <span class="logo-sub">CO., LTD.</span>
                        </div>
                    </div>
                    <p class="footer-desc" data-i18n="footer_about">鴻鵬集團有限公司是專業的企業級網路設備分銷商，提供全方位的網路通訊解決方案與技術支援服務。</p>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        ` + footerBrandSpans + `
                    </div>
                </div>
                <div>
                    <h4 data-i18n="footer_products">產品中心</h4>
                    <ul class="footer-links">
                        ` + footerBrandLinks + `
                    </ul>
                </div>
                <div>
                    <h4 data-i18n="footer_company">公司</h4>
                    <ul class="footer-links">
                        <li><a href="about.html" data-i18n="nav_about">關於我們</a></li>
                        <li><a href="index.html#solutions" data-i18n="nav_solutions">解決方案</a></li>
                        <li><a href="index.html#news" data-i18n="nav_news">新聞</a></li>
                        <li><a href="contact.html" data-i18n="nav_contact">聯絡我們</a></li>
                        <li><a href="index.html#why" data-i18n="why_title">為什麼選擇我們</a></li>
                    </ul>
                </div>
                <div>
                    <h4 data-i18n="footer_contact">聯絡我們</h4>
                    <div class="footer-contact-item">
                        <span class="icon">&#128205;</span>
                        <span data-i18n="contact_address_value">九龍新蒲崗太子道東704號新時代工貿商業中心31樓5-11室A03</span>
                    </div>
                    <div class="footer-contact-item">
                        <span class="icon">&#9993;&#65039;</span>
                        <span><a href="mailto:info@helpyouinfo.com" style="color: rgba(255,255,255,0.6);">info@helpyouinfo.com</a></span>
                    </div>
                    <div class="footer-contact-item">
                        <span class="icon">&#128222;</span>
                        <span>086-13713704797</span>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <span data-i18n="footer_rights">© 2026 鴻鵬集團有限公司. 保留所有權利.</span>
                <div>
                    <a href="#" style="color: rgba(255,255,255,0.6); text-decoration: none; margin-right: 20px;" data-i18n="footer_privacy">隱私政策</a>
                    <a href="#" style="color: rgba(255,255,255,0.6); text-decoration: none;" data-i18n="footer_terms">服務條款</a>
                </div>
            </div>
        </div>
    </footer>`;

    var footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footer;
    }
}

// ==================== Language Toggle ====================
function toggleLang() {
    var newLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    setLang(newLang);
    var langLabel = document.getElementById('langLabel');
    if (langLabel) langLabel.textContent = t('lang_label');
}

// ==================== Mobile Menu ====================
function toggleMobileMenu() {
    var navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.toggle('active');
}

// ==================== Active Nav ====================
function updateActiveNav() {
    var currentPage = document.body.getAttribute('data-page') || 'home';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ==================== Scroll Header Effect ====================
function handleScroll() {
    var header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// ==================== Products Page Rendering ====================
var activeBrandFilter = 'all';
var activeCategoryFilter = 'all';

function renderProducts() {
    var grid = document.getElementById('productGrid');
    if (!grid) return;

    var data = window.productsData || productsData;
    var filtered = data;

    if (activeBrandFilter !== 'all') {
        filtered = filtered.filter(function(p) { return p.brand === activeBrandFilter; });
    }
    if (activeCategoryFilter !== 'all') {
        filtered = filtered.filter(function(p) { return p.category === activeCategoryFilter; });
    }

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="no-results">' + t('no_results') + '</div>';
        var rc = document.getElementById('resultsCount');
        if (rc) rc.textContent = '0';
        return;
    }

    var rc = document.getElementById('resultsCount');
    if (rc) rc.textContent = filtered.length;

    grid.innerHTML = filtered.map(function(product) {
        var name = product.name[currentLang] || product.name['en'];
        var desc = product.desc[currentLang] || product.desc['en'];
        var catText = t('cat_' + product.category) || product.category;

        var specsHtml = product.specs.slice(0, 4).map(function(s) {
            return '<span class="spec-tag">' + s + '</span>';
        }).join('');

        return '<div class="product-card animate-fade-in-up" onclick="openProductModal(\'' + product.id + '\')">' +
            '<div class="product-image">' +
                '<div class="product-image-bg ' + product.brandClass + '"></div>' +
                '<span class="product-brand-badge ' + product.brandClass + '">' + product.brand + '</span>' +
                '<div class="product-image-content">' +
                    '<div class="product-model">' + product.model + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="product-info">' +
                '<div class="product-category">' + catText + '</div>' +
                '<h3 class="product-name">' + name + '</h3>' +
                '<p class="product-desc">' + desc + '</p>' +
                '<div class="product-specs">' + specsHtml + '</div>' +
                '<div class="product-actions">' +
                    '<button class="btn-inquire" onclick="event.stopPropagation(); inquireProduct(\'' + product.id + '\')">' + t('btn_inquire') + '</button>' +
                    '<button class="btn-details" onclick="event.stopPropagation(); openProductModal(\'' + product.id + '\')">' + t('btn_details') + '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function setBrandFilter(brand) {
    activeBrandFilter = brand;
    document.querySelectorAll('.brand-filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-brand') === brand);
    });
    renderProducts();
}

function setCategoryFilter(category) {
    activeCategoryFilter = category;
    document.querySelectorAll('.category-filter-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
    });
    renderProducts();
}

function initProductFilters() {
    var brandBar = document.getElementById('brandFilters');
    var catBar = document.getElementById('categoryFilters');
    if (!brandBar || !catBar) return;

    var brands = window.brandList || brandList;
    var data = window.productsData || productsData;

    // Brand filter buttons
    var brandHTML = '<button class="brand-filter-btn active" data-brand="all" onclick="setBrandFilter(\'all\')">' + t('filter_all') + '</button>';
    brands.forEach(function(brand) {
        var count = data.filter(function(p) { return p.brand === brand; }).length;
        if (count > 0) {
            brandHTML += '<button class="brand-filter-btn" data-brand="' + brand + '" onclick="setBrandFilter(\'' + brand + '\')">' +
                '<span class="brand-dot" style="background: ' + (brandColors[brand] || '#007bff') + '"></span>' +
                ' ' + brand + ' (' + count + ')' +
            '</button>';
        }
    });
    brandBar.innerHTML = brandHTML;

    // Category filter buttons
    var categories = ['router', 'switch', 'ap', 'server', 'security', 'video'];
    var catHTML = '<button class="category-filter-btn active" data-cat="all" onclick="setCategoryFilter(\'all\')">' + t('cat_all') + '</button>';
    categories.forEach(function(cat) {
        catHTML += '<button class="category-filter-btn" data-cat="' + cat + '" onclick="setCategoryFilter(\'' + cat + '\')">' + t('cat_' + cat) + '</button>';
    });
    catBar.innerHTML = catHTML;

    // Check URL for brand filter
    var params = new URLSearchParams(window.location.search);
    var brandParam = params.get('brand');
    if (brandParam) {
        var matchBrand = brands.find(function(b) { return b.toLowerCase() === brandParam.toLowerCase(); });
        if (matchBrand) {
            setBrandFilter(matchBrand);
        }
    }
}

// ==================== Product Modal ====================
function openProductModal(productId) {
    var data = window.productsData || productsData;
    var product = data.find(function(p) { return p.id === productId; });
    if (!product) return;

    var name = product.name[currentLang] || product.name['en'];
    var desc = product.desc[currentLang] || product.desc['en'];
    var catText = t('cat_' + product.category) || product.category;

    var specsHtml = '<ul>' + product.specs.map(function(s) {
        return '<li>' + s + '</li>';
    }).join('') + '</ul>';

    var modal = '<div class="modal-overlay active" id="productModal" onclick="closeProductModal(event)">' +
        '<div class="modal-content" onclick="event.stopPropagation()">' +
            '<button class="modal-close" onclick="closeProductModal()">&#10005;</button>' +
            '<div class="product-image" style="height: 200px; margin: -40px -40px 24px; border-radius: 16px 16px 0 0;">' +
                '<div class="product-image-bg ' + product.brandClass + '"></div>' +
                '<span class="product-brand-badge ' + product.brandClass + '">' + product.brand + '</span>' +
                '<div class="product-image-content">' +
                    '<div class="product-model">' + product.model + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="modal-product-brand ' + product.brandClass + '">' + product.brand + '</div>' +
            '<h2 class="modal-product-name">' + name + '</h2>' +
            '<div class="modal-product-category">' + catText + ' &middot; ' + product.model + '</div>' +
            '<p class="modal-product-desc">' + desc + '</p>' +
            '<div class="modal-specs">' +
                '<h4 data-i18n="modal_specs">' + t('modal_specs') + '</h4>' +
                specsHtml +
            '</div>' +
            '<div class="modal-cta">' +
                '<a href="mailto:info@helpyouinfo.com?subject=' + encodeURIComponent('Inquiry: ' + product.brand + ' ' + product.model) + '" class="btn-email">' +
                    '&#9993;&#65039; ' + t('modal_inquire_email') +
                '</a>' +
                '<a href="https://wa.me/8613713704797?text=' + encodeURIComponent('Inquiry: ' + product.brand + ' ' + product.model) + '" target="_blank" class="btn-whatsapp">' +
                    '&#128172; ' + t('modal_inquire_whatsapp') +
                '</a>' +
            '</div>' +
        '</div>' +
    '</div>';

    // Remove existing modal
    var existing = document.getElementById('productModal');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', modal);
    document.body.style.overflow = 'hidden';
}

function closeProductModal(event) {
    if (event && event.target.closest('.modal-content') && !event.target.classList.contains('modal-close')) {
        return;
    }
    var modal = document.getElementById('productModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function inquireProduct(productId) {
    var data = window.productsData || productsData;
    var product = data.find(function(p) { return p.id === productId; });
    if (!product) return;

    var subject = 'Inquiry: ' + product.brand + ' ' + product.model;
    var body = currentLang === 'zh-TW'
        ? '您好，我對以下產品感興趣：\n\n品牌：' + product.brand + '\n型號：' + product.model + '\n產品：' + product.name['zh-TW'] + '\n\n請提供報價和交貨期。'
        : 'Hello, I am interested in the following product:\n\nBrand: ' + product.brand + '\nModel: ' + product.model + '\nProduct: ' + product.name['en'] + '\n\nPlease provide pricing and delivery time.';

    window.location.href = 'mailto:info@helpyouinfo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}

// ==================== Contact Form ====================
function handleContactSubmit(event) {
    event.preventDefault();
    var form = event.target;
    var formData = new FormData(form);
    var name = formData.get('name');
    var email = formData.get('email');
    var phone = formData.get('phone');
    var company = formData.get('company');
    var product = formData.get('product');
    var message = formData.get('message');

    var subject = currentLang === 'zh-TW' ? '網站詢價 - ' + name : 'Website Inquiry - ' + name;
    var body = currentLang === 'zh-TW'
        ? '姓名：' + name + '\n郵箱：' + email + '\n電話：' + phone + '\n公司：' + company + '\n感興趣產品：' + product + '\n\n需求描述：\n' + message
        : 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nCompany: ' + company + '\nProduct of Interest: ' + product + '\n\nMessage:\n' + message;

    window.location.href = 'mailto:info@helpyouinfo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    // Show success message
    var successDiv = document.getElementById('formSuccess');
    if (successDiv) {
        successDiv.style.display = 'block';
        successDiv.textContent = t('form_success');
        setTimeout(function() { successDiv.style.display = 'none'; }, 5000);
    }
    form.reset();
}

// ==================== Smooth Scroll for Hash Links ====================
function handleHashClick(e) {
    var link = e.target.closest('a[href^="index.html#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    var hash = href.split('#')[1];

    // If we're already on index.html
    if (window.location.pathname.indexOf('index.html') !== -1 || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        e.preventDefault();
        var target = document.getElementById(hash);
        if (target) {
            var headerHeight = 72;
            var top = target.offsetTop - headerHeight;
            window.scrollTo({ top: top, behavior: 'smooth' });
        }
    }
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', function() {
    // Inject header and footer
    injectHeader();
    injectFooter();

    // Initialize language
    initLang();

    // Update language label
    var langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = t('lang_label');
    }

    // Update active nav
    updateActiveNav();

    // Scroll handler
    window.addEventListener('scroll', handleScroll);

    // Hash link handler
    document.addEventListener('click', handleHashClick);

    // Initialize products page if applicable
    if (document.getElementById('productGrid')) {
        initProductFilters();
        renderProducts();
    }

    // Initialize contact form
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            var navMenu = document.getElementById('navMenu');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Populate product select (contact page)
    populateProductSelect();

    // Handle hash on page load
    if (window.location.hash) {
        setTimeout(function() {
            var target = document.getElementById(window.location.hash.substring(1));
            if (target) {
                var headerHeight = 72;
                window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
            }
        }, 100);
    }
});

// ==================== Product Select (Contact Page) ====================
function populateProductSelect() {
    var select = document.getElementById('productSelect');
    if (!select) return;

    var lang = localStorage.getItem('hy_lang') || 'zh-TW';
    var i18nLang = lang === 'zh-TW' ? 'zh-TW' : 'en';
    var translations = window.i18nData ? window.i18nData[i18nLang] : {};
    var placeholder = (translations && translations['cat_all']) ? translations['cat_all'] : '請選擇產品（可留空）';

    var brands = window.brandList || ['Cisco', 'Fortinet', 'Dell', 'Juniper', 'Aruba', 'HPE', 'Huawei', 'H3C'];
    var data = window.productsData || (typeof productsData !== 'undefined' ? productsData : []);

    var html = '<option value="">' + placeholder + '</option>';

    brands.forEach(function(brand) {
        var brandProducts = data.filter(function(p) { return p.brand === brand; });
        if (brandProducts.length === 0) return;
        html += '<optgroup label="' + brand + '">';
        brandProducts.forEach(function(p) {
            var label = i18nLang === 'en' ? (p.name['en'] || p.model) : (p.name['zh-TW'] || p.model);
            html += '<option value="' + p.id + '">' + label + '</option>';
        });
        html += '</optgroup>';
    });

    select.innerHTML = html;
}

// Expose to global scope
window.populateProductSelect = populateProductSelect;
