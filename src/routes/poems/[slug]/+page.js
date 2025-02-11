import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const poems = [
  {
    "name": "Lamppost",
    "rating": 3,
    "date": "12/1/2010",
    "age": 19,
    "slug": "lamppost",
    "index": 0
  },
  {
    "name": "María",
    "rating": 7,
    "date": "1/1/2011",
    "age": 19,
    "slug": "maria",
    "index": 1
  },
  {
    "name": "Shimmer",
    "rating": 6,
    "date": "1/1/2011",
    "age": 19,
    "slug": "shimmer",
    "index": 2
  },
  {
    "name": "Un",
    "rating": 4,
    "date": "2/1/2011",
    "age": 19,
    "slug": "un",
    "index": 3
  },
  {
    "name": "Ajedrez",
    "rating": 10,
    "date": "3/1/2011",
    "age": 19,
    "slug": "ajedrez",
    "index": 4
  },
  {
    "name": "Waves",
    "rating": 5,
    "date": "4/1/2011",
    "age": 19,
    "slug": "waves",
    "index": 5
  },
  {
    "name": "Bough",
    "rating": 6,
    "date": "4/1/2011",
    "age": 19,
    "slug": "bough",
    "index": 6
  },
  {
    "name": "Carpe",
    "rating": 7,
    "date": "5/1/2011",
    "age": 19,
    "slug": "carpe",
    "index": 7
  },
  {
    "name": "Willow",
    "rating": 1,
    "date": "7/1/2011",
    "age": 19,
    "slug": "willow",
    "index": 8
  },
  {
    "name": "Vagrant",
    "rating": 2,
    "date": "7/1/2011",
    "age": 19,
    "slug": "vagrant",
    "index": 9
  },
  {
    "name": "Catharsis",
    "rating": 9,
    "date": "10/1/2011",
    "age": 19,
    "slug": "catharsis",
    "index": 10
  },
  {
    "name": "Dreamscape",
    "rating": 7,
    "date": "11/1/2011",
    "age": 19,
    "slug": "dreamscape",
    "index": 11
  },
  {
    "name": "Cosmos",
    "rating": 7,
    "date": "11/1/2011",
    "age": 20,
    "slug": "cosmos",
    "index": 12
  },
  {
    "name": "Journey",
    "rating": 7,
    "date": "12/1/2011",
    "age": 20,
    "slug": "journey",
    "index": 13
  },
  {
    "name": "Origin",
    "rating": 8,
    "date": "1/1/2012",
    "age": 20,
    "slug": "origin",
    "index": 14
  },
  {
    "name": "Aviso",
    "rating": 9,
    "date": "1/1/2012",
    "age": 20,
    "slug": "aviso",
    "index": 15
  },
  {
    "name": "Animal",
    "rating": 6,
    "date": "3/1/2012",
    "age": 20,
    "slug": "animal",
    "index": 16
  },
  {
    "name": "God",
    "rating": 7,
    "date": "5/1/2012",
    "age": 20,
    "slug": "god",
    "index": 17
  },
  {
    "name": "Porch",
    "rating": 7,
    "date": "8/1/2012",
    "age": 20,
    "slug": "porch",
    "index": 18
  },
  {
    "name": "Dusk",
    "rating": 7,
    "date": "10/1/2012",
    "age": 20,
    "slug": "dusk",
    "index": 19
  },
  {
    "name": "Whitman",
    "rating": 5,
    "date": "12/1/2012",
    "age": 21,
    "slug": "whitman",
    "index": 20
  },
  {
    "name": "Remembrance",
    "rating": 7,
    "date": "1/1/2013",
    "age": 21,
    "slug": "remembrance",
    "index": 21
  },
  {
    "name": "Extract",
    "rating": 6,
    "date": "1/1/2013",
    "age": 21,
    "slug": "extract",
    "index": 22
  },
  {
    "name": "Dual",
    "rating": 6,
    "date": "2/1/2013",
    "age": 21,
    "slug": "dual",
    "index": 23
  },
  {
    "name": "Lune",
    "rating": 4,
    "date": "2/1/2013",
    "age": 21,
    "slug": "lune",
    "index": 24
  },
  {
    "name": "Ambler",
    "rating": 9,
    "date": "4/1/2013",
    "age": 21,
    "slug": "ambler",
    "index": 25
  },
  {
    "name": "Ash",
    "rating": 6,
    "date": "4/1/2013",
    "age": 21,
    "slug": "ash",
    "index": 26
  },
  {
    "name": "Viginti",
    "rating": 3,
    "date": "5/1/2013",
    "age": 21,
    "slug": "viginti",
    "index": 27
  },
  {
    "name": "Cuatro",
    "rating": 7,
    "date": "7/1/2013",
    "age": 21,
    "slug": "cuatro",
    "index": 28
  },
  {
    "name": "Wonder",
    "rating": 9,
    "date": "10/1/2013",
    "age": 21,
    "slug": "wonder",
    "index": 29
  },
  {
    "name": "Fragment",
    "rating": 5,
    "date": "10/1/2013",
    "age": 21,
    "slug": "fragment",
    "index": 30
  },
  {
    "name": "Literal",
    "rating": 5,
    "date": "11/1/2013",
    "age": 21,
    "slug": "literal",
    "index": 31
  },
  {
    "name": "Ego",
    "rating": 7,
    "date": "11/1/2013",
    "age": 22,
    "slug": "ego",
    "index": 32
  },
  {
    "name": "Impression",
    "rating": 8,
    "date": "12/1/2013",
    "age": 22,
    "slug": "impression",
    "index": 33
  },
  {
    "name": "Bullet",
    "rating": 3,
    "date": "1/1/2014",
    "age": 22,
    "slug": "bullet",
    "index": 34
  },
  {
    "name": "Conscience",
    "rating": 4,
    "date": "2/1/2014",
    "age": 22,
    "slug": "conscience",
    "index": 35
  },
  {
    "name": "Secrets",
    "rating": 5,
    "date": "3/1/2014",
    "age": 22,
    "slug": "secrets",
    "index": 36
  },
  {
    "name": "Metamorphoses",
    "rating": 8,
    "date": "5/1/2014",
    "age": 22,
    "slug": "metamorphoses",
    "index": 37
  },
  {
    "name": "Pi",
    "rating": 9,
    "date": "6/1/2014",
    "age": 22,
    "slug": "pi",
    "index": 38
  },
  {
    "name": "Rapture",
    "rating": 6,
    "date": "7/1/2014",
    "age": 22,
    "slug": "rapture",
    "index": 39
  },
  {
    "name": "Dissipate",
    "rating": 7,
    "date": "7/1/2014",
    "age": 22,
    "slug": "dissipate",
    "index": 40
  },
  {
    "name": "Return",
    "rating": 9,
    "date": "7/1/2014",
    "age": 22,
    "slug": "return",
    "index": 41
  },
  {
    "name": "Race",
    "rating": 7,
    "date": "10/1/2014",
    "age": 22,
    "slug": "race",
    "index": 42
  },
  {
    "name": "Pixy",
    "rating": 3,
    "date": "2/1/2015",
    "age": 23,
    "slug": "pixy",
    "index": 43
  },
  {
    "name": "How",
    "rating": 10,
    "date": "6/1/2015",
    "age": 23,
    "slug": "how",
    "index": 44
  },
  {
    "name": "Movement",
    "rating": 7,
    "date": "7/1/2015",
    "age": 23,
    "slug": "movement",
    "index": 45
  },
  {
    "name": "Source",
    "rating": 8,
    "date": "7/1/2015",
    "age": 23,
    "slug": "source",
    "index": 46
  },
  {
    "name": "Abuelo",
    "rating": 10,
    "date": "8/1/2015",
    "age": 23,
    "slug": "abuelo",
    "index": 47
  },
  {
    "name": "Shakey",
    "rating": 8,
    "date": "10/1/2015",
    "age": 23,
    "slug": "shakey",
    "index": 48
  },
  {
    "name": "Mathematics",
    "rating": 7,
    "date": "1/1/2016",
    "age": 24,
    "slug": "mathematics",
    "index": 49
  },
  {
    "name": "Turnout",
    "rating": 2,
    "date": "8/5/2016",
    "age": 24,
    "slug": "turnout",
    "index": 50
  },
  {
    "name": "Vengeance on the Bottle",
    "rating": 10,
    "date": "1/1/2017",
    "age": 25,
    "slug": "vengeance-on-the-bottle",
    "index": 51
  },
  {
    "name": "Sutro",
    "rating": 6,
    "date": "1/1/2017",
    "age": 25,
    "slug": "sutro",
    "index": 52
  },
  {
    "name": "Cozy",
    "rating": 7,
    "date": "1/2/2017",
    "age": 25,
    "slug": "cozy",
    "index": 53
  },
  {
    "name": "Again",
    "rating": 2,
    "date": "1/3/2017",
    "age": 25,
    "slug": "again",
    "index": 54
  },
  {
    "name": "Confession",
    "rating": 2,
    "date": "1/4/2017",
    "age": 25,
    "slug": "confession",
    "index": 55
  },
  {
    "name": "Grandpa",
    "rating": 9,
    "date": "1/6/2017",
    "age": 25,
    "slug": "grandpa",
    "index": 56
  },
  {
    "name": "Funeral",
    "rating": 3,
    "date": "1/7/2017",
    "age": 25,
    "slug": "funeral",
    "index": 57
  },
  {
    "name": "Nighttime Rain",
    "rating": 2,
    "date": "1/8/2017",
    "age": 25,
    "slug": "nighttime-rain",
    "index": 58
  },
  {
    "name": "Adagio",
    "rating": 2,
    "date": "1/9/2017",
    "age": 25,
    "slug": "adagio",
    "index": 59
  },
  {
    "name": "Ad Homonym",
    "rating": 1,
    "date": "1/10/2017",
    "age": 25,
    "slug": "ad-homonym",
    "index": 60
  },
  {
    "name": "Therapeutics",
    "rating": 3,
    "date": "1/11/2017",
    "age": 25,
    "slug": "therapeutics",
    "index": 61
  },
  {
    "name": "Nouny",
    "rating": 6,
    "date": "1/12/2017",
    "age": 25,
    "slug": "nouny",
    "index": 62
  },
  {
    "name": "Arches",
    "rating": 7,
    "date": "1/13/2017",
    "age": 25,
    "slug": "arches",
    "index": 63
  },
  {
    "name": "Huddle",
    "rating": 3,
    "date": "1/14/2017",
    "age": 25,
    "slug": "huddle",
    "index": 64
  },
  {
    "name": "Maybe",
    "rating": 4,
    "date": "1/15/2017",
    "age": 25,
    "slug": "maybe",
    "index": 65
  },
  {
    "name": "Trilogic Tryptych",
    "rating": 3,
    "date": "1/15/2017",
    "age": 25,
    "slug": "trilogic-tryptych",
    "index": 66
  },
  {
    "name": "Swingtime",
    "rating": 4,
    "date": "1/16/2017",
    "age": 25,
    "slug": "swingtime",
    "index": 67
  },
  {
    "name": "Resigned",
    "rating": 3,
    "date": "1/17/2017",
    "age": 25,
    "slug": "resigned",
    "index": 68
  },
  {
    "name": "Us",
    "rating": 1,
    "date": "1/19/2017",
    "age": 25,
    "slug": "us",
    "index": 69
  },
  {
    "name": "Inaguration",
    "rating": 8,
    "date": "1/20/2017",
    "age": 25,
    "slug": "inaguration",
    "index": 70
  },
  {
    "name": "Manual",
    "rating": 6,
    "date": "1/21/2017",
    "age": 25,
    "slug": "manual",
    "index": 71
  },
  {
    "name": "America Is A Flag",
    "rating": 7,
    "date": "1/28/2017",
    "age": 25,
    "slug": "america-is-a-flag",
    "index": 72
  },
  {
    "name": "Pathless",
    "rating": 7,
    "date": "1/28/2017",
    "age": 25,
    "slug": "pathless",
    "index": 73
  },
  {
    "name": "Planned Delight",
    "rating": 6,
    "date": "2/2/2017",
    "age": 25,
    "slug": "planned-delight",
    "index": 74
  },
  {
    "name": "Nestldown",
    "rating": 3,
    "date": "2/4/2017",
    "age": 25,
    "slug": "nestldown",
    "index": 75
  },
  {
    "name": "Code Refusal",
    "rating": 1,
    "date": "2/6/2017",
    "age": 25,
    "slug": "code-refusal",
    "index": 76
  },
  {
    "name": "Tapestry",
    "rating": 7,
    "date": "2/7/2017",
    "age": 25,
    "slug": "tapestry",
    "index": 77
  },
  {
    "name": "Nonsense I",
    "rating": 1,
    "date": "2/18/2017",
    "age": 25,
    "slug": "nonsense-i",
    "index": 78
  },
  {
    "name": "Don’t Look Too Close",
    "rating": 2,
    "date": "2/19/2017",
    "age": 25,
    "slug": "dont-look-too-close",
    "index": 79
  },
  {
    "name": "Panhandle",
    "rating": 8,
    "date": "2/20/2017",
    "age": 25,
    "slug": "panhandle",
    "index": 80
  },
  {
    "name": "Tense",
    "rating": 1,
    "date": "2/23/2017",
    "age": 25,
    "slug": "tense",
    "index": 81
  },
  {
    "name": "Roots",
    "rating": 5,
    "date": "2/27/2017",
    "age": 25,
    "slug": "roots",
    "index": 82
  },
  {
    "name": "Premonitions",
    "rating": 6,
    "date": "2/28/2017",
    "age": 25,
    "slug": "premonitions",
    "index": 83
  },
  {
    "name": "Copy Machine",
    "rating": 1,
    "date": "3/1/2017",
    "age": 25,
    "slug": "copy-machine",
    "index": 84
  },
  {
    "name": "Lone Star",
    "rating": 5,
    "date": "3/2/2017",
    "age": 25,
    "slug": "lone-star",
    "index": 85
  },
  {
    "name": "Dogpatch",
    "rating": 6,
    "date": "3/2/2017",
    "age": 25,
    "slug": "dogpatch",
    "index": 86
  },
  {
    "name": "Streetwise Horticulture",
    "rating": 6,
    "date": "3/15/2017",
    "age": 25,
    "slug": "streetwise-horticulture",
    "index": 87
  },
  {
    "name": "Fear",
    "rating": 7,
    "date": "3/26/2017",
    "age": 25,
    "slug": "fear",
    "index": 88
  },
  {
    "name": "Bottomed Out",
    "rating": 7,
    "date": "3/31/2017",
    "age": 25,
    "slug": "bottomed-out",
    "index": 89
  },
  {
    "name": "Lazy Chase",
    "rating": 5,
    "date": "3/31/2017",
    "age": 25,
    "slug": "lazy-chase",
    "index": 90
  },
  {
    "name": "Crook",
    "rating": 4,
    "date": "4/1/2017",
    "age": 25,
    "slug": "crook",
    "index": 91
  },
  {
    "name": "Immanence",
    "rating": 5,
    "date": "4/2/2017",
    "age": 25,
    "slug": "immanence",
    "index": 92
  },
  {
    "name": "Zuni Street Band",
    "rating": 9,
    "date": "4/8/2017",
    "age": 25,
    "slug": "zuni-street-band",
    "index": 93
  },
  {
    "name": "6th & Market",
    "rating": 7,
    "date": "4/8/2017",
    "age": 25,
    "slug": "6th-market",
    "index": 94
  },
  {
    "name": "Golden Hour",
    "rating": 7,
    "date": "4/18/2017",
    "age": 25,
    "slug": "golden-hour",
    "index": 95
  },
  {
    "name": "What’s At Stake",
    "rating": 4,
    "date": "4/23/2017",
    "age": 25,
    "slug": "whats-at-stake",
    "index": 96
  },
  {
    "name": "White Lies",
    "rating": 6,
    "date": "4/23/2017",
    "age": 25,
    "slug": "white-lies",
    "index": 97
  },
  {
    "name": "Treetop Sunset",
    "rating": 5,
    "date": "4/23/2017",
    "age": 25,
    "slug": "treetop-sunset",
    "index": 98
  },
  {
    "name": "National Amnesia",
    "rating": 7,
    "date": "4/24/2017",
    "age": 25,
    "slug": "national-amnesia",
    "index": 99
  },
  {
    "name": "Languid",
    "rating": 6,
    "date": "4/30/2017",
    "age": 25,
    "slug": "languid",
    "index": 100
  },
  {
    "name": "Tigers",
    "rating": 8,
    "date": "5/5/2017",
    "age": 25,
    "slug": "tigers",
    "index": 101
  },
  {
    "name": "Sand Dune City",
    "rating": 2,
    "date": "5/5/2017",
    "age": 25,
    "slug": "sand-dune-city",
    "index": 102
  },
  {
    "name": "Habitual",
    "rating": 7,
    "date": "5/11/2017",
    "age": 25,
    "slug": "habitual",
    "index": 103
  },
  {
    "name": "Power",
    "rating": 5,
    "date": "5/20/2017",
    "age": 25,
    "slug": "power",
    "index": 104
  },
  {
    "name": "Gone",
    "rating": 6,
    "date": "5/21/2017",
    "age": 25,
    "slug": "gone",
    "index": 105
  },
  {
    "name": "Observation No. 1",
    "rating": 8,
    "date": "5/22/2017",
    "age": 25,
    "slug": "observation-no-1",
    "index": 106
  },
  {
    "name": "Lonesome",
    "rating": 8,
    "date": "5/23/2017",
    "age": 25,
    "slug": "lonesome",
    "index": 107
  },
  {
    "name": "Tidy",
    "rating": 7,
    "date": "5/23/2017",
    "age": 25,
    "slug": "tidy",
    "index": 108
  },
  {
    "name": "Cynic",
    "rating": 3,
    "date": "5/23/2017",
    "age": 25,
    "slug": "cynic",
    "index": 109
  },
  {
    "name": "Inheritance",
    "rating": 9,
    "date": "5/23/2017",
    "age": 25,
    "slug": "inheritance",
    "index": 110
  },
  {
    "name": "Perceptibly Impersonal",
    "rating": 5,
    "date": "5/23/2017",
    "age": 25,
    "slug": "perceptibly-impersonal",
    "index": 111
  },
  {
    "name": "Placard Sense",
    "rating": 8,
    "date": "5/23/2017",
    "age": 25,
    "slug": "placard-sense",
    "index": 112
  },
  {
    "name": "Welcome to the Machine",
    "rating": 4,
    "date": "5/23/2017",
    "age": 25,
    "slug": "welcome-to-the-machine",
    "index": 113
  },
  {
    "name": "Gentrified",
    "rating": 5,
    "date": "5/23/2017",
    "age": 25,
    "slug": "gentrified",
    "index": 114
  },
  {
    "name": "Privilege",
    "rating": 2,
    "date": "5/25/2017",
    "age": 25,
    "slug": "privilege",
    "index": 115
  },
  {
    "name": "Insulated",
    "rating": 9,
    "date": "5/28/2017",
    "age": 25,
    "slug": "insulated",
    "index": 116
  },
  {
    "name": "Craftsmanship",
    "rating": 7,
    "date": "6/13/2017",
    "age": 25,
    "slug": "craftsmanship",
    "index": 117
  },
  {
    "name": "Uniform Variance",
    "rating": 8,
    "date": "6/13/2017",
    "age": 25,
    "slug": "uniform-variance",
    "index": 118
  },
  {
    "name": "Urgent: Questionnaire",
    "rating": 9,
    "date": "6/13/2017",
    "age": 25,
    "slug": "urgent-questionnaire",
    "index": 119
  },
  {
    "name": "Proposition Q",
    "rating": 8,
    "date": "6/15/2017",
    "age": 25,
    "slug": "proposition-q",
    "index": 120
  },
  {
    "name": "Bubble Talk",
    "rating": 3,
    "date": "6/15/2017",
    "age": 25,
    "slug": "bubble-talk",
    "index": 121
  },
  {
    "name": "Regret",
    "rating": 1,
    "date": "6/15/2017",
    "age": 25,
    "slug": "regret",
    "index": 122
  },
  {
    "name": "City of Cold Shoulders",
    "rating": 4,
    "date": "6/15/2017",
    "age": 25,
    "slug": "city-of-cold-shoulders",
    "index": 123
  },
  {
    "name": "Ordinary",
    "rating": 6,
    "date": "6/15/2017",
    "age": 25,
    "slug": "ordinary",
    "index": 124
  },
  {
    "name": "Lisboa",
    "rating": 7,
    "date": "7/10/2017",
    "age": 25,
    "slug": "lisboa",
    "index": 125
  },
  {
    "name": "Observational",
    "rating": 8,
    "date": "7/16/2017",
    "age": 25,
    "slug": "observational",
    "index": 126
  },
  {
    "name": "Porto",
    "rating": 4,
    "date": "7/17/2017",
    "age": 25,
    "slug": "porto",
    "index": 127
  },
  {
    "name": "Train Landscape",
    "rating": 6,
    "date": "7/18/2017",
    "age": 25,
    "slug": "train-landscape",
    "index": 128
  },
  {
    "name": "Les Beaux",
    "rating": 3,
    "date": "7/19/2017",
    "age": 25,
    "slug": "les-beaux",
    "index": 129
  },
  {
    "name": "Praia da Rocha",
    "rating": 8,
    "date": "7/20/2017",
    "age": 25,
    "slug": "praia-da-rocha",
    "index": 130
  },
  {
    "name": "Lagos",
    "rating": 4,
    "date": "7/21/2017",
    "age": 25,
    "slug": "lagos",
    "index": 131
  },
  {
    "name": "Ellison",
    "rating": 8,
    "date": "7/22/2017",
    "age": 25,
    "slug": "ellison",
    "index": 132
  },
  {
    "name": "Lisbon Cathedral",
    "rating": 7,
    "date": "7/23/2017",
    "age": 25,
    "slug": "lisbon-cathedral",
    "index": 133
  },
  {
    "name": "Life Is Not Mathematics",
    "rating": 2,
    "date": "7/24/2017",
    "age": 25,
    "slug": "life-is-not-mathematics",
    "index": 134
  },
  {
    "name": "787",
    "rating": 1,
    "date": "7/25/2017",
    "age": 25,
    "slug": "787",
    "index": 135
  },
  {
    "name": "Embarrassed",
    "rating": 7,
    "date": "7/26/2017",
    "age": 25,
    "slug": "embarrassed",
    "index": 136
  },
  {
    "name": "Gut Empty",
    "rating": 2,
    "date": "7/27/2017",
    "age": 25,
    "slug": "gut-empty",
    "index": 137
  },
  {
    "name": "Graph Theory",
    "rating": 6,
    "date": "8/1/2017",
    "age": 25,
    "slug": "graph-theory",
    "index": 138
  },
  {
    "name": "Prompt Paralytics",
    "rating": 5,
    "date": "8/2/2017",
    "age": 25,
    "slug": "prompt-paralytics",
    "index": 139
  },
  {
    "name": "Codebase",
    "rating": 8,
    "date": "8/4/2017",
    "age": 25,
    "slug": "codebase",
    "index": 140
  },
  {
    "name": "Lazy Code",
    "rating": 1,
    "date": "8/7/2017",
    "age": 25,
    "slug": "lazy-code",
    "index": 141
  },
  {
    "name": "Track Marks",
    "rating": 8,
    "date": "8/8/2017",
    "age": 25,
    "slug": "track-marks",
    "index": 142
  },
  {
    "name": "Grafitti",
    "rating": 8,
    "date": "8/9/2017",
    "age": 25,
    "slug": "grafitti",
    "index": 143
  },
  {
    "name": "Rodin",
    "rating": 9,
    "date": "8/9/2017",
    "age": 25,
    "slug": "rodin",
    "index": 144
  },
  {
    "name": "Fictional Estate",
    "rating": 7,
    "date": "8/14/2017",
    "age": 25,
    "slug": "fictional-estate",
    "index": 145
  },
  {
    "name": "Opulence",
    "rating": 7,
    "date": "8/25/2017",
    "age": 25,
    "slug": "opulence",
    "index": 146
  },
  {
    "name": "Slow-Volt Spine I",
    "rating": 8,
    "date": "9/1/2017",
    "age": 25,
    "slug": "slow-volt-spine-i",
    "index": 147
  },
  {
    "name": "Transactional Mercy",
    "rating": 5,
    "date": "9/24/2017",
    "age": 25,
    "slug": "transactional-mercy",
    "index": 148
  },
  {
    "name": "Discombobulant",
    "rating": 9,
    "date": "9/25/2017",
    "age": 25,
    "slug": "discombobulant",
    "index": 149
  },
  {
    "name": "Not Everything",
    "rating": 4,
    "date": "9/25/2017",
    "age": 25,
    "slug": "not-everything",
    "index": 150
  },
  {
    "name": "Marriage",
    "rating": 9,
    "date": "10/1/2017",
    "age": 25,
    "slug": "marriage",
    "index": 151
  },
  {
    "name": "Observation No. 2",
    "rating": 6,
    "date": "10/2/2017",
    "age": 25,
    "slug": "observation-no-2",
    "index": 152
  },
  {
    "name": "Sunbathing",
    "rating": 3,
    "date": "10/8/2017",
    "age": 25,
    "slug": "sunbathing",
    "index": 153
  },
  {
    "name": "Streetchair",
    "rating": 5,
    "date": "10/14/2017",
    "age": 25,
    "slug": "streetchair",
    "index": 154
  },
  {
    "name": "Found Musician",
    "rating": 8,
    "date": "10/14/2017",
    "age": 25,
    "slug": "found-musician",
    "index": 155
  },
  {
    "name": "Foundational",
    "rating": 8,
    "date": "10/15/2017",
    "age": 25,
    "slug": "foundational",
    "index": 156
  },
  {
    "name": "Coin-op Frenzy",
    "rating": 1,
    "date": "10/19/2017",
    "age": 25,
    "slug": "coin-op-frenzy",
    "index": 157
  },
  {
    "name": "Excessive",
    "rating": 5,
    "date": "11/4/2017",
    "age": 25,
    "slug": "excessive",
    "index": 158
  },
  {
    "name": "Bland",
    "rating": 5,
    "date": "11/4/2017",
    "age": 25,
    "slug": "bland",
    "index": 159
  },
  {
    "name": "Incomplete",
    "rating": 3,
    "date": "11/4/2017",
    "age": 25,
    "slug": "incomplete",
    "index": 160
  },
  {
    "name": "Elegy",
    "rating": 4,
    "date": "11/10/2017",
    "age": 25,
    "slug": "elegy",
    "index": 161
  },
  {
    "name": "Currency",
    "rating": 4,
    "date": "12/23/2017",
    "age": 26,
    "slug": "currency",
    "index": 162
  },
  {
    "name": "Wavering Belief",
    "rating": 2,
    "date": "12/24/2017",
    "age": 26,
    "slug": "wavering-belief",
    "index": 163
  },
  {
    "name": "Demand No. 1",
    "rating": 8,
    "date": "1/1/2018",
    "age": 26,
    "slug": "demand-no-1",
    "index": 164
  },
  {
    "name": "Abstract Dexterity",
    "rating": 8,
    "date": "1/2/2018",
    "age": 26,
    "slug": "abstract-dexterity",
    "index": 165
  },
  {
    "name": "Abridged",
    "rating": 7,
    "date": "1/10/2018",
    "age": 26,
    "slug": "abridged",
    "index": 166
  },
  {
    "name": "Eponymous",
    "rating": 8,
    "date": "1/18/2018",
    "age": 26,
    "slug": "eponymous",
    "index": 167
  },
  {
    "name": "Bound",
    "rating": 7,
    "date": "1/25/2018",
    "age": 26,
    "slug": "bound",
    "index": 168
  },
  {
    "name": "6th",
    "rating": 7,
    "date": "2/6/2018",
    "age": 26,
    "slug": "6th",
    "index": 169
  },
  {
    "name": "The Valley",
    "rating": 4,
    "date": "2/6/2018",
    "age": 26,
    "slug": "the-valley",
    "index": 170
  },
  {
    "name": "Keep It Racing",
    "rating": 6,
    "date": "2/6/2018",
    "age": 26,
    "slug": "keep-it-racing",
    "index": 171
  },
  {
    "name": "Earthquake",
    "rating": 8,
    "date": "2/17/2018",
    "age": 26,
    "slug": "earthquake",
    "index": 172
  },
  {
    "name": "Fundamental",
    "rating": 8,
    "date": "2/17/2018",
    "age": 26,
    "slug": "fundamental",
    "index": 173
  },
  {
    "name": "Loosened",
    "rating": 8,
    "date": "5/4/2018",
    "age": 26,
    "slug": "loosened",
    "index": 174
  },
  {
    "name": "Subtlety",
    "rating": 7,
    "date": "6/25/2018",
    "age": 26,
    "slug": "subtlety",
    "index": 175
  },
  {
    "name": "Pivotal Mantras",
    "rating": 4,
    "date": "7/25/2018",
    "age": 26,
    "slug": "pivotal-mantras",
    "index": 176
  },
  {
    "name": "Last Day",
    "rating": 7,
    "date": "9/5/2018",
    "age": 26,
    "slug": "last-day",
    "index": 177
  },
  {
    "name": "Lance Armstrong",
    "rating": 5,
    "date": "9/28/2018",
    "age": 26,
    "slug": "lance-armstrong",
    "index": 178
  },
  {
    "name": "Panic / Addict",
    "rating": 5,
    "date": "9/28/2018",
    "age": 26,
    "slug": "panic-addict",
    "index": 179
  },
  {
    "name": "Capital Is Mutable",
    "rating": 6,
    "date": "10/2/2018",
    "age": 26,
    "slug": "capital-is-mutable",
    "index": 180
  },
  {
    "name": "Protest",
    "rating": 2,
    "date": "10/2/2018",
    "age": 26,
    "slug": "protest",
    "index": 181
  },
  {
    "name": "Acquisition",
    "rating": 5,
    "date": "10/22/2018",
    "age": 26,
    "slug": "acquisition",
    "index": 182
  },
  {
    "name": "High",
    "rating": 10,
    "date": "10/22/2018",
    "age": 26,
    "slug": "high",
    "index": 183
  },
  {
    "name": "Meadowlark",
    "rating": 6,
    "date": "11/3/2018",
    "age": 26,
    "slug": "meadowlark",
    "index": 184
  },
  {
    "name": "Pithy",
    "rating": 7,
    "date": "12/10/2018",
    "age": 27,
    "slug": "pithy",
    "index": 185
  },
  {
    "name": "Burst",
    "rating": 8,
    "date": "12/10/2018",
    "age": 27,
    "slug": "burst",
    "index": 186
  },
  {
    "name": "Train Quote",
    "rating": 9,
    "date": "1/22/2019",
    "age": 27,
    "slug": "train-quote",
    "index": 187
  },
  {
    "name": "Help",
    "rating": 6,
    "date": "2/22/2019",
    "age": 27,
    "slug": "help",
    "index": 188
  },
  {
    "name": "Details",
    "rating": 8,
    "date": "2/28/2019",
    "age": 27,
    "slug": "details",
    "index": 189
  },
  {
    "name": "Soliloquy",
    "rating": 7,
    "date": "3/7/2019",
    "age": 27,
    "slug": "soliloquy",
    "index": 190
  },
  {
    "name": "Identical",
    "rating": 10,
    "date": "3/10/2019",
    "age": 27,
    "slug": "identical",
    "index": 191
  },
  {
    "name": "Unlucky Skin",
    "rating": 6,
    "date": "3/15/2019",
    "age": 27,
    "slug": "unlucky-skin",
    "index": 192
  },
  {
    "name": "Routine",
    "rating": 4,
    "date": "3/15/2019",
    "age": 27,
    "slug": "routine",
    "index": 193
  },
  {
    "name": "Cold Surf",
    "rating": 2,
    "date": "4/8/2019",
    "age": 27,
    "slug": "cold-surf",
    "index": 194
  },
  {
    "name": "Home",
    "rating": 8,
    "date": "4/18/2019",
    "age": 27,
    "slug": "home",
    "index": 195
  },
  {
    "name": "Sunday Morning",
    "rating": 10,
    "date": "4/18/2019",
    "age": 27,
    "slug": "sunday-morning",
    "index": 196
  },
  {
    "name": "NIMBY",
    "rating": 5,
    "date": "4/18/2019",
    "age": 27,
    "slug": "nimby",
    "index": 197
  },
  {
    "name": "Haiku 1",
    "rating": 8,
    "date": "4/30/2019",
    "age": 27,
    "slug": "haiku-1",
    "index": 198
  },
  {
    "name": "Out Of My Control",
    "rating": 7,
    "date": "4/30/2019",
    "age": 27,
    "slug": "out-of-my-control",
    "index": 199
  },
  {
    "name": "In Focus",
    "rating": 9,
    "date": "7/6/2019",
    "age": 27,
    "slug": "in-focus",
    "index": 200
  },
  {
    "name": "Gaunt Urgency",
    "rating": 7,
    "date": "7/21/2019",
    "age": 27,
    "slug": "gaunt-urgency",
    "index": 201
  },
  {
    "name": "Rarely, Me",
    "rating": 8,
    "date": "9/26/2019",
    "age": 27,
    "slug": "rarely-me",
    "index": 202
  },
  {
    "name": "Anthropology",
    "rating": 7,
    "date": "10/15/2019",
    "age": 27,
    "slug": "anthropology",
    "index": 203
  },
  {
    "name": "Villa",
    "rating": 5,
    "date": "10/16/2019",
    "age": 27,
    "slug": "villa",
    "index": 204
  },
  {
    "name": "Granada",
    "rating": 4,
    "date": "10/19/2019",
    "age": 27,
    "slug": "granada",
    "index": 205
  },
  {
    "name": "Preacher I",
    "rating": 2,
    "date": "11/3/2019",
    "age": 27,
    "slug": "preacher-i",
    "index": 206
  },
  {
    "name": "Allowance",
    "rating": 7,
    "date": "11/7/2019",
    "age": 27,
    "slug": "allowance",
    "index": 207
  },
  {
    "name": "Short Circuit",
    "rating": 6,
    "date": "11/17/2019",
    "age": 28,
    "slug": "short-circuit",
    "index": 208
  },
  {
    "name": "Impulse",
    "rating": 8,
    "date": "12/13/2019",
    "age": 28,
    "slug": "impulse",
    "index": 209
  },
  {
    "name": "Whit",
    "rating": 5,
    "date": "12/13/2019",
    "age": 28,
    "slug": "whit",
    "index": 210
  },
  {
    "name": "Etymological Oddities",
    "rating": 6,
    "date": "1/4/2020",
    "age": 28,
    "slug": "etymological-oddities",
    "index": 211
  },
  {
    "name": "Brachial",
    "rating": 8,
    "date": "1/8/2020",
    "age": 28,
    "slug": "brachial",
    "index": 212
  },
  {
    "name": "My Body is a Vessel That I Will Break",
    "rating": 9,
    "date": "2/24/2020",
    "age": 28,
    "slug": "my-body-is-a-vessel-that-i-will-break",
    "index": 213
  },
  {
    "name": "Excerpt (Stephen Dunn)",
    "rating": 7,
    "date": "3/17/2020",
    "age": 28,
    "slug": "excerpt",
    "index": 214
  },
  {
    "name": "Conditional",
    "rating": 4,
    "date": "4/16/2020",
    "age": 28,
    "slug": "conditional",
    "index": 215
  },
  {
    "name": "Retinue",
    "rating": 7,
    "date": "4/16/2020",
    "age": 28,
    "slug": "retinue",
    "index": 216
  },
  {
    "name": "Hobbled",
    "rating": 5,
    "date": "4/24/2020",
    "age": 28,
    "slug": "hobbled",
    "index": 217
  },
  {
    "name": "Absentminded",
    "rating": 5,
    "date": "4/24/2020",
    "age": 28,
    "slug": "absentminded",
    "index": 218
  },
  {
    "name": "Even Keeled, Kempt",
    "rating": 3,
    "date": "6/27/2020",
    "age": 28,
    "slug": "even-keeled-kempt",
    "index": 219
  },
  {
    "name": "Waste Product",
    "rating": 5,
    "date": "8/1/2020",
    "age": 28,
    "slug": "waste-product",
    "index": 220
  },
  {
    "name": "Brainlag",
    "rating": 8,
    "date": "8/16/2020",
    "age": 28,
    "slug": "brainlag",
    "index": 221
  },
  {
    "name": "Scales",
    "rating": 8,
    "date": "9/2/2020",
    "age": 28,
    "slug": "scales",
    "index": 222
  },
  {
    "name": "Skinned",
    "rating": 9,
    "date": "9/12/2020",
    "age": 28,
    "slug": "skinned",
    "index": 223
  },
  {
    "name": "Drawing Breath",
    "rating": 3,
    "date": "12/14/2020",
    "age": 29,
    "slug": "drawing-breath",
    "index": 224
  },
  {
    "name": "Pity",
    "rating": 1,
    "date": "12/14/2020",
    "age": 29,
    "slug": "pity",
    "index": 225
  },
  {
    "name": "On Watching",
    "rating": 7,
    "date": "12/20/2020",
    "age": 29,
    "slug": "on-watching",
    "index": 226
  },
  {
    "name": "On Resting In the Woods",
    "rating": 7,
    "date": "12/27/2020",
    "age": 29,
    "slug": "on-resting-in-the-woods",
    "index": 227
  },
  {
    "name": "Habituated",
    "rating": 4,
    "date": "2/1/2021",
    "age": 29,
    "slug": "habituated",
    "index": 228
  },
  {
    "name": "Sunspot",
    "rating": 8,
    "date": "2/2/2021",
    "age": 29,
    "slug": "sunspot",
    "index": 229
  },
  {
    "name": "Envy is Empty I",
    "rating": 7,
    "date": "3/14/2021",
    "age": 29,
    "slug": "envy-is-empty-i",
    "index": 230
  },
  {
    "name": "Trace The Line",
    "rating": 4,
    "date": "3/27/2021",
    "age": 29,
    "slug": "trace-the-line",
    "index": 231
  },
  {
    "name": "Monarch",
    "rating": 9,
    "date": "4/9/2021",
    "age": 29,
    "slug": "monarch",
    "index": 232
  },
  {
    "name": "A Kind of Prayer",
    "rating": 6,
    "date": "4/10/2021",
    "age": 29,
    "slug": "a-kind-of-prayer",
    "index": 233
  },
  {
    "name": "(Di)splayed",
    "rating": 5,
    "date": "4/11/2021",
    "age": 29,
    "slug": "displayed",
    "index": 234
  },
  {
    "name": "Matrilineal",
    "rating": 5,
    "date": "5/28/2021",
    "age": 29,
    "slug": "matrilineal",
    "index": 235
  },
  {
    "name": "Koan I",
    "rating": 6,
    "date": "10/4/2021",
    "age": 29,
    "slug": "koan-i",
    "index": 236
  },
  {
    "name": "Philosophy",
    "rating": 3,
    "date": "10/5/2021",
    "age": 29,
    "slug": "philosophy",
    "index": 237
  },
  {
    "name": "March",
    "rating": 7,
    "date": "10/5/2021",
    "age": 29,
    "slug": "march",
    "index": 238
  },
  {
    "name": "Is It True?",
    "rating": 7,
    "date": "10/8/2021",
    "age": 29,
    "slug": "is-it-true",
    "index": 239
  },
  {
    "name": "What Little Fate",
    "rating": 9,
    "date": "10/26/2021",
    "age": 29,
    "slug": "what-little-fate",
    "index": 240
  },
  {
    "name": "Rare Earth Exhaust",
    "rating": 8,
    "date": "1/4/2022",
    "age": 30,
    "slug": "rare-earth-exhaust",
    "index": 241
  },
  {
    "name": "Lost Cause",
    "rating": 4,
    "date": "1/4/2022",
    "age": 30,
    "slug": "lost-cause",
    "index": 242
  },
  {
    "name": "Sunshade",
    "rating": 9,
    "date": "1/4/2022",
    "age": 30,
    "slug": "sunshade",
    "index": 243
  },
  {
    "name": "Bombast",
    "rating": 8,
    "date": "1/22/2022",
    "age": 30,
    "slug": "bombast",
    "index": 244
  },
  {
    "name": "Acquired Taste",
    "rating": 8,
    "date": "1/23/2022",
    "age": 30,
    "slug": "acquired-taste",
    "index": 245
  },
  {
    "name": "Cottonwood",
    "rating": 2,
    "date": "1/23/2022",
    "age": 30,
    "slug": "cottonwood",
    "index": 246
  },
  {
    "name": "Sequoia",
    "rating": 4,
    "date": "1/23/2022",
    "age": 30,
    "slug": "sequoia",
    "index": 247
  },
  {
    "name": "Envy is Empty II",
    "rating": 1,
    "date": "6/15/2022",
    "age": 30,
    "slug": "envy-is-empty-ii",
    "index": 248
  },
  {
    "name": "Hypothesis",
    "rating": 6,
    "date": "6/22/2022",
    "age": 30,
    "slug": "hypothesis",
    "index": 249
  },
  {
    "name": "Overstated",
    "rating": 3,
    "date": "6/23/2022",
    "age": 30,
    "slug": "overstated",
    "index": 250
  },
  {
    "name": "Texan Clatter",
    "rating": 8,
    "date": "7/15/2022",
    "age": 30,
    "slug": "texan-clatter",
    "index": 251
  },
  {
    "name": "Foggy Rhythm",
    "rating": 6,
    "date": "11/13/2022",
    "age": 31,
    "slug": "foggy-rhythm",
    "index": 252
  },
  {
    "name": "At 31",
    "rating": 4,
    "date": "11/14/2022",
    "age": 31,
    "slug": "at-31",
    "index": 253
  },
  {
    "name": "Boat in the Harbor",
    "rating": 3,
    "date": "9/3/2023",
    "age": 31,
    "slug": "boat-in-the-harbor",
    "index": 254
  },
  {
    "name": "Elutropea",
    "rating": 3,
    "date": "12/27/2023",
    "age": 32,
    "slug": "elutropea",
    "index": 255
  },
  {
    "name": "Finale",
    "rating": 7,
    "date": "12/30/2023",
    "age": 32,
    "slug": "finale",
    "index": 256
  },
  {
    "name": "Winter Sun",
    "rating": 8,
    "date": "2/29/2024",
    "age": 32,
    "slug": "winter-sun",
    "index": 257
  },
  {
    "name": "Spontaneity",
    "rating": 6,
    "date": "3/1/2024",
    "age": 32,
    "slug": "spontaneity",
    "index": 258
  },
  {
    "name": "Magnolia",
    "rating": 7,
    "date": "3/1/2024",
    "age": 32,
    "slug": "magnolia",
    "index": 259
  },
  {
    "name": "Fragments",
    "rating": 3,
    "date": "4/7/2024",
    "age": 32,
    "slug": "fragments",
    "index": 260
  },
  {
    "name": "Admittance",
    "rating": 7,
    "date": "4/14/2024",
    "age": 32,
    "slug": "admittance",
    "index": 261
  },
  {
    "name": "Parabola",
    "rating": 7,
    "date": "4/26/2024",
    "age": 32,
    "slug": "parabola",
    "index": 262
  },
  {
    "name": "On Falling",
    "rating": 7,
    "date": "5/20/2024",
    "age": 32,
    "slug": "on-falling",
    "index": 263
  },
  {
    "name": "It is Enough",
    "rating": 7,
    "date": "5/24/2024",
    "age": 32,
    "slug": "it-is-enough",
    "index": 264
  },
  {
    "name": "Frank",
    "rating": 4,
    "date": "6/17/2024",
    "age": 32,
    "slug": "frank",
    "index": 265
  },
  {
    "name": "Koan II",
    "rating": 2,
    "date": "6/23/2024",
    "age": 32,
    "slug": "koan-ii",
    "index": 266
  },
  {
    "name": "On Longing",
    "rating": 8,
    "date": "6/28/2024",
    "age": 32,
    "slug": "on-longing",
    "index": 267
  }
]

export async function load({ params }) {
  // const writings = await loadJSON('/data/writings.json')
  const poem = poems.find(item => item.slug === params.slug);

  if (poem) {
    return {poem, poems};
  }
 
  throw error(404, 'Not found');
}