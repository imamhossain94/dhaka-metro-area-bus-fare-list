// Dhaka Metro Area Bus Fare Calculator & Directory

let busData = { routes: [], places: [] };
let currentLang = 'en';
let minFare = 10;
let farePerKm = 2.45;
let studentConcession = 50; // 50% discount
let isStudentPassActive = false;
let currentView = 'grid-view';
let currentZoomLevel = 1.0;

const popularHubs = [
    { en: 'Farmgate', bn: 'ফার্মগেট' },
    { en: 'Mirpur-10', bn: 'মিরপুর-১০' },
    { en: 'Motijheel', bn: 'মতিঝিল' },
    { en: 'Shahbag', bn: 'শাহবাগ' },
    { en: 'Gulistan', bn: 'গুলিস্তান' },
    { en: 'Uttara', bn: 'উত্তরা' },
    { en: 'Mohakhali', bn: 'মহাখালী' },
    { en: 'Jatrabari', bn: 'যাত্রাবাড়ী' }
];

const translations = {
    en: {
        'lbl-lang': 'Language / ভাষা',
        'lbl-route': 'Route (Optional)',
        'lbl-route-mob': 'Route (Optional)',
        'lbl-from': 'Starting Location',
        'lbl-from-mob': 'Starting Location',
        'lbl-to': 'Destination',
        'lbl-to-mob': 'Destination',
        'lbl-swap': 'Swap',
        'lbl-popular': 'Popular Hubs',
        'lbl-popular-mob': 'Popular Hubs',
        'lbl-student-title': 'Student Pass',
        'lbl-student-title-mob': 'Student Pass',
        'lbl-student-sub': '50% concession',
        'lbl-student-sub-mob': '50% concession',
        'lbl-calc-btn': 'Calculate Fare',
        'lbl-calc-btn-mob': 'Calculate Fare',
        'nav-calc': 'Calculator',
        'mob-nav-calc': 'Calculator',
        'nav-chart': 'Fare Chart',
        'mob-nav-chart': 'Fare Chart',
        'nav-routes': 'All Routes',
        'mob-nav-routes': 'All Routes',
        'main-title-calc': 'Fare Results',
        'main-title-chart': 'Fare Chart Matrix',
        'main-title-routes': 'Bus Routes Directory',
        'lbl-mobile-search-title': 'Plan Your Commute',
        'lbl-empty-title': 'Ready to Calculate Bus Fare',
        'lbl-empty-desc': 'Choose your starting bus stop and destination to find all matching bus routes, standard fares, student pass rates, and intermediate stops.',
        'lbl-tip-1': 'Tap popular hubs for 1-click station selection',
        'lbl-tip-2': 'Toggle student pass for half-fare calculations',
        'lbl-chart-route': 'Select Route for Chart',
        'lbl-chart-hint': 'Tap any cell to inspect fare between stations',
        'lbl-stat-stops': 'Stops',
        'lbl-stat-dist': 'km',
        'lbl-stat-fare-range': 'Fare',
        'lbl-insp-dist': 'Distance',
        'lbl-insp-fare': 'Regular Fare',
        'lbl-insp-student': 'Student Fare',
        'modal-title': 'Configuration',
        'lbl-min-fare': 'Minimum Fare (Tk)',
        'lbl-min-fare-help': 'Official BRTA minimum fare is 10 Tk',
        'lbl-fare-km': 'Fare per KM (Tk)',
        'lbl-fare-km-help': 'Official BRTA rate is 2.45 Tk/km',
        'lbl-student-concession': 'Student Concession (%)',
        'lbl-student-help': 'Default 50% discount for half-pass',
        'lbl-save-settings': 'Save Settings',
        'select-all': 'All Routes',
        'select-from': 'Select Starting Location',
        'select-to': 'Select Destination',
        'routes-search-ph': 'Search routes by code, name, or stop...',
        'tk': 'Tk',
        'km': 'km',
        'distance': 'Distance',
        'fare': 'Fare',
        'regular-fare': 'Regular Fare',
        'student-fare': 'Student Fare',
        'route': 'Route',
        'stops': 'stops',
        'no-route': 'No direct route found between these locations.',
        'select-req': 'Please select both starting location and destination.',
        'chart-empty': 'Select a route to view its fare chart.',
        'copied-msg': 'Route details copied to clipboard!',
        'view-chart': 'View Chart',
        'copy-details': 'Copy Info',
        'direct-route': 'Direct Route',
        'routes-count': 'Showing {count} Routes',
        'routes-found': 'Found {count} matching routes'
    },
    bn: {
        'lbl-lang': 'Language / ভাষা',
        'lbl-route': 'রুট (ঐচ্ছিক)',
        'lbl-route-mob': 'রুট (ঐচ্ছিক)',
        'lbl-from': 'শুরুর স্থান',
        'lbl-from-mob': 'শুরুর স্থান',
        'lbl-to': 'গন্তব্য স্থান',
        'lbl-to-mob': 'গন্তব্য স্থান',
        'lbl-swap': 'অদলবদল',
        'lbl-popular': 'জনপ্রিয় স্থানসমূহ',
        'lbl-popular-mob': 'জনপ্রিয় স্থানসমূহ',
        'lbl-student-title': 'শিক্ষার্থী পাস',
        'lbl-student-title-mob': 'শিক্ষার্থী পাস',
        'lbl-student-sub': '৫০% ছাড় (হাফ পাস)',
        'lbl-student-sub-mob': '৫০% ছাড় (হাফ পাস)',
        'lbl-calc-btn': 'ভাড়া হিসাব করুন',
        'lbl-calc-btn-mob': 'ভাড়া হিসাব করুন',
        'nav-calc': 'ক্যালকুলেটর',
        'mob-nav-calc': 'ক্যালকুলেটর',
        'nav-chart': 'ভাড়া চার্ট',
        'mob-nav-chart': 'ভাড়া চার্ট',
        'nav-routes': 'সকল রুট',
        'mob-nav-routes': 'সকল রুট',
        'main-title-calc': 'ভাড়ার ফলাফল',
        'main-title-chart': 'ভাড়া চার্ট ম্যাট্রিক্স',
        'main-title-routes': 'বাস রুট নির্দেশিকা',
        'lbl-mobile-search-title': 'ভ্রমণের ভাড়া খুঁজুন',
        'lbl-empty-title': 'বাস ভাড়া হিসাব করতে প্রস্তুত',
        'lbl-empty-desc': 'উপলব্ধ বাস রুট, নিয়মিত ভাড়া, শিক্ষার্থী হাফ পাস এবং স্টপেজের তালিকা দেখতে শুরুর স্থান ও গন্তব্য নির্বাচন করুন।',
        'lbl-tip-1': 'দ্রুত স্টপ নির্বাচনের জন্য জনপ্রিয় স্থানে ট্যাপ করুন',
        'lbl-tip-2': 'হাফ পাস ভাড়ার জন্য শিক্ষার্থী পাস চালু করুন',
        'lbl-chart-route': 'চার্টের জন্য রুট নির্বাচন করুন',
        'lbl-chart-hint': 'স্টেশনের মধ্যবর্তী ভাড়া দেখতে যেকোনো ঘরে ট্যাপ করুন',
        'lbl-stat-stops': 'স্টপ',
        'lbl-stat-dist': 'কিমি',
        'lbl-stat-fare-range': 'ভাড়া',
        'lbl-insp-dist': 'দূরত্ব',
        'lbl-insp-fare': 'নিয়মিত ভাড়া',
        'lbl-insp-student': 'শিক্ষার্থী ভাড়া',
        'modal-title': 'কনফিগারেশন',
        'lbl-min-fare': 'সর্বনিম্ন ভাড়া (টাকা)',
        'lbl-min-fare-help': 'বিআরটিএ অনুমোদিত সর্বনিম্ন ভাড়া ১০ টাকা',
        'lbl-fare-km': 'প্রতি কিমি ভাড়া (টাকা)',
        'lbl-fare-km-help': 'বিআরটিএ অনুমোদিত প্রতি কিমি ভাড়া ২.৪৫ টাকা',
        'lbl-student-concession': 'শিক্ষার্থী ছাড় (%)',
        'lbl-student-help': 'হাফ পাসের জন্য ৫০% ছাড়',
        'lbl-save-settings': 'সেটিংস সেভ করুন',
        'select-all': 'সকল রুট',
        'select-from': 'শুরুর স্থান নির্বাচন করুন',
        'select-to': 'গন্তব্য নির্বাচন করুন',
        'routes-search-ph': 'রুট কোড, নাম বা স্টপ খুঁজুন...',
        'tk': 'টাকা',
        'km': 'কিমি',
        'distance': 'দূরত্ব',
        'fare': 'ভাড়া',
        'regular-fare': 'নিয়মিত ভাড়া',
        'student-fare': 'শিক্ষার্থী ভাড়া',
        'route': 'রুট',
        'stops': 'স্টপ',
        'no-route': 'এই দুটি স্থানের মধ্যে সরাসরি কোনো রুট পাওয়া যায়নি।',
        'select-req': 'অনুগ্রহ করে শুরুর স্থান এবং গন্তব্য উভয়ই নির্বাচন করুন।',
        'chart-empty': 'ভাড়া চার্ট দেখতে একটি রুট নির্বাচন করুন।',
        'copied-msg': 'রুটের বিবরণ ক্লিপবোর্ডে কপি করা হয়েছে!',
        'view-chart': 'চার্ট দেখুন',
        'copy-details': 'কপি করুন',
        'direct-route': 'সরাসরি রুট',
        'routes-count': '{count} টি রুট দেখানো হচ্ছে',
        'routes-found': '{count} টি উপযুক্ত রুট পাওয়া গেছে'
    }
};

