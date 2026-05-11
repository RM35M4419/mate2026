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
            const question = parts[0].trim();
            const tagsStr = parts[2] ? parts[2].trim() : "";
            
            // Determinar categoría basada en el archivo o tags
            let category = "General";
            if (file === "matematica-tablas.txt" || tagsStr.includes("multiplicacion")) category = "Multiplicación";
            else if (tagsStr.includes("division")) category = "División";
            else if (file === "calculos-horizontales.txt") category = "Cálculos Horizontales";
            else if (file === "problemas-dinero.txt") category = "Problemas de Dinero";
            else if (file === "problemas-identificar.txt") category = "Identificar Problema";
            else if (tagsStr.includes("suma") || tagsStr.includes("resta")) category = "Suma y Resta";

            allProblems.push({
                question: question,
                answer: parts[1].trim(),
                tags: tagsStr.split(' '),
                category: category,
                source: file
            });
        }
    });
});

fs.writeFileSync(outputFile, JSON.stringify(allProblems, null, 2));
console.log(`Converted ${allProblems.length} problems to ${outputFile}`);
