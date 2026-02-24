const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\`/g, '`');
fs.writeFileSync('app.js', content, 'utf8');
console.log('Fixed syntax in app.js');