// --- INITIALIZATION ---
async function init() {
    toggleLoader(true);
    try {
        const response = await fetch('./web_data/data.json');
        busData = await response.json();

        loadCookies();
        setupTheme();
        initUI();
        applyTranslations();
        populateDropdowns();
        renderPopularHubs();

        // Default fare chart selected with first route!
        if (busData.routes && busData.routes.length > 0) {
            const chartSelect = document.getElementById('chart-route-select');
            chartSelect.value = busData.routes[0].code.en;
            renderChart();
        }

        renderRoutesDirectory();
        toggleLoader(false);
    } catch (e) {
        console.error('System Failure', e);
        toggleLoader(false);
    }
}

// --- COOKIES ---
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function loadCookies() {
    const mf = getCookie('min_fair');
    if (mf) minFare = parseFloat(mf);

    const fpkm = getCookie('fair_par_km');
    if (fpkm) farePerKm = parseFloat(fpkm);

    const sc = getCookie('student_concession');
    if (sc) studentConcession = parseFloat(sc);

    document.getElementById('min-fare-input').value = minFare;
    document.getElementById('fare-km-input').value = farePerKm;
    document.getElementById('student-concession-input').value = studentConcession;
}

function saveConfig() {
    minFare = parseFloat(document.getElementById('min-fare-input').value) || 10;
    farePerKm = parseFloat(document.getElementById('fare-km-input').value) || 2.45;
    studentConcession = parseFloat(document.getElementById('student-concession-input').value) || 50;

    setCookie('min_fair', minFare, 365);
    setCookie('fair_par_km', farePerKm, 365);
    setCookie('student_concession', studentConcession, 365);

    document.getElementById('settings-modal').classList.remove('active');
    showToast(translations[currentLang]['lbl-save-settings']);

    if (currentView === 'grid-view') {
        calculateFare();
    } else if (currentView === 'tree-view') {
        renderChart();
    }
}

