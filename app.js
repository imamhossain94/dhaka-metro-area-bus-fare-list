let busData = { routes: [], places: [] };
let currentLang = 'en';
let minFare = 10;
let farePerKm = 2.45;
let currentView = 'grid-view';

const translations = {
    en: {
        'lbl-lang': 'Language / ভাষা',
        'lbl-route': 'Route (Optional)',
        'lbl-from': 'Select From',
        'lbl-to': 'Select To',
        'lbl-calc-btn': 'Calculate Fare',
        'nav-calc': 'Calculator',
        'nav-chart': 'Fare Chart',
        'main-title': 'Fare Results',
        'lbl-chart-route': 'Select Route for Chart',
        'modal-title': ' Configuration',
        'lbl-min-fare': 'Minimum Fare (Tk)',
        'lbl-fare-km': 'Fare per KM (Tk)',
        'lbl-save-settings': 'Save Settings',
        'select-all': 'All Routes',
        'select-from': 'Select Starting Location',
        'select-to': 'Select Destination',
        'tk': 'Tk',
        'km': 'km',
        'distance': 'Distance',
        'fare': 'Fare',
        'route': 'Route',
        'no-route': 'No direct route found between these locations.',
        'select-req': 'Please select both starting location and destination.',
        'chart-empty': 'Select a route to view its fare chart.'
    },
    bn: {
        'lbl-lang': 'Language / ভাষা',
        'lbl-route': 'রুট (ঐচ্ছিক)',
        'lbl-from': 'শুরুর স্থান',
        'lbl-to': 'গন্তব্য নির্বাচন করুন',
        'lbl-calc-btn': 'ভাড়া হিসাব করুন',
        'nav-calc': 'ক্যালকুলেটর',
        'nav-chart': 'ভাড়া চার্ট',
        'main-title': 'ভাড়ার ফলাফল',
        'lbl-chart-route': 'চার্টের জন্য রুট নির্বাচন করুন',
        'modal-title': ' কনফিগারেশন',
        'lbl-min-fare': 'সর্বনিম্ন ভাড়া (টাকা)',
        'lbl-fare-km': 'প্রতি কিমি ভাড়া (টাকা)',
        'lbl-save-settings': 'সেটিংস সেভ করুন',
        'select-all': 'সকল রুট',
        'select-from': 'শুরুর স্থান নির্বাচন করুন',
        'select-to': 'গন্তব্য নির্বাচন করুন',
        'tk': 'টাকা',
        'km': 'কিমি',
        'distance': 'দূরত্ব',
        'fare': 'ভাড়া',
        'route': 'রুট',
        'no-route': 'এই দুটি স্থানের মধ্যে সরাসরি কোনো রুট পাওয়া যায়নি।',
        'select-req': 'অনুগ্রহ করে শুরুর স্থান এবং গন্তব্য উভয়ই নির্বাচন করুন।',
        'chart-empty': 'ভাড়া চার্ট দেখতে একটি রুট নির্বাচন করুন।'
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

        // Initial setup
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

    document.getElementById('min-fare-input').value = minFare;
    document.getElementById('fare-km-input').value = farePerKm;
}

function saveConfig() {
    minFare = parseFloat(document.getElementById('min-fare-input').value) || 10;
    farePerKm = parseFloat(document.getElementById('fare-km-input').value) || 2.45;

    setCookie('min_fair', minFare, 365);
    setCookie('fair_par_km', farePerKm, 365);

    document.getElementById('settings-modal').classList.remove('active');

    // recalculate if we have results
    if (currentView === 'grid-view') {
        calculateFare();
    } else {
        renderChart();
    }
}

// --- THEME ---
function setupTheme() {
    const btn = document.getElementById('theme-btn');
    const html = document.documentElement;

    const saved = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', saved);
    updateThemeIcon(saved);

    btn.onclick = () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    };
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (theme === 'dark') {
        icon.setAttribute('data-lucide', 'moon');
    } else {
        icon.setAttribute('data-lucide', 'sun');
    }
    lucide.createIcons();
}

