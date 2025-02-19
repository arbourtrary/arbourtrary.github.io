<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';

  let backgroundColor = 'transparent';
  let image = {};
  let canvas;
  let caption;
  let data;
  let dotLayout = "pack";
  let imgOpacity = 0;
  let activeIndex = 0;
  let imageLoaded = false;
  let activeButtons = [true, false, false]
  let imageFolder = base + "/images/image-sampling/"
  let images = [
    {url: `${imageFolder}/monalisa.webp`, name: "Mona Lisa", artist: "Leonardo da Vinci", year: 1503, link: "https://www.louvre.fr/en/explore/the-palace/from-the-mona-lisa-to-the-wedding-feast-at-cana"},
    {url: `${imageFolder}/vangogh-blue.webp`, name: "Portrait de l'artiste", artist: "Vincent Van Gogh", year: 1889, link: "https://www.musee-orsay.fr/en/artworks/portrait-de-lartiste-747"},
    {url: `${imageFolder}/vangogh-grey.webp`, name: "Self-Portrait with Grey Felt Hat", artist: "Vincent Van Gogh", year: 1887, link: "https://www.vangoghmuseum.nl/en/collection/s0016V1962"},
    {url: `${imageFolder}/earring.webp`, name: "Girl with a Pearl Earring", artist: "Johannes Vermeer", year: 1665, link: "https://www.mauritshuis.nl/en/our-collection/artworks/670-girl-with-a-pearl-earring/"},
    {url: `${imageFolder}/silhouette.webp`, name: "Silhouette", artist: "William Henry Brown", year: "1828-83", link: "https://www.metmuseum.org/art/collection/search/825924"},
    {url: `${imageFolder}/plate.webp`, name: "Plate 148", artist: "Adolf Schmidt", year: "1890", link: "https://publicdomainreview.org/collection/schmidt-diatoms/"},
    {url: `${imageFolder}/frida.webp`, name: "Yo y mis pericos", artist: "Frida Kahlo", year: "1941", link: "https://www.nationalgeographic.com/adventure/article/famous-women-artists-self-portraits-culture"},
    {url: `${imageFolder}/galatea.webp`, name: "Galatea of the spheres", artist: "Salvador Dalí", year: "1952", link: "https://www.salvador-dali.org/en/museums/dali-theatre-museum-in-figueres/the-collection/131/galatea-of-the-spheres"},
    {url: `${imageFolder}/magritte.webp`, name: "The Son of Man", artist: "René Magritte", year: "1964", link: "https://www.riseart.com/article/2699/masterpiece-in-the-spotlight-the-son-of-man-magritte"},
    {url: `${imageFolder}/octopus.webp`, name: "Cephalopodes Pl. 2", artist: "Jean Baptiste Vérany", year: "1851", link: "https://publicdomainreview.org/collection/verany-cephalopods/"},
    {url: `${imageFolder}/color.webp`, name: "Elucidation of colors", artist: "James Sowerby", year: "1809", link: "https://publicdomainreview.org/collection/colour-wheels-charts-and-tables-through-history/"},
    {url: `${imageFolder}/bird.webp`, name: "Le petit Rolle Violet", artist: "Jacques Barraband", year: "1806", link: "http://digitalcollections.nypl.org/items/510d47d9-71cc-a3d9-e040-e00a18064a99"},
    {url: `${imageFolder}/rockwell.webp`, name: "Triple Self-Portrait", artist: "Norman Rockwell", year: "1960", link: "https://en.wikipedia.org/wiki/Triple_Self-Portrait"},
    {url: `${imageFolder}/basquiat.webp`, name: "Sugar", artist: "Jean-Michel Basquiat", year: "1982", link: "https://elialutz.com/le-mythe-des-artistes-maudits-de-baudelaire-a-basquiat/"},
    {url: `${imageFolder}/escher.webp`, name: "Hand with Reflecting Sphere", artist: "M.C. Escher", year: "1935", link: "https://www.escherinhetpaleis.nl/showpiece/hand-with-reflecting-sphere/?lang=en#"},
    {url: `${imageFolder}/lilies.webp`, name: "Le Bassin aux nymphéas", artist: "Claude Monet", year: "1899", link: "https://www.metmuseum.org/art/collection/search/437127"}
  ]

  onMount(() => {
    data = JSON.parse(JSON.stringify(images));
    setRandomImageWithoutReplacement();
  });

  function setRandomImageWithoutReplacement() {
    const randomIndex = Math.round(Math.random() * (data.length - 1));
    image = data[randomIndex]

    data.splice(randomIndex, 1);
    if (data.length === 0) {
      data = JSON.parse(JSON.stringify(images));
    }
    updateActiveButton(activeIndex);
    processImage(dotLayout, imgOpacity);
  }

  function updateActiveButton(index) {
    for (var i = 0; i < activeButtons.length; i++) {
      if (i === index) {
        activeButtons[i] = true;
      } else {
        activeButtons[i] = false;
      }
    }
    activeIndex = index;
  }

  async function processImage(layout="pack", bgOpacity=0) {
    if (!canvas) return;
    dotLayout = layout;
    imgOpacity = bgOpacity;
    
    const ctx = canvas.getContext('2d');
    
    const img = new window.Image();
    
    img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        const parentWidth = canvas.parentElement.offsetWidth;
        const widthRatio = canvas.offsetWidth / parentWidth;

        const sizeFactor = 50 / 2785 // 0.000773298067  from silhouette.webp
        const dotSize = 2 * sizeFactor * img.width / widthRatio;
        
        // Create a temporary canvas for the original image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Draw the original image to temp canvas
        tempCtx.drawImage(img, 0, 0);

        // Clear main canvas with background color
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = bgOpacity; //0.6
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 0.6;
        
        // Calculate grid
        // let dotSpacing = 110;
        // const rows = Math.floor(canvas.height / dotSpacing);
        // const cols = Math.floor(canvas.width / dotSpacing);
        // const gridCenters = [];
        // Complete grid
        // For each dot position
        // for (let y = 0; y < rows; y++) {
        //   for (let x = 0; x < cols; x++) {
        //       const centerX = x * dotSpacing + (dotSpacing / 2);
        //       const centerY = y * dotSpacing + (dotSpacing / 2);
        //       gridCenters.push({x: centerX, y: centerY});
        //   }
        // }

        const scatterCenters = [
          // -4 column
          {x: canvas.width * .18, y: canvas.height * .10},
          {x: canvas.width * .18, y: canvas.height * .16},
          {x: canvas.width * .18, y: canvas.height * .22},
          {x: canvas.width * .18, y: canvas.height * .28},
          {x: canvas.width * .18, y: canvas.height * .34},
          {x: canvas.width * .18, y: canvas.height * .40},
          {x: canvas.width * .18, y: canvas.height * .46},
          {x: canvas.width * .18, y: canvas.height * .52},
          {x: canvas.width * .18, y: canvas.height * .58},
          {x: canvas.width * .18, y: canvas.height * .64},

          // -3 column
          {x: canvas.width * .26, y: canvas.height * (.10 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.16 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.22 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.28 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.34 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.40 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.46 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.52 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.58 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.64 - 0.025)},
          {x: canvas.width * .26, y: canvas.height * (.70 - 0.025)},

          // - 2 column
          {x: canvas.width * .34, y: canvas.height * .10},
          {x: canvas.width * .34, y: canvas.height * .16},
          {x: canvas.width * .34, y: canvas.height * .22},
          {x: canvas.width * .34, y: canvas.height * .28},
          {x: canvas.width * .34, y: canvas.height * .34},
          {x: canvas.width * .34, y: canvas.height * .40},
          {x: canvas.width * .34, y: canvas.height * .46},
          {x: canvas.width * .34, y: canvas.height * .52},
          {x: canvas.width * .34, y: canvas.height * .58},
          {x: canvas.width * .34, y: canvas.height * .64},
          {x: canvas.width * .34, y: canvas.height * .70},

          // -1 column
          {x: canvas.width * .42, y: canvas.height * (.10 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.16 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.22 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.28 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.34 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.40 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.46 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.52 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.58 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.64 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.70 - 0.025)},
          {x: canvas.width * .42, y: canvas.height * (.76 - 0.025)},

          // middle column
          {x: canvas.width * .50, y: canvas.height * .10},
          {x: canvas.width * .50, y: canvas.height * .16},
          {x: canvas.width * .50, y: canvas.height * .22},
          {x: canvas.width * .50, y: canvas.height * .28},
          {x: canvas.width * .50, y: canvas.height * .34},
          {x: canvas.width * .50, y: canvas.height * .40},
          {x: canvas.width * .50, y: canvas.height * .46},
          {x: canvas.width * .50, y: canvas.height * .52},
          {x: canvas.width * .50, y: canvas.height * .58},
          {x: canvas.width * .50, y: canvas.height * .64},
          {x: canvas.width * .50, y: canvas.height * .70},
          {x: canvas.width * .50, y: canvas.height * .76},

          // + 1 column
          {x: canvas.width * .58, y: canvas.height * (.10 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.16 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.22 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.28 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.34 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.40 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.46 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.52 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.58 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.64 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.70 - 0.025)},
          {x: canvas.width * .58, y: canvas.height * (.76 - 0.025)},

          // + 2 column
          {x: canvas.width * .66, y: canvas.height * .10},
          {x: canvas.width * .66, y: canvas.height * .16},
          {x: canvas.width * .66, y: canvas.height * .22},
          {x: canvas.width * .66, y: canvas.height * .28},
          {x: canvas.width * .66, y: canvas.height * .34},
          {x: canvas.width * .66, y: canvas.height * .40},
          {x: canvas.width * .66, y: canvas.height * .46},
          {x: canvas.width * .66, y: canvas.height * .52},
          {x: canvas.width * .66, y: canvas.height * .58},
          {x: canvas.width * .66, y: canvas.height * .64},
          {x: canvas.width * .66, y: canvas.height * .70},

          // + 3 column
          {x: canvas.width * .74, y: canvas.height * (.10 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.16 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.22 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.28 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.34 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.40 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.46 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.52 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.58 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.64 - 0.025)},
          {x: canvas.width * .74, y: canvas.height * (.70 - 0.025)},

          // + 4 column
          {x: canvas.width * .82, y: canvas.height * .10},
          {x: canvas.width * .82, y: canvas.height * .16},
          {x: canvas.width * .82, y: canvas.height * .22},
          {x: canvas.width * .82, y: canvas.height * .28},
          {x: canvas.width * .82, y: canvas.height * .34},
          {x: canvas.width * .82, y: canvas.height * .40},
          {x: canvas.width * .82, y: canvas.height * .46},
          {x: canvas.width * .82, y: canvas.height * .52},
          {x: canvas.width * .82, y: canvas.height * .58},
          {x: canvas.width * .82, y: canvas.height * .64},
        ]


        const compressedCenters = [
          // - 4 column
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
          {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},

          // - 3 column
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
          {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},

          // - 2 column
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
          {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},

          // - 1 column
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},
          {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 11},

          // middle column
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},
          {x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 11},

          // + 1 column
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},
          {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 11},

          // + 2 column
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
          {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},

          // + 3 column
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
          {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},

          // + 4 column
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
          {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
        ]

        for (let i = 0; i < scatterCenters.length; i++) {
            // Create a temporary canvas for each dot
          const scatterCenterX = scatterCenters[i].x
          const scatterCenterY = scatterCenters[i].y

          // Compressed center
          const compressedCenterX = compressedCenters[i].x
          const compressedCenterY = compressedCenters[i].y

          const dotCanvas = document.createElement('canvas');
          dotCanvas.width = dotSize;
          dotCanvas.height = dotSize;
          const dotCtx = dotCanvas.getContext('2d');
          
          // Set up the circular clip on the dot canvas
          dotCtx.beginPath();
          dotCtx.arc(dotSize/2, dotSize/2, dotSize/2, 0, Math.PI * 2);
          dotCtx.clip();
          
          // Draw the section of the original image into the dot
          dotCtx.drawImage(
              tempCanvas, 
              scatterCenterX - dotSize/2, 
              scatterCenterY - dotSize/2, 
              dotSize, 
              dotSize,
              0,
              0,
              dotSize,
              dotSize
          );
          if (layout === "pack") {
            // Draw the dot onto the main canvas
            ctx.drawImage(
                dotCanvas,
                compressedCenterX - dotSize/2,
                compressedCenterY - dotSize/2
            );
          } else if (layout === "scatter") {
            // Draw the dot onto the main canvas
            ctx.drawImage(
                dotCanvas,
                scatterCenterX - dotSize/2,
                scatterCenterY - dotSize/2
            );
          } 
        }
        imageLoaded = true;
    };
    
    img.onerror = (err) => {
        console.error('Error loading image:', err);
    };
    
    img.src = image.url;
  }

  $: if (image.url && canvas && !imageLoaded) {
    processImage(dotLayout, imgOpacity);
  }