// --- THEME ---
function setupTheme() {
    const html = document.documentElement;
    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);
    updateThemeIcons(saved);

    const toggleTheme = () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcons(next);
    };

    document.getElementById('theme-btn').onclick = toggleTheme;
    document.getElementById('theme-btn-mobile').onclick = toggleTheme;
}

function updateThemeIcons(theme) {
    const iconName = theme === 'dark' ? 'sun' : 'moon';
    document.querySelectorAll('.theme-icon').forEach(icon => {
        icon.setAttribute('data-lucide', iconName);
    });
    lucide.createIcons();
}

// --- UI SETUP ---
function initUI() {
    // Navigation Switching (Both Desktop & Mobile Bottom Nav)
    const switchView = (targetView) => {
        currentView = targetView;

        // Update active class on desktop sidebar buttons
        document.querySelectorAll('.nav-btn[data-view]').forEach(b => {
            b.classList.toggle('active', b.dataset.view === targetView);
        });

        // Update active class on mobile bottom nav buttons
        document.querySelectorAll('.mobile-nav-btn[data-view]').forEach(b => {
            b.classList.toggle('active', b.dataset.view === targetView);
        });

        // Hide/show view sections
        document.querySelectorAll('.view-content').forEach(v => v.classList.add('hidden'));
        const activeSection = document.getElementById(targetView);
        if (activeSection) activeSection.classList.remove('hidden');

        // Update Main Header
        const t = translations[currentLang];
        const mainTitle = document.getElementById('main-title');
        const resultCount = document.getElementById('result-count');

        if (targetView === 'grid-view') {
            mainTitle.innerText = t['main-title-calc'];
            calculateFare(false);
        } else if (targetView === 'tree-view') {
            mainTitle.innerText = t['main-title-chart'];
            resultCount.innerText = t['lbl-chart-hint'];
            // Render first route if not already rendered
            if (!document.getElementById('chart-container').hasChildNodes()) {
                renderChart();
            }
        } else if (targetView === 'routes-view') {
            mainTitle.innerText = t['main-title-routes'];
            resultCount.innerText = t['routes-count'].replace('{count}', busData.routes.length);
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
        btn.onclick = () => switchView(btn.dataset.view);
    });

    document.querySelectorAll('.mobile-nav-btn[data-view]').forEach(btn => {
        btn.onclick = () => switchView(btn.dataset.view);
    });

    // Language Toggle (Desktop & Mobile)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            currentLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.lang === currentLang);
            });
            applyTranslations();
            populateDropdowns(true);
            renderPopularHubs();
            if (currentView === 'grid-view') calculateFare(false);
            else if (currentView === 'tree-view') renderChart();
            else if (currentView === 'routes-view') renderRoutesDirectory();
        };
    });

    // Settings Modal
    const openSettings = () => document.getElementById('settings-modal').classList.add('active');
    const closeSettings = () => document.getElementById('settings-modal').classList.remove('active');

    document.getElementById('settings-btn').onclick = openSettings;
    document.getElementById('settings-btn-mobile').onclick = openSettings;
    document.getElementById('close-settings').onclick = closeSettings;
    document.getElementById('save-settings-btn').onclick = saveConfig;

    document.getElementById('settings-modal').onclick = (e) => {
        if (e.target.id === 'settings-modal') closeSettings();
    };

    // Swap Buttons (Desktop & Mobile)
    const handleSwap = () => {
        const fromSelect = document.getElementById('from-select');
        const toSelect = document.getElementById('to-select');
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        syncInputs('from', fromSelect.value);
        syncInputs('to', toSelect.value);

        if (fromSelect.value && toSelect.value) {
            calculateFare();
        }
    };

    document.getElementById('swap-btn').onclick = handleSwap;
    document.getElementById('swap-btn-mob').onclick = handleSwap;

    // Clear / Reset Buttons
    const handleClear = () => {
        document.getElementById('route-select').value = '';
        document.getElementById('from-select').value = '';
        document.getElementById('to-select').value = '';
        syncInputs('route', '');
        syncInputs('from', '');
        syncInputs('to', '');
        populateDropdowns(false);

        // Reset results to empty state
        document.getElementById('results-grid').innerHTML = getEmptyStateHTML();
        document.getElementById('results-summary-banner').classList.add('hidden');
        document.getElementById('result-count').innerText = translations[currentLang]['select-req'];
        lucide.createIcons();
    };

    document.getElementById('clear-btn').onclick = handleClear;
    document.getElementById('clear-btn-mob').onclick = handleClear;

    // Calculate Buttons
    document.getElementById('calculate-btn').onclick = () => calculateFare();
    document.getElementById('calculate-btn-mob').onclick = () => calculateFare();

    // Student Pass Toggle Sync
    const handleStudentToggle = (isActive) => {
        isStudentPassActive = isActive;
        document.getElementById('student-pass-toggle').checked = isActive;
        document.getElementById('student-pass-toggle-mob').checked = isActive;
        calculateFare(false);
        if (currentView === 'tree-view') renderChart();
    };

    document.getElementById('student-pass-toggle').onchange = (e) => handleStudentToggle(e.target.checked);
    document.getElementById('student-pass-toggle-mob').onchange = (e) => handleStudentToggle(e.target.checked);

    // Filter Sync Handlers (Desktop <-> Mobile)
    setupInputSync('route-select', 'route-select-mob', 'route', () => populateDropdowns(false));
    setupInputSync('from-select', 'from-select-mob', 'from');
    setupInputSync('to-select', 'to-select-mob', 'to');

    // Chart Route Stepper & Dropdown
    document.getElementById('chart-route-select').onchange = renderChart;

    document.getElementById('chart-prev-btn').onclick = () => {
        const select = document.getElementById('chart-route-select');
        if (select.selectedIndex > 0) {
            select.selectedIndex -= 1;
            renderChart();
        }
    };

    document.getElementById('chart-next-btn').onclick = () => {
        const select = document.getElementById('chart-route-select');
        if (select.selectedIndex < select.options.length - 1) {
            select.selectedIndex += 1;
            renderChart();
        }
    };

    // Chart Zoom Controls
    document.getElementById('zoom-in-btn').onclick = () => adjustZoom(0.1);
    document.getElementById('zoom-out-btn').onclick = () => adjustZoom(-0.1);
    document.getElementById('zoom-reset-btn').onclick = () => resetZoom();

    // Inspector Close Button
    document.getElementById('close-inspector-btn').onclick = () => {
        document.getElementById('selected-cell-inspector').classList.add('hidden');
        document.querySelectorAll('.fare-cell.selected').forEach(c => c.classList.remove('selected'));
    };

    // Mobile Search Card Collapse
    const mobileCollapseBtn = document.getElementById('mobile-filter-collapse-btn');
    if (mobileCollapseBtn) {
        mobileCollapseBtn.onclick = () => {
            const body = document.getElementById('mobile-filter-body');
            const chevron = document.getElementById('filter-chevron');
            body.classList.toggle('collapsed');
            const isCollapsed = body.classList.contains('collapsed');
            chevron.setAttribute('data-lucide', isCollapsed ? 'chevron-down' : 'chevron-up');
            lucide.createIcons();
        };
    }

    // All Routes Search Input
    const routesSearch = document.getElementById('routes-search-input');
    const clearSearchBtn = document.getElementById('clear-routes-search');
    routesSearch.oninput = () => {
        const val = routesSearch.value.trim();
        clearSearchBtn.classList.toggle('hidden', val.length === 0);
        filterRoutesDirectory(val);
    };
    clearSearchBtn.onclick = () => {
        routesSearch.value = '';
        clearSearchBtn.classList.add('hidden');
        filterRoutesDirectory('');
    };

    lucide.createIcons();
}

