<script>
  import { onMount } from 'svelte';

  let textContainer;
  let graphicWidth;
  let fontSizeRatio = 16 / 600;
  let spacingRatio = 2.5 / 600;
  let dropShadowRatio = 5 / 600;
  let numTexts = 8;
  let startTime = 0;
  let currentRound = 0;
  let activeLetterArray = [];
  let wordLetterColorMap = {};
  let csvData;

  const WORDS_FILEPATH = "/data/sketches/categorized-words.csv";
  // TODO: Need to variable-ize all transition durations to make this scale correctly
  const TIMING_MULTIPLIER = 1;
  const TIMING = {
    INNER_RADIUS: TIMING_MULTIPLIER * 10,
    FINAL_POSITION: TIMING_MULTIPLIER * 7800,
    NEXT: TIMING_MULTIPLIER * 18500,
    FADE_OUT: TIMING_MULTIPLIER * 23800,
    RESET: TIMING_MULTIPLIER * 32800
  };

  // Phoneme categories and colors
  const phonemeCategories = {
    plosives: ["B","D","G","P","T","K","Q"],
    fricatives: ["V","DH","Z","ZH","F","TH","S","SH"],
    liquids: ["L","EL","R"],
    glides: ["W","WH","Y"],
    nasal: ["N","M","NG","EM","EN"],
    affricates: ["CH","JH"],
    whisper: ["HH"],
    front: ["IH","IY","EY","EH","AE"],
    mid: ["ER","AH"],
    dipthongs: ["AY","AW","OY"],
    back: ["AA","AO","OW","UH","UW"]
  };

  const colorMap = {
    plosives: "var(--red)",
    fricatives: "var(--orange)",
    nasal: "var(--yellow)",
    affricates: "var(--yellow)",
    whisper: "var(--blue)",
    liquids: "var(--blue)",
    glides: "var(--blue)",

    front: "var(--green)",
    mid: "var(--indigo)",
    dipthongs: "var(--purple)",
    back: "var(--purple)"
  };

  function getPhonemeCategory(phoneme) {
    for (let category in phonemeCategories) {
      if (phonemeCategories[category].includes(phoneme)) {
        return category;
      }
    }
    return null;
  }

  function csvJSON(csv) {
    const lines = csv.split('\n')
    const result = []
    const headers = lines[0].replace("\r","").split(',');
    for (let i = 1; i < lines.length; i++) {        
      if (!lines[i])
        continue
      const obj = {}
      const currentline = lines[i].replace("\r","").split(',')

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]
      }
      result.push(obj)
    }
    return result
  }

  async function loadCSV(filePath) {
    const response = await fetch(filePath);
    const text = await response.text();
    return csvJSON(text);
  }

  async function generateWordLetterColorMap(csvFilePath) {
    const csvData = await loadCSV(csvFilePath);
    const wordLetterColorMap = {};
    csvData.forEach(entry => {
      const word = entry["word"];
      const graphemes = entry["graphemes"].split(" ");
      const phonemes = entry["phonemes"].split(" ");

      const colors = [];
      graphemes.forEach((grapheme, index) => {
        [...grapheme].forEach(letter => {
          const category = getPhonemeCategory(phonemes[index]);
          
          if (!category) {
            throw new Error(`No category found for grapheme (${grapheme}) and phoneme (${phonemes[index]})`);
          }
          
          colors.push(colorMap[category]);
        });
      });
      wordLetterColorMap[word] = colors;
    });
    return [wordLetterColorMap, csvData];
  }

  function getRandomItemsFromArray(arr, n) {
    const result = new Set();
    while (result.size < n) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      result.add(arr[randomIndex]);
    }
    return Array.from(result);
  }

  function getFinalPosition(index) {
    const theta = index * 2 * Math.PI / numTexts;
    const x = Math.cos(theta) * outerRadius;
    const y = Math.sin(theta) * outerRadius;
    return {x, y};
  }

  function getFadePosition(index) {
    const theta = index * 2 * Math.PI / numTexts;
    const x = Math.cos(theta) * fadeRadius;
    const y = Math.sin(theta) * fadeRadius;
    return {x, y};
  }

  function getFinalRotation(index) {
    const theta = index * 2 * Math.PI / numTexts;
    const thetaDegrees = theta * 360 / (2 * Math.PI);
    const rotation = 270 + thetaDegrees;
    return rotation;
  }

  function getInitialPosition(index) {
    const deltaRandom = 10 * Math.random() - 0.5;
    const thetaRandom = (index + deltaRandom) * 2 * Math.PI / numTexts;
    const radiusRandom = Math.sqrt(Math.random()) * innerRadius;

    const x = Math.cos(thetaRandom) * radiusRandom;
    const y = Math.sin(thetaRandom) * radiusRandom;
    return {x, y};
  }

  function createLetterElement(letter, text, textIndex, letterIndex) {
    const letterAnimated = document.createElement("div");
    letterAnimated.innerHTML = `<span style="transform: translate(-50%, -50%) rotate(${getFinalRotation(textIndex)}deg); position: absolute; top: 50%; left: 50%;">${letter}</span>`;
    letterAnimated.classList.add("letter", "animated");
    return letterAnimated;
  }

  let innerRadius, outerRadius, fadeRadius;

  function initializeDimensions() {
    if (textContainer) {
      graphicWidth = textContainer.offsetWidth;
      innerRadius = 0.55 * textContainer.offsetWidth / 2;
      outerRadius = 0.70 * textContainer.offsetWidth / 2;
      fadeRadius = 1.20 * textContainer.offsetWidth / 2;
      document.documentElement.style.setProperty("--letter-size", `${fontSizeRatio * graphicWidth}px`);
      document.documentElement.style.setProperty("--letter-spacing", `${spacingRatio * graphicWidth}px`);
    }
  }

  onMount(async () => {
    initializeDimensions();
    [wordLetterColorMap, csvData] = await generateWordLetterColorMap(WORDS_FILEPATH);
    animateTexts(wordLetterColorMap, csvData);
  });

  function getTextElement(text, index) {
        const textDiv = document.createElement("div");
        textDiv.classList.add("text");

        const finalPosition = getFinalPosition(index);
        const finalX = `calc(-50% + ${finalPosition.x}px)`;
        const finalY = `calc(-50% + ${finalPosition.y}px)`;
        textDiv.style.transform = `
          translate(${finalX}, ${finalY})
          rotate(${getFinalRotation(index)}deg)
        `;

        [...text].forEach(letter => {
          // Final position letters - will be hidden - use range to extract positions
          const letterFinal = document.createElement("span");
          letterFinal.textContent = letter;
          letterFinal.classList.add("letter");
          textDiv.appendChild(letterFinal)
        })

        return textDiv;
      }

      function getFadeTextElement(text, index) {
        const textDiv = document.createElement("div");
        textDiv.classList.add("text");

        const fadePosition = getFadePosition(index);
        const fadeX = `calc(-50% + ${fadePosition.x}px)`;
        const fadeY = `calc(-50% + ${fadePosition.y}px)`;
        textDiv.style.transform = `
          translate(${fadeX}, ${fadeY})
          rotate(${getFinalRotation(index)}deg)
        `;

        [...text].forEach(letter => {
          // Final position letters - will be hidden - use range to extract positions
          const letterFade = document.createElement("span");
          letterFade.textContent = letter;
          letterFade.classList.add("letter");
          textDiv.appendChild(letterFade)
        })

        return textDiv;
      }

  function addGridLine(index) {
        const gridline = document.createElement("div");
        gridline.classList.add("line-grid");
        gridline.style.transform = `translate(-50%, -50%) rotate(${getFinalRotation(index)}deg)`;
        gridline.style.transition = `opacity 500ms ease-in ${100*index}ms`;
        textContainer.appendChild(gridline);
      }

  function animateTexts(wordLetterColorMap, csvData) {
        const activeLetters = new Set();
        const texts = getRandomItemsFromArray(csvData, numTexts).map(item => item["word"]);
        startTime = performance.now();

        texts.forEach((text, textIndex) => {
          if ((textIndex + 1) <= texts.length / 2) {
            addGridLine(textIndex);
          }

          const textDiv = getTextElement(text, textIndex);
          const fadeTextDiv = getFadeTextElement(text, textIndex);
          textContainer.appendChild(textDiv);
          textContainer.appendChild(fadeTextDiv);

          [...text].forEach((letter, letterIndex) => {
            const letterAnimated = createLetterElement(letter, text, textIndex, letterIndex);
            setInitialStyles(letterAnimated, text, textIndex, letterIndex, textDiv, wordLetterColorMap);
            textContainer.appendChild(letterAnimated);
            activeLetters.add({
              element: letterAnimated,
              textDiv,
              fadeTextDiv,
              letterIndex,
              text,
              hasTriggeredInner: false,
              hasTriggeredFinal: false,
              hasTriggeredFade: false
            });
          });
        });
        activeLetterArray.push(activeLetters);
        requestAnimationFrame(animate);
      }

      function setInitialStyles(element, text, textIndex, letterIndex, textDiv, wordLetterColorMap) {
        const backgroundColor = wordLetterColorMap[text][letterIndex];
        const dropShadow = `drop-shadow(0 0 ${dropShadowRatio * graphicWidth}px ${backgroundColor}) drop-shadow(0 0 ${2 * dropShadowRatio * graphicWidth}px ${backgroundColor}) drop-shadow(0 0 ${3 * dropShadowRatio * graphicWidth}px ${backgroundColor})`;
        
        const initialPosition = getInitialPosition(textIndex);
        const rect = textDiv.children[letterIndex].getClientRects()[0];
        const initialBlur = Math.random() * 2;
        const initialScale = 0.5 * Math.random();
        
        const initialTop = textContainer.offsetHeight / 2 + 0.5 * initialPosition.y;
        const initialLeft = textContainer.offsetWidth / 2 + 0.5 * initialPosition.x;

        Object.assign(element.style, {
          width: `${rect.width - 2}px`,
          height: `${rect.height - 2}px`,
          zIndex: "10",
          transform: `scale(${initialScale})`,
          transition: "all 8000ms linear",
          opacity: "0",
          filter: `blur(${initialBlur}px) ${dropShadow}`,
          top: `${initialTop}px`,
          left: `${initialLeft}px`,
          position: "absolute"
        });
      }

      function animate(timestamp) {
        const elapsed = timestamp - startTime;
        const activeLetters = activeLetterArray[currentRound];
        const resetLetters = currentRound > 0 ? activeLetterArray[currentRound - 1] : null;

        resetLetters && resetLetters.forEach((letterData) => {
          const {element, textDiv, fadeTextDiv, letterIndex, text, hasTriggeredInner, hasTriggeredFinal, hasTriggeredFade} = letterData;

          // Fade out transition
          if (!hasTriggeredFade && (elapsed + TIMING.NEXT) >= TIMING.FADE_OUT) {
            applyFadeOutStyles(element, fadeTextDiv, letterIndex, text);
            letterData.hasTriggeredFade = true;
          }
          if (resetLetters && (elapsed + TIMING.NEXT) >= TIMING.RESET) {
              resetLetters.forEach(({element}) => element.remove());
            resetLetters.clear();
          }
        });

        activeLetters && activeLetters.forEach((letterData) => {
          const {element, textDiv, fadeTextDiv, letterIndex, text, hasTriggeredInner, hasTriggeredFinal, hasTriggeredFade} = letterData;

          // Inner radius transition
          if (!hasTriggeredInner && elapsed >= TIMING.INNER_RADIUS) {
            applyInnerRadiusStyles(element, textDiv, letterIndex);
            letterData.hasTriggeredInner = true;
          }

          // Final position transition
          if (!hasTriggeredFinal && elapsed >= TIMING.FINAL_POSITION) {
            applyFinalStyles(element, textDiv, letterIndex);
            letterData.hasTriggeredFinal = true;
          }
        });

        // Next animation
        if (elapsed >= TIMING.NEXT) {
          // textContainer.innerHTML = '';
          currentRound++;
          animateTexts(wordLetterColorMap, csvData);
          return;
        }

        requestAnimationFrame(animate);
      }

      function applyInnerRadiusStyles(element, textDiv, letterIndex) {
        const initialLeft = parseFloat(element.style.left);
        const initialTop = parseFloat(element.style.top);
        
        const rect = textDiv.children[letterIndex].getClientRects()[0];
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const finalTop = rect.top + scrollTop - textContainer.offsetTop;
        const finalLeft = rect.left - window.innerWidth / 2 + textContainer.offsetWidth / 2;

        element.style.transition = "all 8000ms linear";
        
        requestAnimationFrame(() => {
          Object.assign(element.style, {
            left: `${initialLeft + 0.2 * (finalLeft - initialLeft)}px`,
            top: `${initialTop + 0.3 * (finalTop - initialTop)}px`,
            transform: "translate(0%, -50%) scale(0.5)",
            filter: element.style.filter.replace(/blur\([^)]+\)/, "blur(1px)"),
            opacity: (0.2 + 0.4 * Math.random()).toString()
          });
        });
      }

      function applyFinalStyles(element, textDiv, letterIndex) {
        const rect = textDiv.children[letterIndex].getClientRects()[0];
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const finalTop = rect.top + scrollTop - textContainer.offsetTop;
        const finalLeft = rect.left - window.innerWidth / 2 + textContainer.offsetWidth / 2;
        
        const randomizeAnimatedTime = (0.85 + Math.random() * .15) * 15000;

        element.style.transition = `transform ${randomizeAnimatedTime}ms linear, top ${randomizeAnimatedTime}ms linear, left ${randomizeAnimatedTime}ms linear, filter ${randomizeAnimatedTime}ms linear, opacity ${randomizeAnimatedTime + 1000}ms linear`;
        
        requestAnimationFrame(() => {
          Object.assign(element.style, {
            top: `${finalTop}px`,
            left: `${finalLeft}px`,
            filter: element.style.filter.replace(/blur\([^)]+\)/, "blur(0px)"),
            opacity: "0.75",
            transform: "translate(0) scale(1)"
          });
        });
      }

      function applyFadeOutStyles(element, fadeTextDiv, letterIndex, text) {
        const fadeRect = fadeTextDiv.children[letterIndex].getClientRects()[0];
        const fadeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const fadeTop = fadeRect.top + fadeScrollTop - textContainer.offsetTop;
        const fadeLeft = fadeRect.left - window.innerWidth / 2 + textContainer.offsetWidth / 2;
        
        const fadeMultiplier = 9 + Math.sqrt(Math.abs(letterIndex + 0.5 - text.length / 2));
        const fadeSpeed = 14000 - fadeMultiplier * 75;
        const fadeSpeedFast = 10500 - fadeMultiplier * 75;

        element.style.transition = `top ${fadeSpeed}ms linear, left ${fadeSpeed}ms linear, opacity ${fadeSpeedFast}ms linear, transform ${fadeSpeedFast}ms linear`;
        
        requestAnimationFrame(() => {
          Object.assign(element.style, {
            top: `${fadeTop}px`,
            left: `${fadeLeft}px`,
            opacity: "0.25",
            transform: "translate(0) scale(0.3)"
          });
        });
      }
