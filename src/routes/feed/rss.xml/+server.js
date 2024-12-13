import { marked } from "marked";

export const prerender = true

async function getText(event, filepath) {
  const response = await event.fetch(filepath);
  const text = await response.text();
  return text;
}

export async function GET(event) {
  event.setHeaders({
    'Cache-Control': `max-age=0, s-max-age=3600`,
    'Content-Type': 'application/xml'
  })

  const response = await event.fetch('/data/writings.json');
  const writings = await response.json();
  // get them most recent first
  writings.reverse();
  const texts = await Promise.all(writings.map(writing => getText(event, writing.filename)));
  const markedTexts = texts.map(text => marked(text));
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
            <url>https://arbourtrary.com/images/arbourtrary-profile.jpg</url>
            <title>Arbourtrary RSS Feed</title>
            <link>https://arbourtrary.com</link>
        </image>
        ${writings
          .map(
            (writing, index) =>
              `
              <item>
                <guid isPermaLink="false">https://arbourtrary.com/writings/${writing.slug}</guid>
                <title>${writing.title}</title>
                <description><![CDATA[${markedTexts[index]}]]></description>
                <link>https://arbourtrary.com/writings/${writing.slug}</link>
                <pubDate>${new Date(writing.date).toUTCString()}</pubDate>
                <author>arbourtrary@gmail.com</author>
            </item>
          `
          )
          .join('')}
      </channel>
    </rss>`

  return new Response(xml)
}