function setupInputSync(idDesktop, idMobile, type, callback) {
    const elDesktop = document.getElementById(idDesktop);
    const elMobile = document.getElementById(idMobile);

    elDesktop.onchange = () => {
        elMobile.value = elDesktop.value;
        if (callback) callback();
    };

    elMobile.onchange = () => {
        elDesktop.value = elMobile.value;
        if (callback) callback();
    };
}

function syncInputs(type, val) {
    if (type === 'route') {
        document.getElementById('route-select').value = val;
        document.getElementById('route-select-mob').value = val;
    } else if (type === 'from') {
        document.getElementById('from-select').value = val;
        document.getElementById('from-select-mob').value = val;
    } else if (type === 'to') {
        document.getElementById('to-select').value = val;
        document.getElementById('to-select-mob').value = val;
    }
}

// --- POPULAR HUBS ---
function renderPopularHubs() {
    const containers = [
        document.getElementById('popular-chips'),
        document.getElementById('popular-chips-mob')
    ];

    containers.forEach(container => {
        if (!container) return;
        container.innerHTML = '';

        popularHubs.forEach(hub => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'chip-btn';
            btn.innerHTML = `<i data-lucide="map-pin" style="width: 12px; height: 12px;"></i> ${hub[currentLang]}`;
            btn.onclick = () => {
                const normHub = hub.en.toLowerCase();
                const fromSelect = document.getElementById('from-select');
                const toSelect = document.getElementById('to-select');

                if (!fromSelect.value) {
                    fromSelect.value = normHub;
                    syncInputs('from', normHub);
                } else if (!toSelect.value && fromSelect.value !== normHub) {
                    toSelect.value = normHub;
                    syncInputs('to', normHub);
                    calculateFare();
                } else {
                    fromSelect.value = normHub;
                    syncInputs('from', normHub);
                }
            };
            container.appendChild(btn);
        });
    });

    lucide.createIcons();
}

// --- TRANSLATIONS ---
function applyTranslations() {
    const t = translations[currentLang];
    for (const [id, text] of Object.entries(t)) {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = text;
        }
    }

    const routesSearch = document.getElementById('routes-search-input');
    if (routesSearch) routesSearch.placeholder = t['routes-search-ph'];

    lucide.createIcons();
}