// --- UI SETUP ---
function initUI() {
    lucide.createIcons();

    // Nav Logic
    document.querySelectorAll('.nav-btn[data-view]').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.nav-btn[data-view]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.dataset.view;
            document.querySelectorAll('.view-content').forEach(v => v.classList.add('hidden'));
            document.getElementById(target).classList.remove('hidden');

            currentView = target;
            if (currentView === 'tree-view') {
                document.getElementById('main-title').innerText = translations[currentLang]['nav-chart'];
                document.getElementById('result-count').innerText = '';
                renderChart();
            } else {
                document.getElementById('main-title').innerText = translations[currentLang]['main-title'];
                calculateFare(); // Update results text
            }
        };
    });

    // Language Toggle
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            applyTranslations();
            populateDropdowns();
            if (currentView === 'grid-view') calculateFare();
            else renderChart();
        };
    });

    // Modals
    document.getElementById('settings-btn').onclick = () => document.getElementById('settings-modal').classList.add('active');
    document.getElementById('close-settings').onclick = () => document.getElementById('settings-modal').classList.remove('active');
    document.getElementById('save-settings-btn').onclick = saveConfig;

    // Actions
    document.getElementById('calculate-btn').onclick = calculateFare;

    // Route Selection for Chart
    document.getElementById('chart-route-select').onchange = renderChart;

    document.getElementById('chart-prev-btn').onclick = () => {
        const select = document.getElementById('chart-route-select');
        if (select.selectedIndex > 1) { // 0 is the "-- All Routes --" option usually, we might want to skip it or allow it
            select.selectedIndex -= 1;
            renderChart();
        } else if (select.selectedIndex === 1) { // Skip empty option
            // Optional: loop to end
            // select.selectedIndex = select.options.length - 1;
            // renderChart();
        }
    };

    document.getElementById('chart-next-btn').onclick = () => {
        const select = document.getElementById('chart-route-select');
        if (select.selectedIndex < select.options.length - 1) {
            select.selectedIndex += 1;
            renderChart();
        }
    };

    // Filter Dependency
    document.getElementById('route-select').onchange = () => populateDropdowns(false);
}

function applyTranslations() {
    const t = translations[currentLang];
    for (const [id, text] of Object.entries(t)) {
        const el = document.getElementById(id);
        if (el) {
            // handle icon in modal title
            if (id === 'modal-title') {
                el.innerHTML = `<i data-lucide="settings" style="display:inline-block; vertical-align:middle; margin-right:8px;"></i> ${text}`;
            } else {
                el.innerText = text;
            }
        }
    }
    lucide.createIcons();
}

function populateDropdowns(fullRefresh = true) {
    const t = translations[currentLang];

    // Routes Filter
    const routeSelect = document.getElementById('route-select');
    const chartRouteSelect = document.getElementById('chart-route-select');

    if (fullRefresh) {
        const selectedRoute = routeSelect.value;
        const selectedChartRoute = chartRouteSelect.value;

        routeSelect.innerHTML = `<option value="">${t['select-all']}</option>`;
        chartRouteSelect.innerHTML = `<option value="">-- ${t['select-all']} --</option>`;

        busData.routes.forEach((r, idx) => {
            const val = r.code.en; // internal ID
            const label = `${r.code[currentLang]} (${r.name[currentLang]})`;

            routeSelect.add(new Option(label, val));
            chartRouteSelect.add(new Option(label, val));
        });

        routeSelect.value = selectedRoute || '';
        chartRouteSelect.value = selectedChartRoute || '';
    }

    // From / To Filters
    const fromSelect = document.getElementById('from-select');
    const toSelect = document.getElementById('to-select');
    const currentFrom = fromSelect.value;
    const currentTo = toSelect.value;

    fromSelect.innerHTML = `< option value = "" > ${t['select-from']}</option > `;
    toSelect.innerHTML = `< option value = "" > ${t['select-to']}</option > `;

    let validPlaces = new Set();
    const activeRouteId = document.getElementById('route-select').value;

    // Track added places to avoid duplicate options in circular routes
    let addedPlaces = new Set();

    if (activeRouteId) {
        const r = busData.routes.find(x => x.code.en === activeRouteId);
        if (r) {
            r.stops.forEach(s => {
                const val = s.name.en.trim().toLowerCase();
                if (!addedPlaces.has(val)) {
                    addedPlaces.add(val);
                    const label = s.name[currentLang];
                    fromSelect.add(new Option(label, val));
                    toSelect.add(new Option(label, val));
                }
            });
        }
    } else {
        busData.places.forEach(p => {
            const val = p.en.trim().toLowerCase();
            if (!addedPlaces.has(val)) {
                addedPlaces.add(val);
                const label = p[currentLang] || p.en;
                fromSelect.add(new Option(label, val));
                toSelect.add(new Option(label, val));
            }
        });
    }

    // Restore selections
    if (fromSelect.querySelector(`option[value="${currentFrom}"]`)) fromSelect.value = currentFrom;
    if (toSelect.querySelector(`option[value="${currentTo}"]`)) toSelect.value = currentTo;
}

