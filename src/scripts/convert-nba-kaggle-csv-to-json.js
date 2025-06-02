import fs from 'fs';
import path from 'path';

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
    }
    
    return data;
}

const findDuplicates = arr => arr.filter((id, i) => arr.indexOf(id) !== i && arr.indexOf(id, i + 1) === -1);

function convertToGamesArray(csvData) {	
	const duplicateIds = findDuplicates(csvData.map(row => row.gameId));
    return csvData.map(row => ({
        date: row.gameDate,
        city: row.teamCity,
        team: row.teamName,
        cityOpp: row.opponentTeamCity,
        teamOpp: row.opponentTeamName,
        score: parseInt(row.teamScore),
        scoreOpp: parseInt(row.opponentScore),
        fga: parseInt(row.fieldGoalsAttempted),
        fgm: parseInt(row.fieldGoalsMade),
        fgp: parseFloat(row.fieldGoalsPercentage),
        tpa: parseInt(row.threePointersAttempted),
        tpm: parseInt(row.threePointersMade),
        tpp: parseFloat(row.threePointersPercentage),
        fta: parseInt(row.freeThrowsAttempted),
        ftm: parseInt(row.freeThrowsMade),
        ftp: parseFloat(row.freeThrowsPercentage),
        tsp: parseInt(row.teamScore) / (2 * (parseInt(row.fieldGoalsAttempted) + 0.44 * parseInt(row.freeThrowsAttempted))),
        home: row.home,
        type: row.gameType === "NBA Emirates Cup" ? "Regular Season" : row.gameType,
        label: row.gameLabel,
        double: duplicateIds.includes(row.gameId)
    }));
}

function writeJSONFile(games, outputPath) {
    const jsonContent = JSON.stringify(games, null, 2);
    fs.writeFileSync(outputPath, jsonContent, 'utf8');
    console.log(`JSON file written to: ${outputPath}`);
}

// Main function
function main() {
    const csvFilePath = process.argv[2] || '../data/writings/50-40-90/game-statistics-50-40-90.csv';
    const outputPath = process.argv[3] || '../data/writings/50-40-90/games-50-40-90.json';
    
    try {
        // Check if file exists
        if (!fs.existsSync(csvFilePath)) {
            console.error(`Error: CSV file '${csvFilePath}' not found.`);
            console.log('Usage: node script.js <csv_file_path> [output_file_path]');
            process.exit(1);
        }
        
        // Read CSV file
        console.log(`Reading CSV file: ${csvFilePath}`);
        const csvText = fs.readFileSync(csvFilePath, 'utf8');
        
        // Parse CSV
        const csvData = parseCSV(csvText);
        console.log(`Parsed ${csvData.length} rows from CSV`);
        
        // Convert to games array format
        const games = convertToGamesArray(csvData);
        
        // Write JSON file
        writeJSONFile(games, outputPath);
        
        // Also log the first few entries as preview
        console.log('\nPreview of converted data:');
        console.log(JSON.stringify(games.slice(0, 2), null, 2));
        
    } catch (error) {
        console.error('Error processing file:', error.message);
        process.exit(1);
    }
}

// Run the script
main();