// --- POPULATE DROPDOWNS ---
function populateDropdowns(fullRefresh = true) {
    const t = translations[currentLang];
    const routeSelect = document.getElementById('route-select');
    const routeSelectMob = document.getElementById('route-select-mob');
    const chartRouteSelect = document.getElementById('chart-route-select');

    if (fullRefresh) {
        const selectedRoute = routeSelect.value;
        const selectedChartRoute = chartRouteSelect.value;

        const optionsHtml = `<option value="">${t['select-all']}</option>` +
            busData.routes.map(r => {
                const label = `${r.code[currentLang]} (${r.name[currentLang]})`;
                return `<option value="${r.code.en}">${label}</option>`;
            }).join('');

        routeSelect.innerHTML = optionsHtml;
        routeSelectMob.innerHTML = optionsHtml;

        // Chart Route Select: All routes without empty option
        chartRouteSelect.innerHTML = busData.routes.map(r => {
            const label = `${r.code[currentLang]} - ${r.name[currentLang]}`;
            return `<option value="${r.code.en}">${label}</option>`;
        }).join('');

        routeSelect.value = selectedRoute || '';
        routeSelectMob.value = selectedRoute || '';

        // Default fare chart selected with first route!
        if (selectedChartRoute && busData.routes.some(r => r.code.en === selectedChartRoute)) {
            chartRouteSelect.value = selectedChartRoute;
        } else if (busData.routes.length > 0) {
            chartRouteSelect.value = busData.routes[0].code.en;
        }
    }

    // Populate From / To selects
    const fromSelect = document.getElementById('from-select');
    const fromSelectMob = document.getElementById('from-select-mob');
    const toSelect = document.getElementById('to-select');
    const toSelectMob = document.getElementById('to-select-mob');

    const currentFrom = fromSelect.value;
    const currentTo = toSelect.value;

    let placesList = [];
    const activeRouteId = routeSelect.value;

    if (activeRouteId) {
        const r = busData.routes.find(x => x.code.en === activeRouteId);
        if (r) {
            const added = new Set();
            r.stops.forEach(s => {
                const val = s.name.en.trim().toLowerCase();
                if (!added.has(val)) {
                    added.add(val);
                    placesList.push({ val, label: s.name[currentLang] });
                }
            });
        }
    } else {
        const added = new Set();
        busData.places.forEach(p => {
            const val = p.en.trim().toLowerCase();
            if (!added.has(val)) {
                added.add(val);
                placesList.push({ val, label: p[currentLang] || p.en });
            }
        });
    }

    // Sort alphabetically by current language
    placesList.sort((a, b) => a.label.localeCompare(b.label, currentLang === 'bn' ? 'bn' : 'en'));

    const fromOptionsHtml = `<option value="">${t['select-from']}</option>` +
        placesList.map(p => `<option value="${p.val}">${p.label}</option>`).join('');

    const toOptionsHtml = `<option value="">${t['select-to']}</option>` +
        placesList.map(p => `<option value="${p.val}">${p.label}</option>`).join('');

    fromSelect.innerHTML = fromOptionsHtml;
    fromSelectMob.innerHTML = fromOptionsHtml;
    toSelect.innerHTML = toOptionsHtml;
    toSelectMob.innerHTML = toOptionsHtml;

    // Restore selected values if valid
    if (fromSelect.querySelector(`option[value="${currentFrom}"]`)) {
        fromSelect.value = currentFrom;
        fromSelectMob.value = currentFrom;
    }
    if (toSelect.querySelector(`option[value="${currentTo}"]`)) {
        toSelect.value = currentTo;
        toSelectMob.value = currentTo;
    }
}

// --- FARE CALCULATION LOGIC ---
function calculateExactFare(dist) {
    let f = dist * farePerKm;
    if (f < minFare) f = minFare;
    return Math.ceil(f);
}

function calculateStudentFare(regularFare) {
    // BRTA Half Pass: 50% discount with min fare rule
    const discounted = Math.ceil(regularFare * (1 - (studentConcession / 100)));
    return Math.max(minFare, discounted);
}

