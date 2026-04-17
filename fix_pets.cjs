const fs = require('fs');
const path = 'src/client/config/pets.config.ts';
let content = fs.readFileSync(path, 'utf8');
let counter = 1;
content = content.replace(/id: ' ',/g, () => `id: 'pet_${counter++}',`);
fs.writeFileSync(path, content);
console.log('Fixed pets.config.ts');
