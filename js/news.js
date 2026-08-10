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
     - content:  { 'zh-TW': '...', 'en': '...' }  (full article body, paragraphs separated by \n\n)
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
        content: {
            'zh-TW': '隨著企業數位轉型加速，對無線網路帶寬與穩定性的需求不斷攀升。WiFi 7（802.11be）作為最新一代無線標準，帶來了320MHz頻寬、4096-QAM調製、多鏈路操作（MLO）等突破性技術，理論最高速率可達46Gbps，是WiFi 6的三倍以上。\n\n鴻鵬集團此次推出的WiFi 7企業級無線方案，涵蓋以下主流品牌產品：\n\n• Cisco Catalyst 9165/9166 系列WiFi 7 AP\n• Aruba 720/630 系列Wi-Fi 7 AP\n• Huawei AirEngine 5760/6760 系列WiFi 7 AP\n\n新方案支援MLO多鏈路聚合，可同時利用2.4GHz、5GHz和6GHz頻段進行資料傳輸，大幅降低延遲並提升可靠性。同時內建AI驅動的射頻優化功能，可根據環境自動調整信道與功率，確保在複雜的企業環境中仍能保持最佳效能。\n\n適用場景包括：高密度辦公區（500+用戶）、智慧製造工廠、大型會展中心、教育校園及醫療機構。鴻鵬集團提供從方案設計、設備供應到安裝部署的全流程服務，協助企業快速完成WiFi 7網路升級。\n\n歡迎聯繫我們的技術團隊獲取免費場勘與方案規劃服務。',
            'en': 'As enterprise digital transformation accelerates, demand for wireless bandwidth and stability continues to grow. WiFi 7 (802.11be), the latest wireless standard, brings breakthrough technologies including 320MHz channels, 4096-QAM modulation, and Multi-Link Operation (MLO), with theoretical maximum speeds of up to 46Gbps — more than three times that of WiFi 6.\n\nHelpyou Group\'s new WiFi 7 enterprise solution portfolio includes products from the following leading brands:\n\n• Cisco Catalyst 9165/9166 Series WiFi 7 APs\n• Aruba 720/630 Series Wi-Fi 7 APs\n• Huawei AirEngine 5760/6760 Series WiFi 7 APs\n\nThe new solution supports MLO multi-link aggregation, simultaneously utilizing 2.4GHz, 5GHz, and 6GHz bands for data transmission, dramatically reducing latency and improving reliability. Built-in AI-driven RF optimization automatically adjusts channels and power based on the environment, ensuring optimal performance even in complex enterprise settings.\n\nApplicable scenarios include: high-density office areas (500+ users), smart manufacturing facilities, large convention centers, educational campuses, and healthcare institutions. Helpyou Group provides end-to-end service from solution design and equipment supply to installation and deployment.\n\nContact our technical team for free site survey and solution planning services.'
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
        content: {
            'zh-TW': 'AI技術的快速發展正深刻改變各行各業的運作方式。作為NVIDIA長期合作夥伴，鴻鵬集團持續深化在AI運算領域的戰略合作，為企業客戶提供從硬體到軟體的完整AI基礎架構方案。\n\n本次深化合作的核心內容包括：\n\n1. 產品線擴充：新增NVIDIA DGX H100、DGX H200整合式AI伺服器系統，以及搭載H100/H200 GPU的通用GPU伺服器產品線，涵蓋4卡至8卡配置。\n\n2. 現貨供應：H100 80GB GPU伺服器已備有充足現貨，可在訂單確認後3-5個工作日內出貨，大幅縮短客戶等待時間。\n\n3. 技術支援：公司技術團隊已完成NVIDIA AI Enterprise軟體套件的認證培訓，可為客戶提供從GPU驅動安裝、CUDA環境配置到模型部署的全鏈路技術支援。\n\n4. 方案設計：針對不同規模的AI應用場景，提供客製化方案設計服務，包括計算節點選型、高速互聯網路（InfiniBand/Ethernet）規劃、儲存架構設計及散熱方案。\n\n無論是大規模語言模型訓練、電腦視覺推理，還是科學計算與資料分析，鴻鵬集團都能提供匹配的GPU運算平台。歡迎聯繫我們了解詳細配置與報價。',
            'en': 'The rapid advancement of AI technology is profoundly transforming operations across all industries. As a long-term NVIDIA partner, Helpyou Group continues to deepen its strategic cooperation in AI computing, providing enterprise customers with complete AI infrastructure solutions from hardware to software.\n\nKey aspects of this expanded partnership include:\n\n1. Product Line Expansion: NVIDIA DGX H100 and DGX H200 integrated AI server systems, along with general-purpose GPU server products featuring H100/H200 GPUs, are now available in 4-GPU to 8-GPU configurations.\n\n2. In-Stock Availability: H100 80GB GPU servers are in ample stock, with shipping within 3-5 business days after order confirmation, significantly reducing customer wait times.\n\n3. Technical Support: Our technical team has completed certification training for NVIDIA AI Enterprise software suite, providing full-chain support from GPU driver installation and CUDA environment configuration to model deployment.\n\n4. Solution Design: For AI application scenarios of different scales, we offer customized solution design including compute node selection, high-speed interconnect (InfiniBand/Ethernet) planning, storage architecture design, and thermal management.\n\nWhether for large-scale language model training, computer vision inference, or scientific computing and data analytics, Helpyou Group provides matching GPU computing platforms. Contact us for detailed configurations and pricing.'
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
        content: {
            'zh-TW': '2026年，全球網路安全形勢持續嚴峻。根據Gartner最新報告，全球企業網路安全支出預計將達到2,150億美元，年增長率12.6%。在AI技術加持下，網路攻擊的複雜度和自動化程度大幅提升，傳統基於簽名的安全防護已難以應對。\n\n以下是2026年企業網路安全的核心趨勢：\n\n一、零信任架構（Zero Trust）成為主流\n零信任的核心原則是「永不信任，始終驗證」。越來越多企業摒棄傳統的邊界安全模型，轉而採用基於身份和設備的持續驗證機制。Fortinet、Palo Alto Networks、Cisco等廠商均已推出成熟的零信任方案。\n\n二、AI驅動的威脅檢測與回應\nAI和機器學習技術被廣泛應用於安全資訊與事件管理（SIEM）系統中，能夠在毫秒級別識別異常行為模式並自動觸發回應。Fortinet的FortiAI、Cisco的Cisco XDR均整合了AI驅動的分析引擎。\n\n三、SASE架構加速普及\n安全存取服務邊緣（SASE）將網路和安全功能整合為雲端服務，特別適合混合辦公和分散式企業場景。Gartner預測，到2027年將有70%的企業採用SASE架構。\n\n四、供應鏈安全\n軟體供應鏈攻擊持續攀升，企業需加強對第三方供應商的安全評估，確保設備和軟體的可追溯性。\n\n鴻鵬集團提供Fortinet、Palo Alto、Cisco等主流安全廠商的全線產品，協助企業構建多層次安全防護體系。',
            'en': 'In 2026, the global cybersecurity landscape remains severe. According to the latest Gartner report, global enterprise security spending is projected to reach $215 billion, with a year-over-year growth rate of 12.6%. With AI-powered enhancements, the sophistication and automation of cyber attacks have significantly increased, making traditional signature-based security protection increasingly inadequate.\n\nKey enterprise security trends for 2026:\n\n1. Zero Trust Architecture Goes Mainstream\nThe core principle of Zero Trust is "never trust, always verify." More enterprises are abandoning traditional perimeter security models in favor of identity- and device-based continuous verification. Fortinet, Palo Alto Networks, and Cisco have all introduced mature Zero Trust solutions.\n\n2. AI-Driven Threat Detection and Response\nAI and machine learning technologies are widely applied in Security Information and Event Management (SIEM) systems, capable of identifying anomalous behavior patterns at millisecond speed and automatically triggering responses. Fortinet\'s FortiAI and Cisco\'s XDR both integrate AI-driven analytics engines.\n\n3. SASE Architecture Accelerates Adoption\nSecure Access Service Edge (SASE) integrates network and security functions as cloud services, particularly suited for hybrid work and distributed enterprise scenarios. Gartner predicts that by 2027, 70% of enterprises will adopt SASE architecture.\n\n4. Supply Chain Security\nSoftware supply chain attacks continue to rise. Enterprises need to strengthen security assessments of third-party suppliers to ensure traceability of equipment and software.\n\nHelpyou Group provides full product lines from leading security vendors including Fortinet, Palo Alto, and Cisco, helping enterprises build multi-layered security defense systems.'
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
        content: {
            'zh-TW': 'Cisco Catalyst 9300系列是Cisco企業級交換機的旗艦產品線，基於Cisco Silicon One統一晶片架構，提供企業級存取、聚合與核心交換能力。\n\n本次到貨的型號及規格：\n\n• C9300-48T：48口千兆乙太網，支援StackWise-480堆疊\n• C9300-48P：48口千兆PoE+（740W），支援IEEE 802.3at\n• C9300-48UXM：48口萬兆多速率（mGIG + UPOE），支援10GBASE-T\n\n核心特性：\n\n1. StackWise-480技術：最多9台堆疊，堆疊頻寬480Gbps，實現單一管理平面\n2. 可程式化晶片（UDP）：支援Cisco SD-Access、MACsec加密、VXLAN/EVPN\n3. 智慧管理：整合Cisco DNA Center，支援AI驅動的網路分析與自動修復\n4. 高可用性：支援ISSU（線上軟體升級）、硬體冗餘風扇與電源\n\nCatalyst 9300系列適用於中型至大型企業的存取層和聚集層部署，尤其適合需要高密度PoE供電（如WiFi AP、IP攝影機、IP電話）和高速上行（25G/40G）的場景。\n\n鴻鵬集團所有C9300系列交換機均為原廠正品，提供Cisco Smart Licensing授權。現貨供應，支援全球快速出貨。歡迎查詢庫存與報價。',
            'en': 'The Cisco Catalyst 9300 series is Cisco\'s flagship enterprise switching product line, built on the Cisco Silicon One unified chip architecture, providing enterprise-grade access, aggregation, and core switching capabilities.\n\nModels and specifications now in stock:\n\n• C9300-48T: 48-port Gigabit Ethernet with StackWise-480 stacking\n• C9300-48P: 48-port Gigabit PoE+ (740W), IEEE 802.3at compliant\n• C9300-48UXM: 48-port 10G multi-rate (mGIG + UPOE), 10GBASE-T\n\nKey Features:\n\n1. StackWise-480 Technology: Up to 9-unit stacking with 480Gbps stacking bandwidth, single management plane\n2. Programmable Chip (UDP): Supports Cisco SD-Access, MACsec encryption, VXLAN/EVPN\n3. Smart Management: Integrated with Cisco DNA Center, supports AI-driven network analytics and auto-remediation\n4. High Availability: Supports ISSU (In-Service Software Upgrade), redundant fans and power supplies\n\nThe Catalyst 9300 series is ideal for access and aggregation layer deployment in medium to large enterprises, particularly suited for scenarios requiring high-density PoE (WiFi APs, IP cameras, IP phones) and high-speed uplinks (25G/40G).\n\nAll C9300 series switches from Helpyou Group are genuine factory products with Cisco Smart Licensing. In stock with global fast shipping. Contact us for inventory and pricing.'
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
        content: {
            'zh-TW': '成立於2011年的鴻鵬集團，經過15年的穩健發展，已成為亞太地區領先的企業級網路設備分銷商。2026年，公司持續推進全球化戰略，進一步擴大國際市場版圖。\n\n2026年全球化布局重點：\n\n一、東南亞市場\n公司在新加坡設立東南亞區聯絡處，負責印尼、馬來西亞、泰國、越南、菲律賓等國的客戶服務與物流配送。新加坡作為東南亞物流樞紐，可有效縮短該區域客戶的交貨週期至3-7天。\n\n二、中東市場\n在杜拜設立中東區聯絡處，覆蓋沙烏地阿拉伯、阿聯酋、卡達、阿曼等海灣國家市場。中東地區正處於智慧城市和數位轉型建設高峰，對企業級網路設備需求旺盛。\n\n三、合作夥伴網路\n2026年新增授權合作夥伴35家，覆蓋東南亞、中東、非洲及拉美地區，全球合作夥伴總數已超過200家。\n\n四、供應鏈能力提升\n• 新增深圳、新加坡、杜拜三地保稅倉儲，總庫容面積擴大40%\n• 與DHL、FedEx簽署戰略物流合作協議，全球主要城市7-10天送達\n• 建立多幣種結算體系，支援USD、EUR、SGD、AED等結算貨幣\n\n鴻鵬集團將持續以優質的產品、有競爭力的價格和專業的服務，為全球客戶提供一站式網路設備採購體驗。',
            'en': 'Founded in 2011, Helpyou Group has grown over 15 years into a leading enterprise network equipment distributor in the Asia-Pacific region. In 2026, the company continues to advance its globalization strategy, further expanding its international market presence.\n\n2026 Global Expansion Highlights:\n\n1. Southeast Asian Market\nA Southeast Asia regional liaison office has been established in Singapore, responsible for customer service and logistics in Indonesia, Malaysia, Thailand, Vietnam, and the Philippines. As a Southeast Asian logistics hub, Singapore can effectively reduce delivery lead times to 3-7 days for regional customers.\n\n2. Middle Eastern Market\nA Middle East regional liaison office has been established in Dubai, covering Saudi Arabia, UAE, Qatar, Oman, and other Gulf countries. The Middle East is experiencing a peak in smart city and digital transformation construction, with strong demand for enterprise networking equipment.\n\n3. Partner Network\n35 new authorized partners were added in 2026, covering Southeast Asia, the Middle East, Africa, and Latin America. The total global partner count now exceeds 200.\n\n4. Supply Chain Enhancement\n• New bonded warehouses in Shenzhen, Singapore, and Dubai, increasing total storage capacity by 40%\n• Strategic logistics partnerships with DHL and FedEx for 7-10 day delivery to major global cities\n• Multi-currency settlement system supporting USD, EUR, SGD, AED, and more\n\nHelpyou Group continues to provide global customers with a one-stop network equipment procurement experience through quality products, competitive pricing, and professional service.'
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
        content: {
            'zh-TW': '後疫情時代，混合辦公已成為企業常態。然而，遠端與現場混合會議中普遍存在「聽不清、看不到、參與感低」等問題。AI技術的成熟為智慧會議室帶來了革命性的改變。\n\n新一代智慧會議室方案核心功能：\n\n一、AI語音辨識與即時翻譯\n整合AI語音辨識引擎，可即時將會議語音轉錄為文字，支援中英日韓等多語言即時翻譯。會議結束後自動生成會議紀要，大幅提升會後跟進效率。\n\n二、智慧攝影機自動追蹤\n具備AI人物追蹤功能，攝影機可自動聚焦發言者，並根據與會人數動態調整取景範圍。支援發言者追蹤、全景切換、畫中畫等多種模式。\n\n三、AI智能降噪\n採用深度學習降噪演算法，可有效消除鍵盤敲擊、空調噪音、鄰室對話等環境噪音，確保會議語音清晰可辨。同時支援迴聲消除（AEC）和自動增益（AGC）。\n\n四、智能議程管理\n會前自動建立會議邀請與議程，會中即時顯示討論要點，會後生成行動項追蹤清單，形成完整的會議閉環管理。\n\n推薦產品組合：\n• Yealink MeetingBar A20/A30 + CPW901麥克風陣列\n• Poly Studio X70 + Poly Studio USB一體式攝影機\n• Logitech Rally Bar中型會議室方案\n\n鴻鵬集團提供從1人小型Huddle Room到50+人大會議室的完整方案設計與設備供應。',
            'en': 'In the post-pandemic era, hybrid work has become the enterprise norm. However, hybrid meetings with remote and in-person participants commonly suffer from issues such as "can\'t hear clearly, can\'t see everyone, low engagement." The maturation of AI technology has brought revolutionary changes to smart conference rooms.\n\nCore Features of the New Smart Conference Room Solution:\n\n1. AI Speech Recognition and Real-Time Translation\nIntegrated AI speech recognition engines can transcribe meeting audio to text in real time, supporting multi-language real-time translation including Chinese, English, Japanese, and Korean. Meeting minutes are automatically generated after the meeting, significantly improving post-meeting follow-up efficiency.\n\n2. Intelligent Camera Auto-Tracking\nAI-powered person tracking allows cameras to automatically focus on the active speaker and dynamically adjust framing based on participant count. Supports speaker tracking, panoramic view, and picture-in-picture modes.\n\n3. AI Intelligent Noise Reduction\nDeep learning noise reduction algorithms effectively eliminate environmental noise such as keyboard typing, HVAC noise, and adjacent room conversations, ensuring clear meeting audio. Also supports Acoustic Echo Cancellation (AEC) and Automatic Gain Control (AGC).\n\n4. Smart Agenda Management\nAutomatically creates meeting invitations and agendas before meetings, displays discussion points in real time during meetings, and generates action item tracking lists after meetings, forming a complete meeting lifecycle management.\n\nRecommended Product Combinations:\n• Yealink MeetingBar A20/A30 + CPW901 microphone array\n• Poly Studio X70 + Poly Studio USB all-in-one camera\n• Logitech Rally Bar for medium meeting rooms\n\nHelpyou Group provides complete solution design and equipment supply from 1-person huddle rooms to 50+ person large conference rooms.'
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

// ==================== Helper: Get URL Param ====================
function getQueryParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

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
        var detailUrl = 'news-detail.html?id=' + encodeURIComponent(item.id);

        var linkHtml = '';
        if (item.link) {
            linkHtml = '<a href="' + item.link + '" class="news-read-more" target="_blank">' + readMoreText + ' &rarr;</a>';
        } else {
            linkHtml = '<a href="' + detailUrl + '" class="news-read-more">' + readMoreText + ' &rarr;</a>';
        }

        return '<article class="news-article" onclick="window.location.href=\'' + detailUrl + '\'">' +
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

// ==================== Render News Detail ====================
function renderNewsDetail() {
    var container = document.getElementById('newsDetailContainer');
    if (!container) return;

    var lang = (typeof currentLang !== 'undefined') ? currentLang : 'zh-TW';
    var newsId = getQueryParam('id');

    // Find the news item
    var item = null;
    if (newsId) {
        item = newsData.find(function(n) { return n.id === newsId; });
    }

    // If not found, show message
    if (!item) {
        var notFoundText = lang === 'zh-TW' ? '找不到此新聞' : 'News article not found';
        var backText = lang === 'zh-TW' ? '返回新聞列表' : 'Back to News';
        container.innerHTML =
            '<div class="news-detail-notfound">' +
                '<p>' + notFoundText + '</p>' +
                '<a href="news.html" class="btn-secondary">' + backText + '</a>' +
            '</div>';
        return;
    }

    var title = item.title[lang] || item.title['en'];
    var content = item.content[lang] || item.content['en'];
    var catLabel = newsCategoryLabels[item.category]
        ? (newsCategoryLabels[item.category][lang] || newsCategoryLabels[item.category]['en'])
        : item.category;
    var catColor = newsCategoryColors[item.category] || newsCategoryColors['product'];

    // Format date
    var dateObj = new Date(item.date);
    var dateStr = lang === 'zh-TW'
        ? dateObj.getFullYear() + '年' + (dateObj.getMonth() + 1) + '月' + dateObj.getDate() + '日'
        : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Convert content paragraphs (separated by \n\n) to HTML
    var contentHtml = content.split('\n\n').map(function(para) {
        return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    // Related news (same category, exclude current)
    var related = newsData.filter(function(n) {
        return n.category === item.category && n.id !== item.id;
    }).slice(0, 3);

    var relatedTitle = lang === 'zh-TW' ? '相關新聞' : 'Related News';
    var relatedHtml = '';
    if (related.length > 0) {
        relatedHtml = '<div class="news-detail-related">' +
            '<h3 class="news-detail-related-title">' + relatedTitle + '</h3>' +
            '<div class="news-detail-related-list">' +
                related.map(function(r) {
                    var rTitle = r.title[lang] || r.title['en'];
                    var rDateObj = new Date(r.date);
                    var rDateStr = lang === 'zh-TW'
                        ? rDateObj.getFullYear() + '-' + String(rDateObj.getMonth() + 1).padStart(2, '0') + '-' + String(rDateObj.getDate()).padStart(2, '0')
                        : rDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    return '<a href="news-detail.html?id=' + encodeURIComponent(r.id) + '" class="news-detail-related-item">' +
                        '<span class="news-detail-related-date">' + rDateStr + '</span>' +
                        '<span class="news-detail-related-text">' + rTitle + '</span>' +
                    '</a>';
                }).join('') +
            '</div>' +
        '</div>';
    }

    // Back button
    var backText = lang === 'zh-TW' ? '← 返回新聞列表' : '← Back to News';

    // Update page title
    document.title = title + ' - ' + (lang === 'zh-TW' ? '鴻鵬集團有限公司' : 'Helpyou Group Co., Ltd.');

    container.innerHTML =
        '<article class="news-detail-article">' +
            '<div class="news-detail-meta">' +
                '<span class="news-date">' + dateStr + '</span>' +
                '<span class="news-category-tag" style="background: ' + catColor.bg + '; color: ' + catColor.text + '; border: 1px solid ' + catColor.border + ';">' + catLabel + '</span>' +
            '</div>' +
            '<h1 class="news-detail-title">' + title + '</h1>' +
            '<div class="news-detail-content">' + contentHtml + '</div>' +
            '<a href="news.html" class="news-detail-back">' + backText + '</a>' +
            relatedHtml +
        '</article>';
}

// Expose to global scope
window.newsData = newsData;
window.renderNewsList = renderNewsList;
window.renderNewsDetail = renderNewsDetail;
