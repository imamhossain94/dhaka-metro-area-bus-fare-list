const fs = require('fs');
const path = require('path');

const rawFile = path.join(__dirname, 'raw_data', 'dhaka_metro_area_bus_fare _list.json');
const outDir = path.join(__dirname, 'web_data');
const outFile = path.join(outDir, 'data.json');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let rawData = [];
try {
    const content = fs.readFileSync(rawFile, 'utf8');
    rawData = JSON.parse(content);
} catch (e) {
    console.error('Failed to read or parse raw data', e);
    process.exit(1);
}

const routes = [];
const placesMap = new Map();

rawData.forEach(item => {
    if (item.data && item.data.route_code && item.data.routes) {
        const route = {
            code: item.data.route_code,
            name: item.data.route_name,
            stops: []
        };

        item.data.routes.forEach(r => {
            route.stops.push({
                name: r.name,
                distance: parseFloat(r.distance) || 0
            });

            const enName = r.name.en.trim().toLowerCase();
            if (!placesMap.has(enName)) {
                placesMap.set(enName, r.name);
            }
        });

        routes.push(route);
    }
});

const places = Array.from(placesMap.values()).sort((a, b) => a.en.localeCompare(b.en));

const finalData = {
    routes,
    places
};

fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
console.log(`Processed ${routes.length} routes and ${places.length} unique places.`);
console.log(`Saved to ${outFile}`);