</script>

<div class="graphic-container" id="image-sampling">
  <div class="canvas-container">
    <div class="flex-column">
      <canvas bind:this={canvas}/>
      {#if image}
        <div class="caption" bind:this={caption}>
          <a href="{image.link}" target="_blank"><i>{image.name}</i></a> - {image.artist} ({image.year})
        </div>
      {/if}
    </div>
  </div>
  
  <div class="button-container">
    <button class="icon" on:click={() => setRandomImageWithoutReplacement()}>
      <svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
        <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
      </svg>
    </button>
    <div class="display-control">
      <button class="icon packed" on:click={(e) => { processImage("pack", 0.0); updateActiveButton(0); caption.classList.remove("visible"); }} class:active={activeButtons[0]}>
        <svg
   width="100%"
   fill="currentColor"
   class="bi bi-circle-fill"
   viewBox="0 0 44.187053 56"
   version="1.1"
   id="svg1"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
     id="defs1" /><circle
     cx="8"
     cy="24"
     r="8"
     id="circle1" /><circle
     cx="8"
     cy="8"
     r="8"
     id="circle1-2" /><circle
     cx="8.0572319"
     cy="40.087017"
     r="8"
     id="circle1-9" /><circle
     cx="22.087017"
     cy="16"
     r="8"
     id="circle1-3" /><circle
     cx="22.087017"
     cy="32"
     r="8"
     id="circle1-3-2" /><circle
     cx="22.087017"
     cy="48"
     r="8"
     id="circle1-3-7" /><circle
     cx="36.187054"
     cy="40.00882"
     r="8"
     id="circle1-3-3" /><circle
     cx="36.187054"
     cy="24.00882"
     r="8"
     id="circle1-3-0" /><circle
     cx="36.187054"
     cy="8.0088196"
     r="8"
     id="circle1-3-6" /></svg>


      </button>
      <button on:click={(e) => { processImage("scatter", 0.0); updateActiveButton(1); caption.classList.remove("visible"); }} class="icon scatter" class:active={activeButtons[1]}>
        <svg
   width="100%"
   fill="currentColor"
   class="bi bi-circle-fill"
   viewBox="0 0 64.187057 76"
   version="1.1"
   id="svg1"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <defs
     id="defs1" />
  <circle
     cx="8"
     cy="32"
     r="8"
     id="circle1" />
  <circle
     cx="8"
     cy="8"
     r="8"
     id="circle1-2" />
  <circle
     cx="8.0572329"
     cy="56.087017"
     r="8"
     id="circle1-9" />
  <circle
     cx="32.087017"
     cy="20"
     r="8"
     id="circle1-3" />
  <circle
     cx="32.087017"
     cy="44"
     r="8"
     id="circle1-3-2" />
  <circle
     cx="32.087017"
     cy="68"
     r="8"
     id="circle1-3-7" />
  <circle
     cx="56.187054"
     cy="56.00882"
     r="8"
     id="circle1-3-3" />
  <circle
     cx="56.187054"
     cy="32.00882"
     r="8"
     id="circle1-3-0" />
  <circle
     cx="56.187054"
     cy="8.0088186"
     r="8"
     id="circle1-3-6" />
</svg>

      </button>
      <button class="icon rect" on:click={(e) => { processImage("scatter", 0.5); updateActiveButton(2); caption.classList.add("visible"); }} class:active={activeButtons[2]}>
<svg
   width="100%"
   fill="currentColor"
   class="bi bi-circle-fill"
   viewBox="0 0 64.187057 76"
   version="1.1"
   id="svg1"
   xml:space="preserve"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"><defs
     id="defs1" /><g
     style="fill:currentColor"
     id="g2"
     transform="matrix(3.8449084,0,0,4.6232974,1.3089519,1.3306431)"><path
       d="M 0,2 A 2,2 0 0 1 2,0 h 12 a 2,2 0 0 1 2,2 v 12 a 2,2 0 0 1 -2,2 H 2 A 2,2 0 0 1 0,14 Z"
       id="path1-9" /></g></svg>



      </button>
    </div>
  </div>
</div>


<style type="text/css">
  a {
      text-decoration: underline;
      padding: 0px 3px;
      padding-top: 2px;
      text-decoration: none;
      color: var(--color-1);
      border-bottom: 1px solid var(--color-2);
  }
  a:hover {
      background: var(--color-3);
      text-decoration: none;
      border-radius: 5px;
      color: white;
  }
  :global(.sketch:has(#image-sampling)) {
    justify-content: start !important;
  }
  .graphic-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    min-height: calc(100vh - var(--header-height));
    padding-top: 25px;
    width: min(550px, 95%);
    position: relative;
  }
  .canvas-container {
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    width: 100%;
  }
  .flex-column {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    max-width: min(80vw, 100%);
  }
  canvas {
    height: auto;
    margin: 0 auto;
    height: auto;
    max-height: 70vh;
    border-radius: 15px;
    max-width: min(80vw, 100%);
  }
  .caption {
    padding-top: 10px;
    margin-bottom: 5px;
    visibility: hidden;
    color: var(--color-1);
    font-size: 14px;
    padding-left: 5px;
    line-height: 1.4;
  }
  :global(.caption.visible) {
    visibility: visible !important;
  }
  .button-container {
    min-width: 200px;
    padding-top: 25px;
    padding-bottom: 25px;
    margin-bottom: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }
  .display-control {
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
  }
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-3);
    opacity: 0.7;
    transition: all 100ms linear;
    overflow: visible;
    padding: 0px;
  }
  button.icon {
    height: min(5vw, 20px);
    width: min(5vw, 20px);
  }
  button.icon.packed {
    height: min(5vw, 19px);
    width: min(5vw, 19px);
  }
  button.icon.rect {
    opacity: 0.5;
    height: min(5vw, 20px);
    width: min(5vw, 20px);
  }
  button:hover, button.active {
    color: var(--color-1);
    opacity: 1 !important;
  }
  @media only screen and (max-width: 400px) {
    .caption {
      font-size: 11px;
      padding-top: 7px;
    }
  }
</style>