function calculateFare(scrollToResults = true) {
    const fromVal = document.getElementById('from-select').value;
    const toVal = document.getElementById('to-select').value;
    const routeVal = document.getElementById('route-select').value;

    const countEl = document.getElementById('result-count');
    const grid = document.getElementById('results-grid');
    const summaryBanner = document.getElementById('results-summary-banner');
    const t = translations[currentLang];

    if (!fromVal || !toVal) {
        if (!grid.hasChildNodes() || grid.querySelector('#empty-state')) {
            grid.innerHTML = getEmptyStateHTML();
            lucide.createIcons();
        }
        countEl.innerText = t['select-req'];
        summaryBanner.classList.add('hidden');
        return;
    }

    if (fromVal === toVal) {
        grid.innerHTML = `
            <div class="result-card" style="text-align: center; padding: 2rem;">
                <i data-lucide="info" style="width: 32px; height: 32px; color: var(--primary-light); margin: 0 auto 0.5rem auto;"></i>
                <h3>${t['distance']}: 0 ${t['km']}</h3>
                <p style="color: var(--text-gray); margin-top: 0.5rem;">${t['fare']}: <strong>${minFare} ${t['tk']}</strong> (${t['lbl-min-fare-help']})</p>
            </div>
        `;
        countEl.innerText = '0 results';
        summaryBanner.classList.add('hidden');
        lucide.createIcons();
        return;
    }

    let matches = [];

    busData.routes.forEach(r => {
        if (routeVal && r.code.en !== routeVal) return;

        let fromStop = null;
        let toStop = null;

        for (let i = 0; i < r.stops.length; i++) {
            const norm = r.stops[i].name.en.trim().toLowerCase();
            if (!fromStop && norm === fromVal) fromStop = { stop: r.stops[i], idx: i };
            if (!toStop && norm === toVal) toStop = { stop: r.stops[i], idx: i };
        }

        if (fromStop && toStop) {
            const dist = Math.abs(fromStop.stop.distance - toStop.stop.distance);
            const regularFare = calculateExactFare(dist);
            const studentFare = calculateStudentFare(regularFare);

            let path = [];
            const startIdx = Math.min(fromStop.idx, toStop.idx);
            const endIdx = Math.max(fromStop.idx, toStop.idx);
            for (let i = startIdx; i <= endIdx; i++) {
                path.push(r.stops[i].name[currentLang]);
            }
            if (fromStop.idx > toStop.idx) path.reverse();

            matches.push({
                route: r,
                from: fromStop.stop.name[currentLang],
                to: toStop.stop.name[currentLang],
                distance: dist.toFixed(1),
                regularFare: regularFare,
                studentFare: studentFare,
                path: path,
                stopCount: Math.abs(toStop.idx - fromStop.idx) + 1
            });
        }
    });

    if (matches.length === 0) {
        countEl.innerText = t['no-route'];
        summaryBanner.classList.add('hidden');
        grid.innerHTML = `
            <div class="empty-state-card">
                <div class="empty-icon-wrap" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">
                    <i data-lucide="route-off" class="empty-icon"></i>
                </div>
                <h3>${t['no-route']}</h3>
                <p style="color: var(--text-gray);">${currentLang === 'bn' ? 'অনুগ্রহ করে কাছাকাছি অন্য কোনো স্টপ বা ভিন্ন রুট চেষ্টা করুন।' : 'Try selecting alternative neighboring stops or choose a connecting transit point.'}</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Sort by fare then distance
    matches.sort((a, b) => a.regularFare - b.regularFare || parseFloat(a.distance) - parseFloat(b.distance));

    // Update Summary Banner
    const minResultFare = matches[0].regularFare;
    const shortestDist = Math.min(...matches.map(m => parseFloat(m.distance)));

    summaryBanner.classList.remove('hidden');
    summaryBanner.innerHTML = `
        <div class="summary-left">
            <i data-lucide="check-circle-2" style="color: #10b981; width: 18px; height: 18px;"></i>
            <span>${t['routes-found'].replace('{count}', matches.length)}</span>
        </div>
        <div class="summary-badges">
            <span class="summary-badge">
                <i data-lucide="circle-dollar-sign" style="width: 14px; height: 14px;"></i>
                ${t['fare']}: ${minResultFare} ${t['tk']}
            </span>
            <span class="summary-badge">
                <i data-lucide="navigation" style="width: 14px; height: 14px;"></i>
                ${t['distance']}: ${shortestDist} ${t['km']}
            </span>
        </div>
    `;

    countEl.innerText = t['routes-found'].replace('{count}', matches.length);
    grid.innerHTML = '';

    matches.forEach(m => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const displayFare = isStudentPassActive ? m.studentFare : m.regularFare;

        card.innerHTML = `
            <div class="card-top">
                <div>
                    <div class="route-badge-row">
                        <span class="route-code-badge">${m.route.code[currentLang]}</span>
                        <span class="route-type-badge">
                            <i data-lucide="map-pin" style="width: 12px; height: 12px;"></i>
                            ${m.stopCount} ${t['stops']}
                        </span>
                        <span class="route-type-badge">
                            <i data-lucide="check" style="width: 12px; height: 12px; color: #10b981;"></i>
                            ${t['direct-route']}
                        </span>
                    </div>
                    <h3>${m.route.name[currentLang]}</h3>
                </div>
                <div class="fare-price-box">
                    <span class="standard-fare">${displayFare} <small>${t['tk']}</small></span>
                    <span class="distance-sub">
                        <i data-lucide="navigation" style="width: 13px; height: 13px;"></i>
                        ${m.distance} ${t['km']}
                    </span>
                    <span class="student-fare-badge">
                        <i data-lucide="graduation-cap" style="width: 13px; height: 13px;"></i>
                        ${t['student-fare']}: ${m.studentFare} ${t['tk']}
                    </span>
                </div>
            </div>

            <div class="route-path-container">
                <div class="route-path-header">
                    <span>${t['route']}</span>
                    <span>${m.path.length} ${t['stops']}</span>
                </div>
                <div class="path-stops-wrap">
                    ${m.path.map((p, i) => `
                        <span class="path-stop ${i === 0 || i === m.path.length - 1 ? 'highlight' : ''}">
                            ${p}
                        </span>
                        ${i < m.path.length - 1 ? `<i data-lucide="arrow-right" class="path-arrow"></i>` : ''}
                    `).join('')}
                </div>
            </div>

            <div class="card-actions">
                <button class="card-action-btn copy-btn" data-info="Route: ${m.route.code.en} | ${m.from} -> ${m.to} | Distance: ${m.distance}km | Fare: ${m.regularFare}Tk (Student: ${m.studentFare}Tk)">
                    <i data-lucide="copy"></i>
                    <span>${t['copy-details']}</span>
                </button>
                <button class="card-action-btn view-chart-btn" data-route="${m.route.code.en}">
                    <i data-lucide="table"></i>
                    <span>${t['view-chart']}</span>
                </button>
            </div>
        `;

        // Card action listeners
        card.querySelector('.copy-btn').onclick = (e) => {
            const textToCopy = e.currentTarget.dataset.info;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(t['copied-msg']);
            });
        };

        card.querySelector('.view-chart-btn').onclick = (e) => {
            const routeCode = e.currentTarget.dataset.route;
            openRouteChart(routeCode);
        };

        grid.appendChild(card);
    });

    lucide.createIcons();

    if (scrollToResults && window.innerWidth <= 768) {
        summaryBanner.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function openRouteChart(routeCode) {
    const chartSelect = document.getElementById('chart-route-select');
    chartSelect.value = routeCode;

    // Switch view to tree-view (Fare Chart)
    document.querySelectorAll('.nav-btn[data-view]').forEach(b => {
        b.classList.toggle('active', b.dataset.view === 'tree-view');
    });
    document.querySelectorAll('.mobile-nav-btn[data-view]').forEach(b => {
        b.classList.toggle('active', b.dataset.view === 'tree-view');
    });
    document.querySelectorAll('.view-content').forEach(v => v.classList.add('hidden'));
    document.getElementById('tree-view').classList.remove('hidden');

    currentView = 'tree-view';
    document.getElementById('main-title').innerText = translations[currentLang]['main-title-chart'];
    document.getElementById('result-count').innerText = translations[currentLang]['lbl-chart-hint'];

    renderChart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getEmptyStateHTML() {
    const t = translations[currentLang];
    return `
        <div class="empty-state-card" id="empty-state">
            <div class="empty-icon-wrap">
                <i data-lucide="compass" class="empty-icon"></i>
            </div>
            <h3>${t['lbl-empty-title']}</h3>
            <p>${t['lbl-empty-desc']}</p>
            <div class="quick-tips">
                <div class="tip-item">
                    <i data-lucide="sparkles" class="tip-icon"></i>
                    <span>${t['lbl-tip-1']}</span>
                </div>
                <div class="tip-item">
                    <i data-lucide="graduation-cap" class="tip-icon"></i>
                    <span>${t['lbl-tip-2']}</span>
                </div>
            </div>
        </div>
    `;
}

// --- TRIANGULAR FARE CHART ---
function renderChart() {
    const routeVal = document.getElementById('chart-route-select').value;
    const container = document.getElementById('chart-container');
    const t = translations[currentLang];
    container.innerHTML = '';

    // Hide inspector when changing route
    document.getElementById('selected-cell-inspector').classList.add('hidden');

    if (!routeVal) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-gray); padding: 3rem;">${t['chart-empty']}</div>`;
        return;
    }

    const r = busData.routes.find(x => x.code.en === routeVal);
    if (!r) return;

    const stops = r.stops;
    const n = stops.length;

    // Update Route Overview Stat Strip
    document.getElementById('stat-stops-count').innerText = n;
    const totalDist = stops[n - 1].distance.toFixed(1);
    document.getElementById('stat-distance').innerText = totalDist;

    const minF = minFare;
    const maxF = calculateExactFare(stops[n - 1].distance);
    document.getElementById('stat-fare-range').innerText = `${minF} - ${maxF} ${t['tk']}`;

    const table = document.createElement('table');
    table.className = 'triangular-table';

    // Header row
    const thead = document.createElement('thead');
    let trHead = document.createElement('tr');

    trHead.innerHTML = `
        <th class="sticky-col-1">${t['stops']}</th>
        <th class="sticky-col-2">${t['km']}</th>
    `;

    for (let i = 0; i < n; i++) {
        const th = document.createElement('th');
        th.style.padding = '0';
        th.style.border = 'none';
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    for (let row = 0; row < n; row++) {
        let tr = document.createElement('tr');

        // Col 1: Station Name
        let thName = document.createElement('td');
        thName.className = 'station-name sticky-col-1';
        thName.innerText = stops[row].name[currentLang];
        tr.appendChild(thName);

        // Col 2: Distance
        let tdDist = document.createElement('td');
        tdDist.className = 'sticky-col-2';
        tdDist.innerText = stops[row].distance.toFixed(1);
        tr.appendChild(tdDist);

        // Columns for triangular fare matrix
        for (let col = 0; col < n; col++) {
            let td = document.createElement('td');

            if (col < row) {
                const dist = Math.abs(stops[row].distance - stops[col].distance);
                const fare = calculateExactFare(dist);
                const studentFare = calculateStudentFare(fare);

                td.innerText = isStudentPassActive ? studentFare : fare;
                td.className = 'fare-cell';
                td.dataset.row = row;
                td.dataset.col = col;
                td.dataset.dist = dist.toFixed(1);
                td.dataset.fare = fare;
                td.dataset.studentFare = studentFare;
                td.dataset.stopA = stops[col].name[currentLang];
                td.dataset.stopB = stops[row].name[currentLang];

                // Click / Tap Handler for Inspection
                td.addEventListener('click', () => {
                    tbody.querySelectorAll('.fare-cell.selected').forEach(c => c.classList.remove('selected'));
                    tbody.querySelectorAll('.fare-cell.highlight-row').forEach(c => c.classList.remove('highlight-row'));
                    tbody.querySelectorAll('.fare-cell.highlight-col').forEach(c => c.classList.remove('highlight-col'));

                    td.classList.add('selected');

                    // Highlight corresponding row and column cells
                    tbody.querySelectorAll(`[data-row="${row}"]`).forEach(c => c.classList.add('highlight-row'));
                    tbody.querySelectorAll(`[data-col="${col}"]`).forEach(c => c.classList.add('highlight-col'));

                    // Show Cell Inspector Banner
                    const inspector = document.getElementById('selected-cell-inspector');
                    document.getElementById('insp-from').innerText = td.dataset.stopA;
                    document.getElementById('insp-to').innerText = td.dataset.stopB;
                    document.getElementById('insp-dist').innerText = `${td.dataset.dist} ${t['km']}`;
                    document.getElementById('insp-fare').innerText = `${td.dataset.fare} ${t['tk']}`;
                    document.getElementById('insp-student').innerText = `${td.dataset.studentFare} ${t['tk']}`;

                    inspector.classList.remove('hidden');
                    lucide.createIcons();
                });
            } else if (col === row) {
                td.innerText = stops[row].name[currentLang];
                td.className = 'station-name';
                td.style.fontWeight = '700';
            } else {
                td.className = 'empty-cell';
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);

    // Dynamic sticky left offset calculation for Column 2
    setTimeout(() => {
        const col1 = table.querySelector('.sticky-col-1');
        if (col1) {
            const col1Width = col1.offsetWidth;
            const allCol2 = table.querySelectorAll('.sticky-col-2');
            allCol2.forEach(c => {
                c.style.left = col1Width + 'px';
            });
        }
    }, 10);

    lucide.createIcons();
}

// --- MATRIX TABLE ZOOM ---
function adjustZoom(delta) {
    currentZoomLevel = Math.max(0.65, Math.min(1.4, currentZoomLevel + delta));
    applyZoomStyles();
}

function resetZoom() {
    currentZoomLevel = 1.0;
    applyZoomStyles();
}

function applyZoomStyles() {
    const root = document.documentElement;
    const baseFontSize = window.innerWidth <= 480 ? 0.78 : 0.85;
    const basePaddingV = 7;
    const basePaddingH = 11;
    const baseMinWidth = 56;

    root.style.setProperty('--matrix-font-size', `${(baseFontSize * currentZoomLevel).toFixed(2)}rem`);
    root.style.setProperty('--matrix-cell-padding', `${Math.round(basePaddingV * currentZoomLevel)}px ${Math.round(basePaddingH * currentZoomLevel)}px`);
    root.style.setProperty('--matrix-min-width', `${Math.round(baseMinWidth * currentZoomLevel)}px`);

    // Recalculate sticky column offset
    setTimeout(() => {
        const table = document.querySelector('.triangular-table');
        if (table) {
            const col1 = table.querySelector('.sticky-col-1');
            if (col1) {
                const col1Width = col1.offsetWidth;
                table.querySelectorAll('.sticky-col-2').forEach(c => {
                    c.style.left = col1Width + 'px';
                });
            }
        }
    }, 20);
}

// --- ALL ROUTES DIRECTORY ---
function renderRoutesDirectory(filteredRoutes = null) {
    const grid = document.getElementById('all-routes-grid');
    const t = translations[currentLang];
    grid.innerHTML = '';

    const routes = filteredRoutes || busData.routes;
    const counterText = document.getElementById('routes-counter-text');
    if (counterText) {
        counterText.innerText = t['routes-count'].replace('{count}', routes.length);
    }

    routes.forEach(r => {
        const card = document.createElement('div');
        card.className = 'directory-route-card';

        const origin = r.stops[0].name[currentLang];
        const terminus = r.stops[r.stops.length - 1].name[currentLang];
        const totalDist = r.stops[r.stops.length - 1].distance.toFixed(1);

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="route-code-badge">${r.code[currentLang]}</span>
                <span class="route-type-badge">
                    <i data-lucide="map-pin" style="width: 12px; height: 12px;"></i>
                    ${r.stops.length} ${t['stops']}
                </span>
            </div>

            <div class="route-terminals">
                <span>${origin}</span>
                <i data-lucide="arrow-right"></i>
                <span>${terminus}</span>
            </div>

            <p style="font-size: 0.85rem; color: var(--text-gray);">${r.name[currentLang]}</p>

            <div class="route-card-meta">
                <span>
                    <i data-lucide="navigation"></i>
                    ${totalDist} ${t['km']}
                </span>
                <span>
                    <i data-lucide="circle-dollar-sign"></i>
                    ${minFare} - ${calculateExactFare(r.stops[r.stops.length - 1].distance)} ${t['tk']}
                </span>
            </div>

            <div class="directory-actions">
                <button class="primary-btn full-width view-chart-action" data-route="${r.code.en}">
                    <i data-lucide="table"></i>
                    <span>${t['view-chart']}</span>
                </button>
            </div>
        `;

        card.querySelector('.view-chart-action').onclick = () => {
            openRouteChart(r.code.en);
        };

        grid.appendChild(card);
    });

    lucide.createIcons();
}

function filterRoutesDirectory(query) {
    if (!query) {
        renderRoutesDirectory();
        return;
    }

    const q = query.toLowerCase().trim();
    const filtered = busData.routes.filter(r => {
        const matchCode = r.code.en.toLowerCase().includes(q) || r.code.bn.includes(q);
        const matchName = r.name.en.toLowerCase().includes(q) || r.name.bn.includes(q);
        const matchStop = r.stops.some(s => s.name.en.toLowerCase().includes(q) || s.name.bn.includes(q));
        return matchCode || matchName || matchStop;
    });

    renderRoutesDirectory(filtered);
}

// --- TOAST NOTIFICATION ---
let toastTimeout = null;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    msgEl.innerText = message;
    toast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 2800);
}

function toggleLoader(show) {
    document.getElementById('loading-overlay').classList.toggle('hidden', !show);
}

// Start application
init();
