/* ============================================
   HELPYOU GROUP - Product Data
   20 Brands × Representative Products
   ============================================ */

var brandList = [
    'Cisco', 'Fortinet', 'Dell', 'Juniper', 'Aruba', 'HPE', 'Huawei', 'H3C',
    'NVIDIA', 'Yealink', 'Poly', 'Grandstream', 'Ruckus', 'Ubiquiti', 'Ruijie',
    'Sangfor', 'Logitech', 'Avaya', 'Fanvil', 'APC'
];

var brandColors = {
    'Cisco': '#1ba0d7',
    'Fortinet': '#ee3124',
    'Dell': '#007db8',
    'Juniper': '#84b135',
    'Aruba': '#ff7f00',
    'HPE': '#00b388',
    'Huawei': '#cf0a2c',
    'H3C': '#e60012',
    'NVIDIA': '#76b900',
    'Yealink': '#00a3e0',
    'Poly': '#0096d6',
    'Grandstream': '#f47b20',
    'Ruckus': '#ec008c',
    'Ubiquiti': '#0559c9',
    'Ruijie': '#e60012',
    'Sangfor': '#0091ff',
    'Logitech': '#00b8fc',
    'Avaya': '#cc0000',
    'Fanvil': '#1a73e8',
    'APC': '#ffc20e'
};

var brandLogos = {
    'Cisco': 'https://aka.doubaocdn.com/s/glS31we1wf',
    'Fortinet': 'https://aka.doubaocdn.com/s/CwNN1we1wh',
    'Dell': 'https://aka.doubaocdn.com/s/O78w1we1wj',
    'Grandstream': 'https://aka.doubaocdn.com/s/Emk61we1ww',
    'Yealink': 'https://aka.doubaocdn.com/s/BdNL1we1wx',
    'Poly': 'https://aka.doubaocdn.com/s/gxvf1we1wz',
    'Aruba': 'https://aka.doubaocdn.com/s/2yrF1we1xB',
    'Juniper': 'https://aka.doubaocdn.com/s/DSnV1we1xC',
    'HPE': 'https://aka.doubaocdn.com/s/69UQ1we1xE',
    'Avaya': 'https://aka.doubaocdn.com/s/hYo41we22P',
    'NVIDIA': 'https://aka.doubaocdn.com/s/WFmY1we22R',
    'Ubiquiti': 'https://aka.doubaocdn.com/s/tca61we2Kg',
    'Ruckus': 'https://aka.doubaocdn.com/s/VrpS1we2Ki',
    'Huawei': 'https://aka.doubaocdn.com/s/jklK1we22T',
    'H3C': 'https://aka.doubaocdn.com/s/EIGm1we2Kj',
    'Ruijie': 'https://aka.doubaocdn.com/s/gCM51we2Kr',
    'Logitech': 'https://aka.doubaocdn.com/s/0U2Y1we2Ks',
    'Fanvil': 'https://aka.doubaocdn.com/s/yyCz1we2Ku',
    'Sangfor': 'https://aka.doubaocdn.com/s/G4rc1we2L3',
    'APC': 'https://aka.doubaocdn.com/s/rmCY1we2L5'
};

function brandClassFor(brand) {
    return 'brand-' + brand.toLowerCase().replace(/[^a-z0-9]/g, '');
}