// --- LOGIC ---
function calculateExactFare(dist) {
    let f = dist * farePerKm;
    if (f < minFare) f = minFare;
    return Math.ceil(f);
}

function calculateFare() {
    const fromVal = document.getElementById('from-select').value;
    const toVal = document.getElementById('to-select').value;
    const routeVal = document.getElementById('route-select').value;

    const countEl = document.getElementById('result-count');
    const grid = document.getElementById('results-grid');
    grid.innerHTML = '';

    const t = translations[currentLang];

    if (!fromVal || !toVal) {
        countEl.innerText = t['select-req'];
        return;
    }

    if (fromVal === toVal) {
        grid.innerHTML = `<div class="card" style="text-align:center;">Distance is 0 ${t['km']}. Fare is ${minFare} ${t['tk']}</div>`;
        countEl.innerText = '0 results';
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
            const fare = calculateExactFare(dist);

            // Generate intermediate route path optionally
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
                fare: fare,
                path: path
            });
        }
    });

    if (matches.length === 0) {
        countEl.innerText = t['no-route'];
        return;
    }

    countEl.innerText = `Found ${matches.length} routes`;

    matches.sort((a, b) => a.fare - b.fare);

    matches.forEach(m => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <span class="card-badge">${m.route.code[currentLang]}</span>
                    <h3 style="margin-top:0.75rem">${m.route.name[currentLang]}</h3>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:1.5rem; font-weight:bold; color:var(--text-base);">${m.fare} ${t['tk']}</span>
                    <p style="color:var(--text-gray); font-size:0.9rem">${m.distance} ${t['km']}</p>
                </div>
            </div>
            <div class="route-path">
                ${m.path.map((p, i) => `<span class="route-stop">${p} ${i < m.path.length - 1 ? '&nbsp;→&nbsp;' : ''}</span>`).join('')}
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- TREE VIEW (Triangular Chart) ---
let chartSelectionStart = null;
let chartSelectionEnd = null;
let isSelectingChart = false;

window.addEventListener('mouseup', () => {
    isSelectingChart = false;
});

function renderChart() {
    if (currentView !== 'tree-view') return;

    const routeVal = document.getElementById('chart-route-select').value;
    const container = document.getElementById('chart-container');
    const t = translations[currentLang];
    container.innerHTML = '';

    // Reset selection state when rendering new chart
    chartSelectionStart = null;
    chartSelectionEnd = null;

    if (!routeVal) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-gray); margin-top: 2rem;">${t['chart-empty']}</div>`;
        return;
    }

    const r = busData.routes.find(x => x.code.en === routeVal);
    if (!r) return;

    const stops = r.stops;
    const n = stops.length;

    // Apply some required responsive container styles if not already set via CSS
    container.style.overflow = 'auto';
    container.style.maxWidth = '100%';
    container.style.maxHeight = 'calc(100vh - 220px)';
    container.style.position = 'relative';

    const table = document.createElement('table');
    table.className = 'triangular-table';
    table.style.borderCollapse = 'collapse'; // keep tight for selection edges

    // Add styles dynamically for selection and stickiness
    if (!document.getElementById('chart-dynamic-styles')) {
        const style = document.createElement('style');
        style.id = 'chart-dynamic-styles';
        style.innerHTML = `
            .triangular-table th, .triangular-table td {
                transition: background-color 0.1s;
                white-space: nowrap !important;
            }
            .triangular-table .fare-cell {
                cursor: pointer;
                user-select: none;
            }
            .triangular-table .fare-cell:hover {
                background-color: rgba(79, 70, 229, 0.15) !important;
            }
            .triangular-table .fare-cell.selected {
                background-color: rgba(79, 70, 229, 0.3) !important;
                border-color: rgba(79, 70, 229, 0.5) !important;
            }
            .sticky-col-1 {
                position: sticky !important;
                left: 0;
                background-color: var(--bg-modifier) !important;
                border-right: 2px solid var(--border);
                z-index: 2;
            }
            .sticky-col-2 {
                position: sticky !important;
                background-color: var(--bg-modifier) !important;
                border-right: 2px solid var(--border);
                z-index: 2;
            }
            thead .sticky-col-1, thead .sticky-col-2 {
                z-index: 4 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Header: Only keep km, hide others (but create them empty to keep table structure)
    const thead = document.createElement('thead');
    let trHead = document.createElement('tr');
    trHead.innerHTML = `
        <th class="sticky-col-1" style="top: 0; z-index: 4; background-color: var(--bg-modifier); position: sticky;"></th>
        <th class="sticky-col-2" style="top: 0; z-index: 4; background-color: var(--bg-modifier); position: sticky;">${t['km']}</th>
    `;
    for (let i = 0; i < n; i++) {
        const th = document.createElement('th');
        // Hidden text, but retains cell structure
        th.style.padding = '0';
        th.style.minWidth = '60px';
        th.style.border = 'none';
        trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const updateSelectionUI = () => {
        if (!chartSelectionStart || !chartSelectionEnd) return;

        // Bounding box logic: Highlight entire rows and columns that fall within the selection block
        const minR = Math.min(chartSelectionStart.row, chartSelectionEnd.row);
        const maxR = Math.max(chartSelectionStart.row, chartSelectionEnd.row);
        const minC = Math.min(chartSelectionStart.col, chartSelectionEnd.col);
        const maxC = Math.max(chartSelectionStart.col, chartSelectionEnd.col);

        const cells = tbody.querySelectorAll('.fare-cell');
        cells.forEach(c => {
            const r = parseInt(c.dataset.row);
            const col = parseInt(c.dataset.col);
            // Highlight if the cell's row is within the selected rows OR if its column is within the selected columns
            if ((r >= minR && r <= maxR) || (col >= minC && col <= maxC)) {
                c.classList.add('selected');
            } else {
                c.classList.remove('selected');
            }
        });
    };

    for (let row = 0; row < n; row++) {
        let tr = document.createElement('tr');

        // Col 1: Name
        let thName = document.createElement('td'); // Use td to keep styling simpler if needed
        thName.className = 'station-name sticky-col-1';
        thName.style.backgroundColor = 'var(--bg-modifier)'; // Ensure bg covers scroll
        thName.innerText = stops[row].name[currentLang];
        tr.appendChild(thName);

        // Col 2: Distance
        let tdDist = document.createElement('td');
        tdDist.className = 'sticky-col-2';
        tdDist.style.backgroundColor = 'var(--bg-modifier)';
        tdDist.innerText = stops[row].distance.toFixed(1);
        tr.appendChild(tdDist);

        // Columns for fare matrix
        for (let col = 0; col < n; col++) {
            let td = document.createElement('td');
            if (col < row) {
                const dist = Math.abs(stops[row].distance - stops[col].distance);
                td.innerText = calculateExactFare(dist);
                td.className = 'fare-cell';
                td.dataset.row = row;
                td.dataset.col = col;

                td.addEventListener('mousedown', (e) => {
                    isSelectingChart = true;
                    chartSelectionStart = { row, col };
                    chartSelectionEnd = { row, col };
                    tbody.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                    updateSelectionUI();
                });
                td.addEventListener('mouseenter', (e) => {
                    if (isSelectingChart) {
                        chartSelectionEnd = { row, col };
                        updateSelectionUI();
                    }
                });
            } else if (col === row) {
                td.innerText = stops[row].name[currentLang];
                td.className = 'station-name';
                td.style.fontWeight = 'bold';
                // Rotate name dynamically to look nice diagonally if requested, but keep simple for now
            } else {
                td.className = 'empty-cell';
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);

    // Sync column 2 sticky offset after rendering
    setTimeout(() => {
        const col1Width = table.querySelector('.sticky-col-1').offsetWidth;
        const allCol2 = table.querySelectorAll('.sticky-col-2');
        allCol2.forEach(c => {
            c.style.left = col1Width + 'px';
        });
    }, 0);
}

function toggleLoader(show) { document.getElementById('loading-overlay').classList.toggle('hidden', !show); }

init();