</script>

<div class="text-container" bind:this={textContainer}>
  <div class="fade-container"></div>
</div>

<style>
  :global(*) {
    font-family: "IM Fell English";
  }

  :global(::selection) {
    background-color: var(--selection-bg-color);
    color: var(--selection-color);
  }

  .text-container {
    position: relative;
    width: calc(100% - 40px);
    padding: 20px;
    box-sizing: border-box;
    max-width: 650px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 1px solid var(--color-4);
    background: var(--bg-color);
    transition: transform 1000ms linear;
    overflow: hidden;
    margin: 0 auto;
    box-shadow: 0px 0px 1px rgba(3, 7, 18, 0.02),
      0px 0px 4px rgba(3, 7, 18, 0.03),
      0px 0px 9px rgba(3, 7, 18, 0.05),
      0px 0px 15px rgba(3, 7, 18, 0.06),
      0px 0px 24px rgba(3, 7, 18, 0.08);
  }

  .fade-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
    background-image: radial-gradient(circle, rgba(0,0,0,0) 0%, transparent 64%, var(--bg-color) 72%);
    z-index: 11;
  }

  :global(.line-grid) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 1;
    width: 1px;
    height: 70%;
    background: var(--color-4);
    opacity: 1;
  }

  :global(.text) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: opacity 0.8s linear;
    z-index: 10;
    letter-spacing: var(--letter-spacing);
    text-transform: uppercase;
  }

  :global(.letter) {
    position: relative;
    visibility: hidden;
    color: var(--orange);
    font-size: var(--letter-size, 18px);
    box-sizing: inherit;
    text-transform: uppercase;
    transition: transform 0.8s linear, opacity 0.8s linear;
  }

  :global(.animated) {
    color: var(--color-1);
    visibility: visible !important;
    position: absolute !important;
    top: 0;
    left: 0;
    transition: all 8000ms linear;
  }
</style>