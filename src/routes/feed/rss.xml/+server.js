import { marked } from "marked";
import writings from "../../../data/poems.json";
import sketches from "../../../data/poems.json";
import poems from "../../../data/poems.json";

export const prerender = true

marked.use({
  mangle: false,
  headerIds: false
});

async function getText(event, filepath) {
  const response = await event.fetch(filepath);
  const text = await response.text();
  return text;
}

async function getJSON(event, filepath) {
  const response = await event.fetch(filepath);
  const text = await response.json();
  return text;
}

export async function GET(event) {
  event.setHeaders({
    'Cache-Control': `max-age=0, s-max-age=3600`,
    'Content-Type': 'application/xml'
  })

  // writings
  writings.forEach(writing => writing.category = "Article");
  writings.forEach(writing => writing.route = "writings");
  const writingTexts = await Promise.all(writings.map(writing => getText(event, writing.filename)));
  const writingMarkedTexts = writingTexts.map(writingText => marked(writingText));
  writings.forEach((writing,index) => writing.marked = writingMarkedTexts[index]);

  // sketches
  sketches.forEach(sketch => sketch.category = "Sketch");
  sketches.forEach(sketch => sketch.route = "sketches");
  const sketchTexts = await Promise.all(sketches.map(sketch => getText(event, sketch.filename)));
  const sketchMarkedTexts = sketchTexts.map(sketchText => marked(sketchText));
  sketches.forEach((sketch,index) => sketch.marked = sketchMarkedTexts[index]);

  // poems
  poems.forEach(poem => poem.category = "Poem");
  poems.forEach(poem => poem.route = "poems");
  const poemTexts = await Promise.all(poems.map(poem => getJSON(event, `/data/poems/${poem.slug}.json`)));
  const poemMarkedTexts = poemTexts.map(poem => marked(poem["text"].replaceAll("\n","<br>").replaceAll("<br><br><br>", "<br><br>").replaceAll("/","")));
  poems.forEach((poem,index) => poem.marked = poemMarkedTexts[index]);

  // Function to sort array by date
  function sortArrayByDate(array) {
      return array.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
      });
  }

  let items = writings.concat(poems).concat(sketches);
  items = sortArrayByDate(items).reverse();

  const xml = `<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
      <channel>
        <title>Arbourtrary RSS Feed</title>
        <link>https://arbourtrary.com</link>
        <description>Trying out a couple concepts. Writing about nature, tech, poetry, mathematics. Providing safe arbour in a darkening forest.</description>
        <language>en-us</language>
        <managingEditor>arbourtrary@gmail.com</managingEditor>
        <webMaster>arbourtrary@gmail.com</webMaster>
        <docs>https://www.rssboard.org/rss-specification</docs>
        <ttl>1440</ttl>
        <image>
            <url>https://arbourtrary.com/images/arbourtrary-profile.webp</url>
            <title>Arbourtrary RSS Feed</title>
            <link>https://arbourtrary.com</link>
        </image>
        ${items
          .map(
            (item) => {
              return `
                <item>
                  <guid isPermaLink="false">https://arbourtrary.com/${item.route}/${item.slug}</guid>
                  <title>${item.title || item.name}</title>
                  <description><![CDATA[${item.marked}]]></description>
                  <link>https://arbourtrary.com/${item.route}/${item.slug}</link>
                  <pubDate>${new Date(item.date).toUTCString()}</pubDate>
                  <category>${item.category}</category>
                  <author>arbourtrary@gmail.com</author>
                </item>
              `  
          })
          .join('')}
      </channel>
    </rss>`

  return new Response(xml)
}