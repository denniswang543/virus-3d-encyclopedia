const fs = require('fs');
let code = fs.readFileSync('js/ARButton.js', 'utf8');

// Force display block on fallback
code = code.replace(/message.style.textDecoration = 'none';/, `message.style.textDecoration = 'none';
        message.style.display = 'block';
        message.style.padding = '20px';
        message.style.background = 'red';
        message.innerHTML = 'HTTPS REQUIRED FOR AR';
        message.style.zIndex = '999999';
`);

fs.writeFileSync('js/ARButton.js', code);
console.log("ARButton fallback modified");
