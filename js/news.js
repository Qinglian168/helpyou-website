/* ============================================
   HELPYOU GROUP - News Data
   ============================================
   Usage: To add/update/remove news, simply edit
   the newsData array below. Each item needs:
     - id:       unique identifier
     - date:     'YYYY-MM-DD' format
     - category: 'product' | 'company' | 'industry'
     - title:    { 'zh-TW': '...', 'en': '...' }
     - summary:  { 'zh-TW': '...', 'en': '...' }
     - link:     optional external URL (leave '' for none)
   ============================================ */

var newsData = [
    {
        id: 'wifi7-launch',
        date: '2026-07-15',
        category: 'product',
        title: {
            'zh-TW': 'WiFi 7企業級無線方案正式上線',
            'en': 'WiFi 7 Enterprise Wireless Solutions Now Available'
        },
        summary: {
            'zh-TW': '鴻鵬集團宣布推出WiFi 7企業級無線網路解決方案，支援更高吞吐量與更低延遲，為企業打造下一代無線網路環境。新方案涵蓋Cisco、Aruba、Huawei等主流品牌WiFi 7 AP產品，滿足高密度辦公與工業場景需求。',
            'en': 'Helpyou Group launches WiFi 7 enterprise wireless networking solutions, supporting higher throughput and lower latency for next-generation wireless environments. The new portfolio includes WiFi 7 APs from Cisco, Aruba, and Huawei for high-density office and industrial scenarios.'
        },
        link: ''
    },
    {
        id: 'nvidia-ai-partnership',
        date: '2026-06-20',
        category: 'company',
        title: {
            'zh-TW': '與NVIDIA深化AI運算合作',
            'en': 'Deepening AI Computing Partnership with NVIDIA'
        },
        summary: {
            'zh-TW': '公司與NVIDIA深化AI運算領域合作，擴大GPU伺服器產品線，為客戶提供更完整的AI基礎架構解決方案。新增NVIDIA DGX系列及H100/H200 GPU伺服器現貨供應，助力企業AI模型訓練與推理。',
            'en': 'The company deepens its AI computing partnership with NVIDIA, expanding GPU server product lines to provide more comprehensive AI infrastructure solutions. NVIDIA DGX series and H100/H200 GPU servers are now in stock, empowering enterprise AI training and inference.'
        },
        link: ''
    },
    {
        id: 'security-trends-2026',
        date: '2026-05-08',
        category: 'industry',
        title: {
            'zh-TW': '2026企業網路安全趨勢報告',
            'en': '2026 Enterprise Network Security Trends Report'
        },
        summary: {
            'zh-TW': '隨著網路威脅日益複雜，下一代防火牆與零信任架構成為企業安全標配。本報告深入分析2026年網路安全最新趨勢，包括AI驅動的威脅檢測、SASE架構普及及供應鏈安全防護策略。',
            'en': 'As cyber threats become increasingly complex, next-generation firewalls and zero-trust architecture become enterprise security standards. This report analyzes the latest 2026 network security trends, including AI-driven threat detection, SASE architecture adoption, and supply chain security strategies.'
        },
        link: ''
    },
    {
        id: 'cisco-9300-stock',
        date: '2026-04-12',
        category: 'product',
        title: {
            'zh-TW': 'Cisco Catalyst 9300系列交換機到貨',
            'en': 'Cisco Catalyst 9300 Series Switches Now in Stock'
        },
        summary: {
            'zh-TW': 'Cisco Catalyst 9300系列堆疊交換機現貨供應，支援25G/40G上行，適合中型至大型企業核心網路部署。C9300-48T、C9300-48P及C9300-48UXM型號均備有充足庫存，可快速出貨。',
            'en': 'Cisco Catalyst 9300 series stackable switches now available, supporting 25G/40G uplinks, suitable for medium to large enterprise core network deployment. C9300-48T, C9300-48P, and C9300-48UXM models are in stock with fast shipping.'
        },
        link: ''
    },
    {
        id: 'global-expansion',
        date: '2026-03-05',
        category: 'company',
        title: {
            'zh-TW': '擴大國際市場版圖',
            'en': 'Expanding Global Market Presence'
        },
        summary: {
            'zh-TW': '鴻鵬集團持續擴展全球業務，新增東南亞及中東地區合作夥伴，為更多國際客戶提供優質網路設備採購服務。公司在新加坡、杜拜設立聯絡處，進一步強化全球供應鏈服務能力。',
            'en': 'Helpyou Group continues to expand globally, adding new partners in Southeast Asia and the Middle East to serve more international clients. New liaison offices in Singapore and Dubai further strengthen our global supply chain capabilities.'
        },
        link: ''
    },
    {
        id: 'ai-smart-meeting',
        date: '2026-02-18',
        category: 'industry',
        title: {
            'zh-TW': 'AI驅動的智慧會議室解決方案',
            'en': 'AI-Driven Smart Conference Room Solutions'
        },
        summary: {
            'zh-TW': '結合AI語音辨識、自動追蹤攝影與智能降噪技術，新一代智慧會議室方案讓混合辦公更高效、更自然。Yealink MeetingBar系列與Poly Studio系列整合AI功能，提供一站式會議體驗。',
            'en': 'Combining AI voice recognition, auto-tracking cameras and intelligent noise reduction, the new smart conference room solution makes hybrid work more efficient. Yealink MeetingBar series and Poly Studio series integrate AI capabilities for a one-stop meeting experience.'
        },
        link: ''
    }
];

