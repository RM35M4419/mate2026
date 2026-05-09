const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'problems.json');

// Solo procesar problemas de dinero
const file = "problemas-dinero.txt";
const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
const lines = content.split('\n');

let allProblems = [];

lines.forEach(line => {
    if (!line.trim() || line.startsWith('#')) return;
    
    const parts = line.split('\t');
    if (parts.length >= 2) {
        allProblems.push({
            question: parts[0].trim(),
            answer: parts[1].trim(),
            tags: parts[2] ? parts[2].trim().split(' ') : [],
            section: "Problemas de Dinero",
            source: file
        });
    }
});

fs.writeFileSync(outputFile, JSON.stringify(allProblems, null, 2));
console.log(`Converted ${allProblems.length} money problems to ${outputFile}`);
