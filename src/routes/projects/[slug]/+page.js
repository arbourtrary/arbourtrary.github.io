import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const projects = [
  {
    "title": "In a Word",
    "slug": "in-a-word",
    "publication": "Blurb",
    "description": "A self-published, quasi-surrealist collection driven by associations with each poem's single-word title",
    "year": "2016",
    "date": "10/05/2016",
    "awards": [],
    "awardsShort": [],
    "tags": ["r", "lda", "network", "blurb", "book", "poetry", "surrealist", "stream of consciousness"],
    "image": "textures/fade_in_a_word.webp",
    "url": "https://www.blurb.com/b/10322155-in-a-word",
    "format": "Books",
    "text": "I compiled this book, more than I wrote it. So thematically, it's pretty scattered. Stylistically, it's early in my writing, often repetitive. I still find some lines and poems pretty interesting and they could be further developed. The visuals are heavy on symmetry, minimalism, and network / graph analysis.",
    "tools": [
      "pencil",
      "paper",
      "patience",
      "R",
      "bookwright"
    ],
    "gallery": [
      "poem-slopegraph.webp",
      "poem-wheel-1.webp",
      "poem-wheel-2.webp",
      "poem-wheel-3.webp",
      "poem-wheel-4.webp",
      "poem-wheel-5.webp",
      "poem-wheel-6.webp"
    ],
    "index": 0
  },
  {
    "title": "Revival",
    "slug": "revival",
    "publication": "Blurb",
    "description": "A self-published poetry collection observing San Francisco's strained natural, technological, and human bindings",
    "year": "2018",
    "date": "03/12/2018",
    "awards": [],
    "awardsShort": [],
    "tags": ["r", "graph theory", "spanning tree", "blurb", "book", "poetry", "nature", "technology", "humanity", "san francisco"],
    "image": "textures/fade_revival.webp",
    "url": "https://www.blurb.com/b/10322111-revival",
    "format": "Books",
    "text": "I wrote this book in a flurry of a year. Looking back, there were many spots I'd cut, swap out, or just let sit. I wrote every spare minute I could find, often on the train, sometimes finding lines mid-walk, molding them mind-wise until I could jot them down. It's a snapshot of San Francisco from my vantage. All the visualizations in the book find inspiration from urban data and railroads.",
    "tools": [
      "pencil",
      "paper",
      "patience",
      "R",
      "bookwright"
    ],
    "gallery": [
      "sf-rivers.webp",
      "table-of-contents.webp",
      "sections.webp",
      "nature-left.webp",
      "nature-right.webp",
      "technology-left.webp",
      "technology-right.webp",
      "humanity-left.webp",
      "humanity-right.webp",
      "spanning-trees.webp"
    ],
    "index": 1
  },
  {
    "title": "NBA Recordigami",
    "slug": "nba-recordigami",
    "publication": "Narro",
    "description": "Tracing the history of the NBA through pioneering wins and losses during the regular season",
    "year": "2021",
    "date": "05/01/21",
    "awards": ["<a href='https://pudding.cool/process/pudding-cup-2021/' target='_blank'>Pudding Cup Honorary Mention</a>"],
    "awardsShort": ["<a href='https://pudding.cool/process/pudding-cup-2021/' target='_blank'>Pudding Cup Honorary Mention</a>"],
    "tags": ["d3", "svg", "basketball", "NBA", "triangle"],
    "image": "textures/fade_recordigami.webp",
    "url": "https://narro.design/html/nba-recordigami.html",
    "format": "Narro",
    "text": "",
    "tools": [
      "d3",
      "python"
    ],
    "gallery": [
      "all-decades.webp",
      "mavericks.webp",
      "bulls.webp",
      "supersonics.webp"
    ],
    "index": 2
  },
  {
    "title": "Around the World",
    "slug": "around-the-world",
    "publication": "Narro",
    "description": "Exploring what it would look like to go from your doorstep, around the world and back again",
    "year": "2021",
    "date": "07/01/21",
    "awards": [],
    "awardsShort": [],
    "tags": ["d3", "r", "s3", "aws", "westworld", "international", "flags"],
    "image": "textures/fade_around_the_world.webp",
    "url": "https://narro.design/html/around-the-world.html",
    "format": "Narro",
    "text": "",
    "tools": [
      "d3",
      "python"
    ],
    "gallery": [
      "papeete.webp",
      "mt-everest.webp",
      "iceland.webp",
      "puerto-rico.webp",
      "santo-domingo.webp",
      "texas.webp"
    ],
    "index": 3
  },
  {
    "title": "Linguistics",
    "slug": "linguistics",
    "publication": "Narro",
    "description": "Phonemes and graphemes of a complex language - the sounds and spellings of English",
    "year": "2021",
    "date": "09/01/21",
    "awards": [],
    "awardsShort": [],
    "tags": ["svelte", "gallery", "circle packing", "phoneme", "grapheme", "linguistics"],
    "image": "textures/fade_linguistics.webp",
    "url": "https://narro.design/html/linguistics-intro.html",
    "format": "Narro",
    "text": "",
    "tools": [
      "d3",
      "svelte"
    ],
    "gallery": [
      "linguistics.webp",
      "phonemes.webp",
      "graphemes.webp",
      "phonemes-graphemes.webp",
      "ukulele.webp"
    ],
    "index": 4
  },
  {
    "title": "Puerto Rican Migration",
    "slug": "puerto-rican-migration",
    "publication": "Article",
    "description": "A pre-pandemic breakdown of Puerto Ricans in the diaspora who were returning to the island",
    "year": "2021",
    "date": "09/15/21",
    "awards": [],
    "awardsShort": [],
    "tags": ["d3", "Puerto Rico", "Census", "choropleth", "small multiples"],
    "image": "textures/fade_puerto_rico_migration.webp",
    "url": "https://narro.design/html/puerto-rico-migration.html",
    "format": "Narro",
    "text": "",
    "tools": [
      "d3",
      "svelte"
    ],
    "gallery": [
      "puerto-rico.webp",
      "mayaguez.webp",
      "migration.webp"
    ],
    "index": 5
  },
  {
    "title": "House of Cards",
    "slug": "house-of-cards",
    "publication": "Miami Herald",
    "description": "An interactive reconstruction of the collapse of the Champlain Towers South 12-story condo in Surfside",
    "year": "2021",
    "date": "12/30/21",
    "awards": [
      "<a href='https://scripps.com/wp-content/uploads/2022/06/SHA-2021_Program_2.pdf' target='_blank'>Scripps Howard Award</a>",
      "<a href='https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-individual-editorial-feature-media-company/219009/house-of-cards' target='_blank'>Webby for Best Editorial Feature</a>",
      "<a href='https://knightfoundation.org/esserman-knight-journalism-awards-2022-nominations/' target='_blank'>Esserman-Knight Journalism Award</a>",
      "<a href='https://snd.org/best-of-design-competitions/2020-best-of-digital-design-results/' target='_blank'>Society for News Design Award of Excellence</a>",
      "<a href='https://www.inma.org/blogs/main/post.cfm/inma-reveals-60-global-media-awards-first-place-winners-miami-herald-takes-top-prize' target='_blank'>INMA Best in Show</a>"
    ],
    "awardsShort": [
      "<a href='https://scripps.com/wp-content/uploads/2022/06/SHA-2021_Program_2.pdf' target='_blank'>Scripps Howard</a>",
      "<a href='https://winners.webbyawards.com/2022/websites-and-mobile-sites/features-design/best-individual-editorial-feature-media-company/219009/house-of-cards' target='_blank'>Webby</a>",
      "<a href='https://knightfoundation.org/esserman-knight-journalism-awards-2022-nominations/' target='_blank'>Esserman-Knight</a>",
      "<a href='https://snd.org/best-of-design-competitions/2020-best-of-digital-design-results/' target='_blank'>SND</a>",
      "<a href='https://www.inma.org/blogs/main/post.cfm/inma-reveals-60-global-media-awards-first-place-winners-miami-herald-takes-top-prize' target='_blank'>INMA</a>"
    ],
    "tags": ["svelte", "scrolling video", "audio", "surfside"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)", "<a href='https://albright.online/' target='_blank'>Aaron Albright</a> (web dev)"],
    "image": "textures/fade_house_of_cards.webp",
    "url": "https://www.miamiherald.com/news/special-reports/surfside-investigation/article256633336.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "handbrake"
    ],
    "gallery": [
      "intro-1.webp",
      "intro-2.webp",
      "intro-3.webp",
      "building-pipes.webp",
      "building-floors.webp",
      "schematic-1.webp",
      "schematic-2.webp",
      "schematic-3.webp",
      "schematic-4.webp",
      "schematic-5.webp",
      "schematic-6.webp",
      "aftermath.webp",
      "cards.webp"
    ],
    "index": 6
  },
  {
    "title": "Cut Off",
    "slug": "cut-off",
    "publication": "The State",
    "description": "In Columbia's 29203, limbs are being amputated at an alarming rate. It doesn't have to be this way.",
    "year": "2022",
    "date": "03/24/22",
    "awards": [
      "<a href='https://snd.org/best-of-design-competitions/snd44-annual-creative-competition-results/' target='_blank'>Society for News Design Bronze Medal</a>",
      "<a href='https://scpress.org/23-annual-meeting/' target='_blank'>S.C. Press Association - Mixed Media First Place</a>"],
    "awardsShort": [
      "<a href='https://snd.org/best-of-design-competitions/snd44-annual-creative-competition-results/' target='_blank'>SND Bronze Medal</a>",
      "<a href='https://scpress.org/23-annual-meeting/' target='_blank'>S.C. Press Association</a>"],
    "tags": ["svelte", "maplibre", "dataviz", "south carolina"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)"],
    "image": "textures/fade_cut_off.webp",
    "url": "https://www.thestate.com/news/state/south-carolina/article258302413.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "maplibre"
    ],
    "gallery": [
      "intro.webp",
      "map.webp",
      "zoom.webp",
      "zipcode.webp",
      "grocery.webp",
      "bargain.webp",
      "triptych.webp"
    ],
    "index": 7
  },
  {
    "title": "Security for Sale",
    "slug": "security-for-sale",
    "publication": "Charlotte Observer",
    "description": "In 10 years, Wall Street amassed 40k residential homes in NC. Now renters & home buyers are paying the price",
    "year": "2022",
    "date": "05/09/22",
    "awards": [
      "<a href='https://scripps.com/fund/journalism/award-finalists/security-for-sale/' target='_blank'>Scripps Howard Award Finalist</a>"
    ],
    "awardsShort": [
      "<a href='https://scripps.com/fund/journalism/award-finalists/security-for-sale/' target='_blank'>Scripps Howard Award Finalist</a>"
    ],
    "tags": ["svelte", "maplibre", "hexbins", "american dream", "real estate", "north carolina"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)"],
    "image": "textures/fade_security_for_sale.webp",
    "url": "https://pulitzercenter.org/projects/security-sale",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "maplibre"
    ],
    "gallery": [
      "intro-1.webp",
      "intro-2.webp",
      "map-nc.webp",
      "map-mecklenburg.webp",
      "map-neighborhood.webp",
      "map-drone.webp",
      "map-triangle.webp",
      "map-nc-dots.webp"
    ],
    "index": 8
  },
  {
    "title": "Big Poultry",
    "slug": "big-poultry",
    "publication": "Charlotte Observer",
    "description": "With little oversight, NC poultry farms generate billions of pounds of untreated waste. Who pays the cost?",
    "year": "2022",
    "date": "11/30/22",
    "awards": ["<a href='https://news.mit.edu/2023/mcelheny-award-science-journalism-honors-series-poultry-farming-environment-0403' target='_blank'>MIT Knight Science Journalism</a>", "<a href='https://nationalpress.org/award-story/capital-main-charlotte-observer-raleigh-news-observer-win-npf-stokes-award-for-best-environmental-reporting/' target='_blank'>Stokes Award for Energy & Environment</a>", "<a href='https://www.ire.org/2022-ire-award-winners/' target='_blank'>Investigative Reporters & Editors - IRE Award</a>"],
    "awardsShort": ["<a href='https://news.mit.edu/2023/mcelheny-award-science-journalism-honors-series-poultry-farming-environment-0403' target='_blank'>MIT Knight</a>", "<a href='https://nationalpress.org/award-story/capital-main-charlotte-observer-raleigh-news-observer-win-npf-stokes-award-for-best-environmental-reporting/' target='_blank'>Thomas Stokes</a>", "<a href='https://www.ire.org/2022-ire-award-winners/' target='_blank'>IRE</a>"],
    "tags": ["svelte", "incremental video", "maplibre", "north carolina"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)", "<a href='https://semerriam.github.io/' target='_blank'>Susan Merriam</a> (dataviz)"],
    "image": "textures/fade_big_poultry.webp",
    "url": "https://www.charlotteobserver.com/news/state/north-carolina/article267887592.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "maplibre"
    ],
    "gallery": [
        "intro-1.webp",
        "intro-2.webp",
        "intro-3.webp",
        "intro-5.webp",
        "intro-6.webp",
        "intro-7.webp",
        "intro-8.webp"
    ],
    "index": 9
  },
  {
    "title": "Made in Miami",
    "slug": "made-in-miami",
    "publication": "Miami Herald",
    "description": "A deep dive into a network of indivduals linked to the assassination of Haitian President Jovenel Moïse",
    "year": "2022",
    "date": "12/06/22",
    "awards": [
      "<a href='https://awards.journalists.org/entries/made-in-miami-the-assassination-of-haitis-jovenel-moise-2/' target='_blank'>Online Journalism Award</a>",
      "<a href='https://opcofamerica.org/Awardarchive/the-kim-wall-award-2022/' target='_blank'>Overseas Press Club - Kim Wall Award</a>",
      "<a href='https://www.headlinerawards.org/wp-content/uploads/2023/05/2023-headliner-winners.pdf' target='_blank'>National Headliner Award</a>"
    ],
    "awardsShort": [
      "<a href='https://awards.journalists.org/entries/made-in-miami-the-assassination-of-haitis-jovenel-moise-2/' target='_blank'>Online Journalism Award</a>",
      "<a href='https://opcofamerica.org/Awardarchive/the-kim-wall-award-2022/' target='_blank'>OPC</a>",
      "<a href='https://www.headlinerawards.org/wp-content/uploads/2023/05/2023-headliner-winners.pdf' target='_blank' style='white-space: nowrap;'>National Headliner Award</a>"
    ],
    "tags": ["d3", "js", "web component", "network", "haiti"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)"],
    "image": "textures/fade_made_in_miami.webp",
    "url": "https://www.miamiherald.com/news/nation-world/world/americas/haiti/article266152901.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "d3",
      "threeJS",
      "web components"
    ],
    "gallery": [
      "intro.webp",
      "network-1.webp",
      "network-2.webp",
      "network-3.webp",
      "network-4.webp",
      "particles-1.webp",
      "particles-2.webp",
      "particles-3.webp",
      "particles-4.webp"
    ],
    "index": 10
  },
  {
    "title": "Fallen Trees",
    "slug": "fallen-trees",
    "publication": "Sacramento Bee",
    "description": "Tree damage ‘we’ve never seen.’ Map shows thousands of 311 calls during Sacramento storms",
    "year": "2023",
    "date": "01/13/23",
    "awards": [],
    "awardsShort": [],
    "tags": ["svelte", "maplibre", "ai2svelte", "bar chart", "trees", "311", "sacramento", "service journalism"],
    "team": ["<a href='https://www.behance.net/garnerygab0a95#' target='_blank'>Gabby McCall</a> (illustration)"],
    "image": "textures/fade_fallen_trees.webp",
    "url": "https://www.sacbee.com/news/local/article272039637.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "ai2svelte",
      "maplibre",
      "web components"
    ],
    "gallery": [
      "intro.webp",
      "map-1.webp",
      "map-2.webp",
      "map-3.webp",
      "map-4.webp"
    ],
    "index": 11
  },
  {
    "title": "Ogallala Aquifer",
    "slug": "ogallala-aquifer",
    "publication": "Kansas City Star",
    "description": "Kansas has been running out of water for decades. Why has no one fixed it?",
    "year": "2023",
    "date": "11/16/23",
    "awards": [],
    "awardsShort": [],
    "tags": ["web components", "aquifer", "environmentalism", "water", "maplibre", "map"],
    "team": ["<a href='https://www.kansascity.com/profile/219034300/neil-nakahodo' target='_blank'>Neil Nakahodo</a> (illustration)"],
    "image": "",
    "url": "https://www.kansascity.com/news/state/kansas/article281294898.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "web components",
      "maplibre"
    ],
    "gallery": [
      "map-1.webp",
      "map-2.webp",
      "map-3.webp",
      "map-4.webp",
      "map-5.webp",
      "map-6.webp",
      "map-7.webp"
    ],
    "index": 12
  },
  {
    "title": "Miami Heat Island",
    "slug": "miami-heat-island",
    "publication": "Miami Herald",
    "description": "Miami-Dade County’s urban tree project unable to shade residents from record heat",
    "year": "2024",
    "date": "4/22/24",
    "awards": [],
    "awardsShort": [],
    "tags": ["web components", "map", "heat", "maplibre", "demographics", "climate change"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)"],
    "image": "",
    "url": "https://www.miamiherald.com/news/local/environment/climate-change/article276415291.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "web components",
      "maplibre"
    ],
    "gallery": [
      "map-1.webp",
      "map-2.webp",
      "map-3.webp",
      "heat.webp",
      "thermal.webp",
      "tree-cover-3.webp",
      "tree-cover-2.webp"
    ],
    "index": 13
  },
  {
    "title": "Private Eyes",
    "slug": "private-eyes",
    "publication": "News & Observer",
    "description": "Camera by camera, North Carolina police build growing network to track vehicles",
    "year": "2024",
    "date": "5/1/24",
    "awards": [],
    "awardsShort": [],
    "tags": ["web components", "map", "surveillance", "maplibre", "demographics"],
    "team": ["<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)", "<a href='https://semerriam.github.io/' target='_blank'>Susan Merriam</a> (dataviz)"],
    "image": "",
    "url": "https://www.newsobserver.com/news/state/north-carolina/article286920890.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "svelte",
      "web components",
      "maplibre"
    ],
    "gallery": [
      "map-1.webp",
      "map-2.webp",
      "map-3.webp",
      "map-4.webp",
      "map-5.webp"
    ],
    "index": 14
  },
  {
    "title": "9/11/74",
    "slug": "9-11-74",
    "publication": "Charlotte Observer",
    "description": "It should have been an easy flight to Charlotte. But then something went horribly wrong.",
    "year": "2024",
    "date": "9/11/24",
    "awards": [],
    "awardsShort": [],
    "tags": ["web components", "anniversary", "flight", "memorial", "tragedy", "audio"],
    "team": ["<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)"],
    "image": "",
    "url": "https://www.charlotteobserver.com/news/local/article290982455.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "web components"
    ],
    "gallery": [
      "intro.webp",
      "plane-1.webp",
      "plane-2.webp",
      "plane-3.webp"
    ],
    "index": 15
  },
  {
    "title": "Forging Fortnite",
    "slug": "forging-fortnite",
    "publication": "Raleigh News & Observer",
    "description": "How a North Carolina studio made the world’s biggest game",
    "year": "2024",
    "date": "10/15/24",
    "awards": [],
    "awardsShort": [],
    "tags": ["web components", "quiz", "fortnite", "gaming"],
    "team": ["<a href='https://www.rachelhandley.com/' target='_blank'>Rachel Handley</a> (illustration)", "<a href='https://www.saljamea.com/' target='_blank'>Sohail Al-Jamea</a> (animation)"],
    "image": "",
    "url": "https://www.newsobserver.com/news/business/article292473374.html",
    "format": "Journalism",
    "text": "",
    "tools": [
      "web components"
    ],
    "gallery": [
      "intro-1.webp",
      "intro-2.webp",
      "intro-3.webp",
      "intro-4.webp"
    ],
    "index": 16
  }
]

export async function load({ params }) {
  const project = projects.find(item => item.slug === params.slug);

  if (project) {
    return {project, projects};
  }
 
  throw error(404, 'Not found');
}