// ==================== Category Labels ====================
var newsCategoryLabels = {
    'product': { 'zh-TW': '產品資訊', 'en': 'Product Info' },
    'company': { 'zh-TW': '公司動態', 'en': 'Company News' },
    'industry': { 'zh-TW': '行業趨勢', 'en': 'Industry Trends' }
};

// ==================== Category Colors ====================
var newsCategoryColors = {
    'product': { bg: 'rgba(59,130,246,0.12)', text: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
    'company': { bg: 'rgba(0,179,136,0.1)', text: '#00b388', border: 'rgba(0,179,136,0.2)' },
    'industry': { bg: 'rgba(255,127,0,0.1)', text: '#ff7f00', border: 'rgba(255,127,0,0.2)' }
};

// ==================== Render News List ====================
function renderNewsList() {
    var container = document.getElementById('newsListContainer');
    if (!container) return;

    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';

    // Sort by date descending (newest first)
    var sorted = newsData.slice().sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    container.innerHTML = sorted.map(function(item) {
        var title = item.title[lang] || item.title['en'];
        var summary = item.summary[lang] || item.summary['en'];
        var catLabel = newsCategoryLabels[item.category]
            ? (newsCategoryLabels[item.category][lang] || newsCategoryLabels[item.category]['en'])
            : item.category;
        var catColor = newsCategoryColors[item.category] || newsCategoryColors['product'];

        // Format date
        var dateObj = new Date(item.date);
        var dateStr = lang === 'zh-TW'
            ? dateObj.getFullYear() + '年' + (dateObj.getMonth() + 1) + '月' + dateObj.getDate() + '日'
            : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        var readMoreText = lang === 'zh-TW' ? '閱讀更多' : 'Read More';

        var linkHtml = '';
        if (item.link) {
            linkHtml = '<a href="' + item.link + '" class="news-read-more" target="_blank">' + readMoreText + ' &rarr;</a>';
        } else {
            linkHtml = '<a href="contact.html" class="news-read-more">' + readMoreText + ' &rarr;</a>';
        }

        return '<article class="news-article">' +
            '<div class="news-article-meta">' +
                '<span class="news-date">' + dateStr + '</span>' +
                '<span class="news-category-tag" style="background: ' + catColor.bg + '; color: ' + catColor.text + '; border: 1px solid ' + catColor.border + ';">' + catLabel + '</span>' +
            '</div>' +
            '<h2 class="news-article-title">' + title + '</h2>' +
            '<p class="news-article-summary">' + summary + '</p>' +
            linkHtml +
        '</article>';
    }).join('');
}

// Expose to global scope
window.newsData = newsData;
window.renderNewsList = renderNewsList;