var productsData = [
    // ==================== Cisco ====================
    {
        id: 'cisco-01', brand: 'Cisco', brandClass: 'brand-cisco', category: 'router', icon: '🌐',
        model: 'ISR 4451',
        image: 'images/products/cisco-01.jpg',
        name: { 'zh-TW': 'Cisco ISR 4451 企業級路由器', 'en': 'Cisco ISR 4451 Enterprise Router' },
        desc: { 'zh-TW': '整合式服務路由器，支援安全、語音、視訊與資料服務，適合中型企業分支機構。', 'en': 'Integrated services router supporting secure voice, video, data and applications for mid-size branch offices.' },
        specs: ['2x 10GbE', 'Up to 500 Mbps', 'VPN & Security', 'UC Ready', 'Modular']
    },
    {
        id: 'cisco-02', brand: 'Cisco', brandClass: 'brand-cisco', category: 'switch', icon: '🔀',
        model: 'Catalyst 9300',
        image: 'images/products/cisco-02.jpg',
        name: { 'zh-TW': 'Cisco Catalyst 9300 系列交換機', 'en': 'Cisco Catalyst 9300 Series Switch' },
        desc: { 'zh-TW': '企業級堆疊交換機，支援PoE+、MACsec加密與AI驅動分析，適合園區網路核心。', 'en': 'Enterprise stackable switch with PoE+, MACsec encryption and AI-driven analytics for campus core.' },
        specs: ['48x PoE+ Ports', 'StackWise-480', '10GbE Uplinks', 'MACsec', 'DNA Center']
    },

    // ==================== Fortinet ====================
    {
        id: 'fortinet-01', brand: 'Fortinet', brandClass: 'brand-fortinet', category: 'security', icon: '🛡️',
        model: 'FortiGate 100F',
        image: 'images/products/fortinet-01.jpg',
        name: { 'zh-TW': 'Fortinet FortiGate 100F 下一代防火牆', 'en': 'Fortinet FortiGate 100F Next-Gen Firewall' },
        desc: { 'zh-TW': '整合SD-WAN與次世代防火牆，提供高效威脅防護與應用控制，適合中型企業。', 'en': 'Integrated SD-WAN and next-gen firewall delivering high-performance threat protection for mid-size enterprises.' },
        specs: ['10x GE Ports', 'SD-WAN Built-in', 'IPS & AV', '10 Gbps Firewall', 'Zero Trust']
    },
    {
        id: 'fortinet-02', brand: 'Fortinet', brandClass: 'brand-fortinet', category: 'router', icon: '🌐',
        model: 'FortiGate 60F',
        image: 'images/products/fortinet-02.jpg',
        name: { 'zh-TW': 'Fortinet FortiGate 60F 安全路由器', 'en': 'Fortinet FortiGate 60F Secure Router' },
        desc: { 'zh-TW': '桌面型安全閘道，整合防火牆、VPN與SD-WAN，適合小型辦公室與分支機構。', 'en': 'Desktop security gateway integrating firewall, VPN and SD-WAN for small offices and branches.' },
        specs: ['10x GE Ports', 'SD-WAN', 'IPsec VPN', '3.5 Gbps FW', 'Wi-Fi Option']
    },

    // ==================== Dell ====================
    {
        id: 'dell-01', brand: 'Dell', brandClass: 'brand-dell', category: 'server', icon: '🖥️',
        model: 'PowerEdge R750',
        image: 'images/products/dell-01.jpg',
        name: { 'zh-TW': 'Dell PowerEdge R750 機架式伺服器', 'en': 'Dell PowerEdge R750 Rack Server' },
        desc: { 'zh-TW': '2U雙插槽機架伺服器，搭載Intel Xeon處理器，適用於虛擬化、資料庫與AI推理。', 'en': '2U dual-socket rack server powered by Intel Xeon, ideal for virtualization, databases and AI inference.' },
        specs: ['2U Rack', 'Intel Xeon Scalable', '24x DIMM', 'iDRAC9', 'PCIe 4.0']
    },
    {
        id: 'dell-02', brand: 'Dell', brandClass: 'brand-dell', category: 'switch', icon: '🔀',
        model: 'N3248TE',
        image: 'images/products/dell-02.jpg',
        name: { 'zh-TW': 'Dell N3248TE 企業級交換機', 'en': 'Dell N3248TE Enterprise Switch' },
        desc: { 'zh-TW': '48埠千兆L3管理型交換機，支援PoE+，適合企業園區接入層部署。', 'en': '48-port Gigabit L3 managed switch with PoE+ for enterprise campus access layer deployment.' },
        specs: ['48x GE PoE+', '4x 10GbE Uplinks', 'L3 Routing', 'Stackable', 'VLAN & QoS']
    },

    // ==================== Juniper ====================
    {
        id: 'juniper-01', brand: 'Juniper', brandClass: 'brand-juniper', category: 'router', icon: '🌐',
        model: 'MX204',
        image: 'images/products/juniper-01.jpg',
        name: { 'zh-TW': 'Juniper MX204 邊界路由器', 'en': 'Juniper MX204 Edge Router' },
        desc: { 'zh-TW': '高效能邊界路由器，支援400G容量，適合企業核心網路與資料中心互聯。', 'en': 'High-performance edge router supporting 400G capacity for enterprise core and data center interconnect.' },
        specs: ['400 Gbps', '8x 100GbE', 'MPLS & VPN', 'Junos OS', 'Auto-Scaling']
    },
    {
        id: 'juniper-02', brand: 'Juniper', brandClass: 'brand-juniper', category: 'switch', icon: '🔀',
        model: 'EX4400-48T',
        image: 'images/products/juniper-02.jpg',
        name: { 'zh-TW': 'Juniper EX4400-48T 交換機', 'en': 'Juniper EX4400-48T Switch' },
        desc: { 'zh-TW': '48埠萬兆乙太網交換機，支援EVPN-VXLAN，適合現代園區網路架構。', 'en': '48-port 10GbE Ethernet switch with EVPN-VXLAN support for modern campus network architecture.' },
        specs: ['48x 10GbE', 'EVPN-VXLAN', 'PoE++ Option', 'Virtual Chassis', 'IoT Ready']
    },

    // ==================== Aruba ====================
    {
        id: 'aruba-01', brand: 'Aruba', brandClass: 'brand-aruba', category: 'ap', icon: '📶',
        model: 'AP-655',
        image: 'images/products/aruba-01.jpg',
        name: { 'zh-TW': 'Aruba AP-655 WiFi 6 無線接入點', 'en': 'Aruba AP-655 WiFi 6 Access Point' },
        desc: { 'zh-TW': 'WiFi 6E企業級無線AP，支援OFDMA與目標喚醒時間，提供高密度無線覆蓋。', 'en': 'WiFi 6E enterprise AP with OFDMA and target wake time for high-density wireless coverage.' },
        specs: ['WiFi 6E', '4x4 MIMO', '2.5GbE Uplink', 'IoT BLE', 'Central Mgmt']
    },
    {
        id: 'aruba-02', brand: 'Aruba', brandClass: 'brand-aruba', category: 'switch', icon: '🔀',
        model: 'CX 6300M',
        image: 'images/products/aruba-02.jpg',
        name: { 'zh-TW': 'Aruba CX 6300M 交換機', 'en': 'Aruba CX 6300M Switch' },
        desc: { 'zh-TW': '48埠千兆堆疊交換機，支援PoE++與VXLAN，適合園區接入與匯聚層。', 'en': '48-port Gigabit stackable switch with PoE++ and VXLAN for campus access and aggregation.' },
        specs: ['48x GE PoE++', '4x SFP56', 'VXLAN', 'Stackable', 'Aruba Central']
    },

    // ==================== HPE ====================
    {
        id: 'hpe-01', brand: 'HPE', brandClass: 'brand-hpe', category: 'server', icon: '🖥️',
        model: 'ProLiant DL380',
        image: 'images/products/hpe-01.jpg',
        name: { 'zh-TW': 'HPE ProLiant DL380 Gen10 伺服器', 'en': 'HPE ProLiant DL380 Gen10 Server' },
        desc: { 'zh-TW': '2U機架式伺服器，搭載Intel Xeon處理器，適用於虛擬化與高效能運算工作負載。', 'en': '2U rack server powered by Intel Xeon, ideal for virtualization and high-performance computing.' },
        specs: ['2U Rack', 'Intel Xeon Scalable', '24x DIMM', 'iLO 5', 'NVMe Ready']
    },
    {
        id: 'hpe-02', brand: 'HPE', brandClass: 'brand-hpe', category: 'server', icon: '💾',
        model: 'MSA 2060',
        image: 'images/products/hpe-02.jpg',
        name: { 'zh-TW': 'HPE MSA 2060 存儲陣列', 'en': 'HPE MSA 2060 Storage Array' },
        desc: { 'zh-TW': '入門級SAN/NAS存儲系統，支援SAS與NVMe SSD混插，為中小企業提供高性價比方案。', 'en': 'Entry-level SAN/NAS storage with mixed SAS and NVMe SSD support for SMBs at a competitive price.' },
        specs: ['2U Form Factor', '24x SFF', 'SAS / NVMe', '10GbE / 16Gb FC', 'Snapshots']
    },

    // ==================== Huawei ====================
    {
        id: 'huawei-01', brand: 'Huawei', brandClass: 'brand-huawei', category: 'switch', icon: '🔀',
        model: 'S5735-L48T4',
        image: 'images/products/huawei-01.jpg',
        name: { 'zh-TW': 'Huawei S5735-L48T4 交換機', 'en': 'Huawei S5735-L48T4 Switch' },
        desc: { 'zh-TW': '48埠千兆L3交換機，支援4個萬兆上行，適合企業園區接入層。', 'en': '48-port Gigabit L3 switch with 4x 10GbE uplinks for enterprise campus access layer.' },
        specs: ['48x GE', '4x 10GbE SFP+', 'L3 Routing', 'PoE+ Option', 'CloudEngine']
    },
    {
        id: 'huawei-02', brand: 'Huawei', brandClass: 'brand-huawei', category: 'ap', icon: '📶',
        model: 'AirEngine 6760',
        image: 'images/products/huawei-02.jpg',
        name: { 'zh-TW': 'Huawei AirEngine 6760 WiFi 6 AP', 'en': 'Huawei AirEngine 6760 WiFi 6 AP' },
        desc: { 'zh-TW': 'WiFi 6企業級無線AP，支援智慧天線技術，提供高密度場景無縫覆蓋。', 'en': 'WiFi 6 enterprise AP with smart antenna technology for seamless high-density coverage.' },
        specs: ['WiFi 6', 'Smart Antenna', '4x4 MIMO', '2.5GbE', 'IoT Ready']
    },

    // ==================== H3C ====================
    {
        id: 'h3c-01', brand: 'H3C', brandClass: 'brand-h3c', category: 'switch', icon: '🔀',
        model: 'S5560-EI',
        image: 'images/products/h3c-01.jpg',
        name: { 'zh-TW': 'H3C S5560-EI 系列交換機', 'en': 'H3C S5560-EI Series Switch' },
        desc: { 'zh-TW': '萬兆乙太網交換機，支援IRF堆疊技術，適合園區匯聚與核心層部署。', 'en': '10GbE Ethernet switch with IRF stacking technology for campus aggregation and core deployment.' },
        specs: ['48x 10GbE', 'IRF Stacking', 'L3 Routing', 'IPv6', 'VXLAN']
    },
    {
        id: 'h3c-02', brand: 'H3C', brandClass: 'brand-h3c', category: 'router', icon: '🌐',
        model: 'MSR36-20',
        image: 'images/products/h3c-02.jpg',
        name: { 'zh-TW': 'H3C MSR36-20 企業路由器', 'en': 'H3C MSR36-20 Enterprise Router' },
        desc: { 'zh-TW': '多業務安全路由器，整合防火牆、VPN與語音，適合中小型企業分支機構。', 'en': 'Multi-service secure router integrating firewall, VPN and voice for SMB branch offices.' },
        specs: ['Multi-Service', 'IPsec VPN', 'Built-in FW', 'Voice Ready', 'Modular']
    },

    // ==================== NVIDIA ====================
    {
        id: 'nvidia-01', brand: 'NVIDIA', brandClass: 'brand-nvidia', category: 'server', icon: '🧠',
        model: 'DGX H100',
        image: 'images/products/nvidia-01.jpg',
        name: { 'zh-TW': 'NVIDIA DGX H100 AI 伺服器', 'en': 'NVIDIA DGX H100 AI Server' },
        desc: { 'zh-TW': '搭載8張H100 Tensor Core GPU的AI運算平台，專為大模型訓練與推理設計。', 'en': 'AI computing platform with 8x H100 Tensor Core GPUs, designed for large model training and inference.' },
        specs: ['8x H100 GPU', 'NVLink', '640 GB HBM3', 'InfiniBand', 'DGX Software']
    },

    // ==================== Yealink ====================
    {
        id: 'yealink-01', brand: 'Yealink', brandClass: 'brand-yealink', category: 'video', icon: '🎥',
        model: 'MeetingBar A30',
        image: 'images/products/yealink-01.jpg',
        name: { 'zh-TW': 'Yealink MeetingBar A30 視訊會議系統', 'en': 'Yealink MeetingBar A30 Video Conferencing' },
        desc: { 'zh-TW': '一體式視訊會議設備，內建雙攝影機與AI追蹤，支援Teams與Zoom平台。', 'en': 'All-in-one video conferencing device with dual cameras and AI tracking, supporting Teams and Zoom.' },
        specs: ['Dual Camera', 'AI Tracking', '4K Output', 'Teams & Zoom', '8-Mic Array']
    },
    {
        id: 'yealink-02', brand: 'Yealink', brandClass: 'brand-yealink', category: 'video', icon: '📞',
        model: 'SIP-T54W',
        image: 'images/products/yealink-02.jpg',
        name: { 'zh-TW': 'Yealink SIP-T54W IP電話', 'en': 'Yealink SIP-T54W IP Phone' },
        desc: { 'zh-TW': '高階IP桌上電話，支援WiFi與藍牙，配備4.3吋彩色螢幕與HD音質。', 'en': 'High-end IP desk phone with WiFi and Bluetooth, featuring 4.3-inch color display and HD audio.' },
        specs: ['4.3" Color LCD', 'WiFi & BT', 'HD Audio', '16 SIP Lines', 'PoE']
    },

    // ==================== Poly ====================
    {
        id: 'poly-01', brand: 'Poly', brandClass: 'brand-poly', category: 'video', icon: '🎥',
        model: 'Studio X70',
        image: 'images/products/poly-01.jpg',
        name: { 'zh-TW': 'Poly Studio X70 視訊會議一體機', 'en': 'Poly Studio X70 All-in-One Video Bar' },
        desc: { 'zh-TW': '4K視訊會議一體機，內建AI取景與噪音消除，適合中大型會議室。', 'en': '4K all-in-one video bar with AI framing and noise blocking for medium to large meeting rooms.' },
        specs: ['4K Camera', 'AI Framing', 'Noise Block', 'Teams & Zoom', 'Dual Speaker']
    },

    // ==================== Grandstream ====================
    {
        id: 'grandstream-01', brand: 'Grandstream', brandClass: 'brand-grandstream', category: 'video', icon: '🎥',
        model: 'GVC3220',
        image: 'images/products/grandstream-01.jpg',
        name: { 'zh-TW': 'Grandstream GVC3220 視訊會議系統', 'en': 'Grandstream GVC3220 Video Conferencing' },
        desc: { 'zh-TW': '4K超高清視訊會議終端，支援雙顯示器輸出與多方會議，適合中型會議室。', 'en': '4K ultra-HD video conferencing terminal with dual display output and multi-party support for mid-size rooms.' },
        specs: ['4K Ultra HD', 'Dual Display', 'SIP & H.323', 'Content Sharing', 'Bluetooth']
    },

    // ==================== Ruckus ====================
    {
        id: 'ruckus-01', brand: 'Ruckus', brandClass: 'brand-ruckus', category: 'ap', icon: '📶',
        model: 'R650',
        image: 'images/products/ruckus-01.jpg',
        name: { 'zh-TW': 'Ruckus R650 WiFi 6 無線AP', 'en': 'Ruckus R650 WiFi 6 Access Point' },
        desc: { 'zh-TW': 'WiFi 6企業級AP，搭載BeamFlex+智慧天線，提供卓越的訊號覆蓋與干擾迴避。', 'en': 'WiFi 6 enterprise AP with BeamFlex+ smart antenna for superior coverage and interference mitigation.' },
        specs: ['WiFi 6', 'BeamFlex+', '2.5GbE', 'IoT Ready', 'CloudPath']
    },

    // ==================== Ubiquiti ====================
    {
        id: 'ubiquiti-01', brand: 'Ubiquiti', brandClass: 'brand-ubiquiti', category: 'ap', icon: '📶',
        model: 'U6-Pro',
        image: 'images/products/ubiquiti-01.jpg',
        name: { 'zh-TW': 'Ubiquiti UniFi U6-Pro WiFi 6 AP', 'en': 'Ubiquiti UniFi U6-Pro WiFi 6 AP' },
        desc: { 'zh-TW': '雙頻WiFi 6無線AP，支援4K-MIMO，透過UniFi控制器集中管理，性價比極高。', 'en': 'Dual-band WiFi 6 AP with 4K-MIMO, centrally managed via UniFi controller, excellent value.' },
        specs: ['WiFi 6', 'Dual Band', '4K-MIMO', 'UniFi Mgmt', 'PoE+']
    },

    // ==================== Ruijie ====================
    {
        id: 'ruijie-01', brand: 'Ruijie', brandClass: 'brand-ruijie', category: 'switch', icon: '🔀',
        model: 'RG-S5760C',
        image: 'images/products/ruijie-01.jpg',
        name: { 'zh-TW': 'Ruijie RG-S5760C 萬兆交換機', 'en': 'Ruijie RG-S5760C 10GbE Switch' },
        desc: { 'zh-TW': '48埠萬兆乙太網交換機，支援堆疊與SDN，適合企業園區匯聚層。', 'en': '48-port 10GbE Ethernet switch with stacking and SDN support for campus aggregation.' },
        specs: ['48x 10GbE', 'Stackable', 'SDN Ready', 'IPv6', 'PoE+ Option']
    },

    // ==================== Sangfor ====================
    {
        id: 'sangfor-01', brand: 'Sangfor', brandClass: 'brand-sangfor', category: 'security', icon: '🛡️',
        model: 'NGAF 2000',
        image: 'images/products/sangfor-01.jpg',
        name: { 'zh-TW': 'Sangfor NGAF 2000 下一代防火牆', 'en': 'Sangfor NGAF 2000 Next-Gen Firewall' },
        desc: { 'zh-TW': '整合AI引擎的下一代防火牆，提供威脅情報與SSL解密，全方位保護企業網路。', 'en': 'Next-gen firewall with AI engine, threat intelligence and SSL decryption for comprehensive network security.' },
        specs: ['AI Threat Intel', 'SSL Decrypt', 'IPS & AV', 'WAF', 'SD-WAN']
    },

    // ==================== Logitech ====================
    {
        id: 'logitech-01', brand: 'Logitech', brandClass: 'brand-logitech', category: 'video', icon: '📹',
        model: 'Rally Bar',
        image: 'images/products/logitech-01.jpg',
        name: { 'zh-TW': 'Logitech Rally Bar 視訊會議設備', 'en': 'Logitech Rally Bar Video Conferencing' },
        desc: { 'zh-TW': '一體化視訊會議設備，搭載4K攝影機與AI取景，支援USB與設備模式。', 'en': 'All-in-one video conferencing device with 4K camera and AI framing, supporting USB and appliance mode.' },
        specs: ['4K Camera', 'AI Framing', 'RightSound', 'USB Appliance', 'CollabOS']
    },

    // ==================== Avaya ====================
    {
        id: 'avaya-01', brand: 'Avaya', brandClass: 'brand-avaya', category: 'video', icon: '📞',
        model: 'J179',
        image: 'images/products/avaya-01.jpg',
        name: { 'zh-TW': 'Avaya J179 IP電話', 'en': 'Avaya J179 IP Phone' },
        desc: { 'zh-TW': '高階IP桌上電話，配備4.3吋彩色觸控螢幕，支援HD音質與藍牙連接。', 'en': 'High-end IP desk phone with 4.3-inch color touchscreen, HD audio and Bluetooth connectivity.' },
        specs: ['4.3" Touchscreen', 'HD Audio', 'Bluetooth', '8 Lines', 'PoE']
    },

    // ==================== Fanvil ====================
    {
        id: 'fanvil-01', brand: 'Fanvil', brandClass: 'brand-fanvil', category: 'video', icon: '📞',
        model: 'X7A',
        image: 'images/products/fanvil-01.jpg',
        name: { 'zh-TW': 'Fanvil X7A 高階IP電話', 'en': 'Fanvil X7A Premium IP Phone' },
        desc: { 'zh-TW': 'Android系統高階IP電話，配備7吋彩色觸控螢幕與HD音質，支援視訊通話。', 'en': 'Android-based premium IP phone with 7-inch color touchscreen, HD audio and video calling support.' },
        specs: ['7" Touchscreen', 'Android OS', 'HD Audio', 'Video Call', 'WiFi & BT']
    },

    // ==================== APC ====================
    {
        id: 'apc-01', brand: 'APC', brandClass: 'brand-apc', category: 'security', icon: '🔋',
        model: 'Smart-UPS 3000',
        image: 'images/products/apc-01.jpg',
        name: { 'zh-TW': 'APC Smart-UPS 3000VA 不斷電系統', 'en': 'APC Smart-UPS 3000VA UPS' },
        desc: { 'zh-TW': '線互動式UPS，提供純正弦波輸出與智慧管理，保護關鍵網路設備。', 'en': 'Line-interactive UPS with pure sine wave output and smart management to protect critical network equipment.' },
        specs: ['3000VA / 2700W', 'Pure Sine Wave', 'SmartConnect', 'LCD Display', 'Network Card']
    }
];

// Expose brand info globally
window.brandList = brandList;
window.brandColors = brandColors;
window.brandLogos = brandLogos;
window.brandClassFor = brandClassFor;
window.productsData = productsData;
