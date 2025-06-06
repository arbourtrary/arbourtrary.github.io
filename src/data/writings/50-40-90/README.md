### 1. Download data from [Kaggle NBA Dataset](https://www.kaggle.com/datasets/eoinamoore/historical-nba-data-and-player-box-scores)
You can place the unzipped files here in the same `data` folder - I didn't bother checking it in to GitHub.

### 2. Format the data with [gocsv](https://github.com/aotimme/gocsv?tab=readme-ov-file)

```bash
gocsv select --columns "gameId,gameType,gameLabel,gameSubLabel,seriesGameNumber" Games.csv > games-filtered.csv
gocsv filter --columns freeThrowsPercentage --gte .90 TeamStatistics.csv > team-statistics-90.csv
gocsv filter --columns fieldGoalsPercentage --gte .50 team-statistics-90.csv > team-statistics-50-90.csv
gocsv filter --columns threePointersPercentage --gte .40 team-statistics-50-90.csv > team-statistics-50-40-90.csv
gocsv join --columns gameId team-statistics-50-40-90.csv games-filtered.csv > game-statistics-50-40-90.csv
```

### 3. Convert the CSV to be read as a JSON

Get to the root of the directory and run a little script to output `games-50-40-90.json`

```bash
cd src/scripts 
node convert-nba-kaggle-csv-to-json.js
```
