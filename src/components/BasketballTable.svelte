<!-- TODO: rename element and abstract it to extend to other types of tables with other types of stats -->
<svelte:options customElement={{
  tag: "basketball-table",
  shadow: "none"
}} />
<script>
  import { base } from '$app/paths'
  // TODO: generalize this with JSON data attribute
  import games from "../data/writings/50-40-90/games-50-40-90.json";

  const nbaAbbreviations = {
    "Atlanta Hawks": "ATL",
    "Boston Celtics": "BOS",
    "Brooklyn Nets": "BRK",
    "Charlotte Hornets": "CHO",
    "Chicago Bulls": "CHI",
    "Cleveland Cavaliers": "CLE",
    "Dallas Mavericks": "DAL",
    "Denver Nuggets": "DEN",
    "Detroit Pistons": "DET",
    "Golden State Warriors": "GSW",
    "Houston Rockets": "HOU",
    "Indiana Pacers": "IND",
    "Los Angeles Clippers": "LAC",
    "Los Angeles Lakers": "LAL",
    "Memphis Grizzlies": "MEM",
    "Miami Heat": "MIA",
    "Milwaukee Bucks": "MIL",
    "Minnesota Timberwolves": "MIN",
    "New Orleans Pelicans": "NOP",
    "New York Knicks": "NYK",
    "Oklahoma City Thunder": "OKC",
    "Orlando Magic": "ORL",
    "Philadelphia 76ers": "PHI",
    "Phoenix Suns": "PHO",
    "Portland Trail Blazers": "POR",
    "Sacramento Kings": "SAC",
    "San Antonio Spurs": "SAS",
    "Toronto Raptors": "TOR",
    "Utah Jazz": "UTA",
    "Washington Wizards": "WAS",
    
    "Charlotte Bobcats": "CHA",
    "Charlotte Hornets": "CHH",
    "Oklahoma City Hornets": "NOK",
    "Kansas City Kings": "KCK",
    "New Jersey Nets": "NJN",
    "New Orleans Hornets": "NOH",
    "New Orleans/Oklahoma City Hornets": "NOK",
    "Seattle SuperSonics": "SEA",
    "Vancouver Grizzlies": "VAN",
    "Washington Bullets": "WSB",
}

  export let title;
  export let subtitle;
  export let gameType;
  export let fgp;
  export let tpp;
  export let ftp;
  export let tsp;
  export let double = false;
  export let limit = 10;

  let tableGames;
  let showAll = false;
  let searchTerm = '';
  let sortColumn = null;
  let sortDirection = 'desc'; // 'asc' or 'desc'



  tableGames = games.filter(game => game.type !== "Preseason");
  tableGames = sortGames(tableGames, "date", sortDirection);

  if (gameType) {
    tableGames = tableGames.filter(game => game.type === gameType);
  }
  if (fgp) {
    tableGames = tableGames.filter(game => game.fgp >= parseFloat(fgp));
  }
  if (tpp) {
    tableGames = tableGames.filter(game => game.tpp >= parseFloat(tpp));
  }
  if (ftp) {
    tableGames = tableGames.filter(game => game.ftp >= parseFloat(ftp));
  }
  if (tsp) {
    tableGames = tableGames.filter(game => game.tsp >= parseFloat(tsp));
  }
  if (double) {
    tableGames = tableGames.filter(game => game.double);
  }

  // Filter games based on search term
  $: filteredGames = searchTerm.trim() === '' ? tableGames : tableGames.filter(game => {
    const searchLower = searchTerm.toLowerCase();
    const team = (game.city + " " + game.team).toLowerCase();
    const abbreviation = nbaAbbreviations[game.city + " " + game.team]?.toLowerCase() || '';
    
    return team.includes(searchLower) || abbreviation.includes(searchLower);
  });

  function sortGames(games, sortColumn, sortDirection) {
    if (!sortColumn) return games;
    
    return [...games].sort((a, b) => {
      let aVal, bVal;
      
      if (sortColumn === 'date') {
        // Convert dates to timestamps for comparison
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else {
        aVal = a[sortColumn];
        bVal = b[sortColumn];
      }
      
      // Primary sort by the selected column
      if (aVal !== bVal) {
        return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
      }
      
      // Tie-breaker: sort by attempts (descending) for percentage columns
      const attemptColumns = {
        'date': 'score',
        'fgp': 'fga',
        'tpp': 'tpa', 
        'ftp': 'fta',
        'tsp': 'fga' // Use field goal attempts as tie-breaker for true shooting
      };
      
      const attemptCol = attemptColumns[sortColumn];
      if (attemptCol && a[attemptCol] !== undefined && b[attemptCol] !== undefined) {
        return b[attemptCol] - a[attemptCol]; // Always descending for attempts
      }
      
      return 0;
    });
  }

  // Sort games based on current sort column and direction
  $: sortedGames = sortGames(filteredGames, sortColumn, sortDirection);

  $: displayedGames = showAll ? sortedGames : sortedGames.slice(0, limit);
  $: remainingRows = sortedGames.length - limit;

  function toggleShowAll() {
    showAll = !showAll;
  }

  // Reset showAll when search term changes
  $: if (searchTerm) {
    showAll = false;
  }

  function handleSort(column) {
    if (sortColumn === column) {
      // Toggle direction if same column
      sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      // New column, default to descending
      sortColumn = column;
      sortDirection = 'desc';
    }
  }

  function getSortIcon(column) {
    if (sortColumn !== column) return '';
    return sortDirection === 'desc' ? '↓' : '↑';
  }

  function getBarWidth(freq) {
    // Convert percentage to number and scale for visual representation
    const num = parseFloat(freq);
    return (num / 100) * 100; // Full width for 100%
  }

  function formatPercent(decimal) {
    if (decimal === 1) {
      return (decimal * 100).toFixed(0) + '%';
    }
    return (decimal * 100).toFixed(1) + '%';
  }

  function formatPercentMobile(decimal) {
    return (decimal * 100).toFixed(0) + '%';
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  const formatDate = d => new Date(d).toLocaleDateString('en-US', {month: "numeric", day: "numeric", year:'2-digit'})
  const formatYear = d => new Date(d).toLocaleDateString('en-US', {year:'2-digit'})
  
  function getBasketballReferenceURL(game) {
    const date = new Date(game.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const homeTeam = game.home === "1" ? nbaAbbreviations[game.city + " " + game.team] : nbaAbbreviations[game.cityOpp + " " + game.teamOpp];
    return `https://www.basketball-reference.com/boxscores/${year}${month}${day}0${homeTeam}.html`
  }
</script>

<div class="container">
  <div class="header">
    <h3>{@html title}</h3>
    <div class="subtitle">
      <p>{@html subtitle}</p>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th class="game-header search-header">
            <input 
              type="text" 
              bind:value={searchTerm} 
              placeholder="Search team" 
              class="search-input"
            />
          </th>
          <th class="result-header">Score</th>
          <th class="date-header sortable" on:click={() => handleSort('date')}>
            <span class="table-desktop">Date {getSortIcon('date')}</span>
            <span class="table-mobile">Year {getSortIcon('date')}</span>
          </th>
          <th class="stat-header sortable" on:click={() => handleSort('fgp')}>
            FG% {getSortIcon('fgp')}
          </th>
          <th class="stat-header sortable" on:click={() => handleSort('tpp')}>
            3P% {getSortIcon('tpp')}
          </th>
          <th class="stat-header sortable" on:click={() => handleSort('ftp')}>
            FT% {getSortIcon('ftp')}
          </th>
          <th class="stat-header sortable" on:click={() => handleSort('tsp')}>
            TS% {getSortIcon('tsp')}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each displayedGames as game, i}
          <tr class="game-row">
            <td class="game-cell">
              <div class="game-info">
                <div class="team-logo">
                  <img src={base + "/images/writings/50-40-90/" + game.city + " " + game.team + ".webp"}/>
                </div>
                <a href={getBasketballReferenceURL(game)} target="_blank">
                  <span class="team-name"><span style="font-weight: bold;">{nbaAbbreviations[game.city + " " + game.team]}</span> {game.home === "1" ? "v" : "@"} {nbaAbbreviations[game.cityOpp + " " + game.teamOpp]}</span>
                </a>
              </div>
            </td>

            <td class="result-cell" >
              <span class="result">
                <span class="table-desktop" style={`font-weight: bold; color: ${game.score > game.scoreOpp ? 'var(--green)' : 'var(--red)'}`}>
                  {game.score > game.scoreOpp ? 'W' : 'L'}&nbsp;
                </span><span class="table-desktop">{game.score}-{game.scoreOpp}</span><span class="table-mobile" ><span style={`font-weight: bold; color: ${game.score > game.scoreOpp ? 'var(--green)' : 'var(--red)'}; text-stroke: 10px ${game.score > game.scoreOpp ? 'var(--green)' : 'var(--red)'};`}>{game.score}</span>-{game.scoreOpp}</span>
              </span>
            </td>

            <td class="date-cell" >
              <span class="table-desktop">{formatDate(game.date)}</span>
              <span class="table-mobile">'{formatYear(game.date)}</span>
            </td>
            

            <td class="stat-cell percentage" style={
                `
                  background: rgba(109, 138, 100, ${mapRange(game.fgp, .5, .6, .2, 1)});
                  color: ${mapRange(game.fgp, .5, .6, .2, 1) > 0.8 ? "var(--color-4)" : "var(--color-1)"};
                `
              }>
              <span class="table-desktop">{formatPercent(game.fgp)}</span>
              <span class="table-mobile">{formatPercentMobile(game.fgp)}</span>
            </td>
            
            <td class="stat-cell percentage"  style={
                `
                  background: rgba(109, 138, 100, ${mapRange(game.tpp, .4, .6, .2, 1)});
                  color: ${mapRange(game.tpp, .4, .6, .2, 1) > 0.8 ? "var(--color-4)" : "var(--color-1)"};
                `
              }>
              <span class="table-desktop">{formatPercent(game.tpp)}</span>
              <span class="table-mobile">{formatPercentMobile(game.tpp)}</span>
            </td>      

            <td class="stat-cell percentage"  style={
                `
                  background: rgba(109, 138, 100, ${mapRange(game.ftp, .9, 1, .2, 1)});
                  color: ${mapRange(game.ftp, .9, 1, .2, 1) > 0.8 ? "var(--color-4)" : "var(--color-1)"};
                `
              }>
              <span class="table-desktop">{formatPercent(game.ftp)}</span>
              <span class="table-mobile">{formatPercentMobile(game.ftp)}</span>
            </td>

            <td class="stat-cell percentage"  style={
                `
                  background: rgba(109, 138, 100, ${mapRange(game.tsp, .55, .75, .2, 1)});
                  color: ${mapRange(game.tsp, .55, .75, .2, 1) > 0.8 ? "var(--color-4)" : "var(--color-1)"};
                `
              }>
              <span class="table-desktop">{formatPercent(game.tsp)}</span>
              <span class="table-mobile">{formatPercentMobile(game.tsp)}</span>
            </td>

          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if sortedGames.length > limit}
    <div class="expander" on:click={toggleShowAll}>
      {#if showAll}
        ↑ Show fewer
      {:else}
        ↓ Show {remainingRows} more row{remainingRows !== 1 ? 's' : ''}
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    font-family: var(--serif);
    background-color: transparent;
  }

  .header {
    position: relative;
    margin-bottom: 15px;
  }

  h3 {
    font-weight: bold;
    color: var(--color-1);
    padding: 0;
    margin: 0 0 10px 0;
  }

  .subtitle p {
    color: var(--color-1);
    margin: 5px 0;
    font-size: 1rem;
    line-height: 1.3;
  }

  .table-container {
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    color: var(--color-1);
    font-family: var(--monospace);
    font-size: 15px;
  }

  thead {
    border-bottom: 3px solid var(--color-1);
  }

  th {
    padding: 5px 10px;
    font-weight: bold;
    text-align: left;
    border: none;
  }

  th, td {
    font-size: 0.9rem;
  }

  .search-header {
    padding: 2px 10px 8px 0px;
  }

  .search-input {
    width: 100%;
    max-width: 110px;
    padding: 4px 8px;
    border: 1px solid var(--color-3);
    border-radius: 3px;
    background: var(--bg-color);
    color: var(--color-1);
    font-family: var(--monospace);
    font-size: 0.85rem;
    outline: none;
  }

  .search-input:focus {
    border-color: var(--color-1);
  }

  .search-input::placeholder {
    color: var(--color-3);
    opacity: 0.7;
  }

  .stat-header {
    text-align: center;
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .sortable:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  tbody tr {
    border-bottom: 0.5px solid var(--color-4);
    background-color: var(--bg-color);
    transition: background-color 0.2s;
  }

  tbody tr:nth-child(even) {
/*    background-color: var(--color-4);*/
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  td {
    padding: 5px 10px;
    vertical-align: middle;
    border: none;
  }

  tr a {
    line-height: 1 !important;
    text-decoration: none !important;
    color: var(--color-1) !important;
    border-top: 1px solid  transparent;
    border-bottom: 1px solid var(--color-3);
    border-radius: 0px;
  }

  tr a:hover {
    background: transparent;
    border-bottom: 1px solid var(--color-1);
    border-left: none;
    border-right: none;
    border-radius: 0px;
  }

  .date-number {
    font-weight: 500;
  }

  .game-cell {
    width: auto;
    min-width: 130px;
    padding-left: 0px;
  }

  .game-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .team-logo {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .team-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.75;
  }

  .team-text {
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
  }

  .team-name {
    font-weight: 500;
  }

  .stat-cell {
    width: 65px;
    box-sizing: border-box;
    text-align: center;
    font-weight: 600;
    border: 1px solid var(--bg-color);
  }

  .result-cell {
    width: auto;
    text-align: left;
    padding-right: 5px;
  }

  .result-header {
    text-align: left;
    padding-right: 5px;
  }


  .date-cell {
    text-align: right;
    padding-right: 15px;
  }

  .date-header {
    text-align: right;
    padding-right: 15px;
  }

  .expander {
    margin: 10px auto;
    cursor: pointer;
    width: max-content;
    font-family: var(--monospace);
    font-size: 14px;
    color: var(--color-1);
    padding: 5px 10px;
    border-radius: 3px;
    transition: color 0.2s ease;
  }

  .expander:hover {
    color: var(--color-1);
  }

/*  @media (max-width: 600px) {
    .result-header, .result-cell {
      display: none;
    }
  }*/

  .desktop-cell {
    display: table-cell;
  }

  .table-desktop {
    display: inline-block;
  }

  .table-mobile {
    display: none;
  }

  :global(.dueling table tr:nth-of-type(2n) td) {
    border-bottom: 2px solid var(--color-1);
  }

  :global(.dueling table tbody tr td:last-of-type) {
    border-right: none;
  }

  @media (max-width: 700px) {
    .expander {
      font-size: 12px;
    }
    .game-info {
      gap: 8px;
    }
    .result-cell {
      padding-right: 8px;
      padding-left: 8px;
      width: auto;
    }
    .date-cell, .date-header {
      padding-right: 5px;
      padding-left: 0px;
      text-align: center;
    }
    .game-cell {
      min-width: unset;
    }
    .stat-cell {
      width: 30px;
    }
    th {
      padding: 2px 10px;
      font-size: 0.85rem;
    }
    td {
      padding: 5px;
      font-size: 0.85rem;
    }
    .team-logo {
      width: 20px;
      height: 20px;
    }
    .search-input {
      max-width: 100px;
      font-size: 0.8rem;
    }
    .search-header {
      overflow: visible;
      max-width: 100px;
    }
  }
  @media (max-width: 550px) {
    .table-desktop, .desktop-cell {
      display: none;
    }
    .table-mobile {
      display: inline-block;
    }
    th {
      font-size: 0.75rem;
    }
    td {
      font-size: 0.75rem;
    }
    .search-input {
      max-width: 100px;
      font-size: 0.75rem;
      padding: 3px 6px;
    }
  }
  @media (max-width: 410px) {
    .team-logo {
      display: none;
    }
    .result-cell {
      padding-right: 6px;
      padding-left: 6px;
    }
    .search-header {
      overflow: visible;
      max-width: 50px;
    }
    .search-input {
      width: 80px;
    }
    .result-header {
      visibility: hidden;
    }
    .date-header {
      max-width: 29px;
    }
  }
</style>