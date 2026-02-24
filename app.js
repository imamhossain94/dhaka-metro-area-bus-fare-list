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

    if (activeRouteId) {
        const r = busData.routes.find(x => x.code.en === activeRouteId);
        if (r) {
            r.stops.forEach(s => validPlaces.add(s.name.en.trim().toLowerCase()));
        }
    } else {
        busData.places.forEach(p => validPlaces.add(p.en.trim().toLowerCase()));
    }

    busData.places.forEach(p => {
        const val = p.en.trim().toLowerCase();
        if (validPlaces.has(val)) {
            const label = p[currentLang] || p.en;
            fromSelect.add(new Option(label, val));
            toSelect.add(new Option(label, val));
        }
    });

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
function renderChart() {
    if (currentView !== 'tree-view') return;

    const routeVal = document.getElementById('chart-route-select').value;
    const container = document.getElementById('chart-container');
    const t = translations[currentLang];
    container.innerHTML = '';

    if (!routeVal) {
        container.innerHTML = `<div style="text-align:center; color:var(--text-gray); margin-top: 2rem;">${t['chart-empty']}</div>`;
        return;
    }

    const r = busData.routes.find(x => x.code.en === routeVal);
    if (!r) return;

    const stops = r.stops;
    const n = stops.length;

    const table = document.createElement('table');
    table.className = 'triangular-table';

    // Header for distance? The image shows "কিঃমিঃ" at the top
    const thead = document.createElement('thead');
    let tr = document.createElement('tr');
    tr.innerHTML = `<th></th><th>${t['km']}</th>`;
    for (let i = 0; i < n; i++) {
        const th = document.createElement('th');
        th.style.writingMode = 'vertical-rl';
        th.style.transform = 'rotate(180deg)';
        th.style.whiteSpace = 'nowrap';
        th.style.paddingTop = '10px';
        th.innerText = stops[i].name[currentLang];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let row = 0; row < n; row++) {
        let tr = document.createElement('tr');

        // Col 1: Name
        let thName = document.createElement('th');
        thName.className = 'station-name';
        thName.innerText = stops[row].name[currentLang];
        tr.appendChild(thName);

        // Col 2: Distance
        let tdDist = document.createElement('td');
        tdDist.innerText = stops[row].distance.toFixed(1);
        tr.appendChild(tdDist);

        // Columns for fare matrix
        for (let col = 0; col < n; col++) {
            let td = document.createElement('td');
            if (col < row) {
                // Diagonal mirror or empty. The example image is a lower-triangular matrix but here we do upper or lower
                // In the image, right of the diagonal is empty, left of the diagonal shows fare
                const dist = Math.abs(stops[row].distance - stops[col].distance);
                td.innerText = calculateExactFare(dist);
            } else if (col === row) {
                td.innerText = stops[row].name[currentLang]; // Some names are shown in diagonal
                td.className = 'station-name';
                td.style.fontWeight = 'bold';
            } else {
                td.className = 'empty-cell';
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
}

function toggleLoader(show) { document.getElementById('loading-overlay').classList.toggle('hidden', !show); }

init();
