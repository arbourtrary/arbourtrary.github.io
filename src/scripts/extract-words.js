import { readFileSync, readdirSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to walk through directories recursively
function walkDirectories(dir, fileList = []) {
    const files = readdirSync(dir);
    
    files.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDirectories(filePath, fileList);
        } else if (extname(file) === '.txt') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// Provided extractContent function
// function extractContent(s) {
//     var span = document.createElement('span');
//     span.innerHTML = s;
//     return span.textContent || span.innerText;
// }

function extractContent(s) {
    return s
        .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
        .replace(/&[^;]+;/g, ' ')  // Remove HTML entities
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim();                   // Trim leading/trailing whitespace
}

// Function to process a single file and extract unique words
function processFile(filePath) {
    const content = readFileSync(filePath, 'utf8');
    const cleanContent = extractContent(content);
    
    // Split into words and remove punctuation, numbers, etc.
    const words = cleanContent
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
    
    return new Set(words);
}

// Main function to process all files and generate CSV
function generateWordList(directories) {
    // Get all txt files from all directories
    let allFiles = directories.reduce((acc, dir) => {
        return acc.concat(walkDirectories(dir));
    }, []);

    allFiles = allFiles.concat([
        "../data/intro.json",
        "../data/projects.json",
        "../data/sketches.json",
        "../data/writings.json"
    ]);
    console.log(allFiles)
    
    // Process all files and collect unique words
    const uniqueWords = new Set();
    allFiles.forEach(file => {
        const fileWords = processFile(file);
        fileWords.forEach(word => uniqueWords.add(word));
    });
    
    // Sort words alphabetically
    const sortedWords = Array.from(uniqueWords).sort();
    
    // Generate CSV content
    const csvContent = 'Word\n' + sortedWords.join('\n');
    
    // Write to CSV file
    const outputPath = '../../static/data/words.csv';
    writeFileSync(outputPath, csvContent, 'utf8');
    
    return {
        totalFiles: allFiles.length,
        totalUniqueWords: sortedWords.length,
        outputFile: outputPath
    };
}

// Example usage
try {
    const result = generateWordList([
        '../../static/data/sketches',
        '../../static/data/writings'
        // Add more directories as needed
    ]);
    
    console.log(`Processed ${result.totalFiles} files`);
    console.log(`Found ${result.totalUniqueWords} unique words`);
    console.log(`Results saved to ${result.outputFile}`);
} catch (error) {
    console.error('Error processing files:', error);
}