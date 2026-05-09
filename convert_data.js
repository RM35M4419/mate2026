const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputFile = path.join(dataDir, 'problems.json');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt'));
let allProblems = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
        if (!line.trim() || line.startsWith('#')) return;
        
        const parts = line.split('\t');
        if (parts.length >= 2) {
            allProblems.push({
                question: parts[0].trim(),
                answer: parts[1].trim(),
                tags: parts[2] ? parts[2].trim().split(' ') : [],
                source: file
            });
        }
    });
});

fs.writeFileSync(outputFile, JSON.stringify(allProblems, null, 2));
console.log(`Converted ${allProblems.length} problems to ${outputFile}`);
