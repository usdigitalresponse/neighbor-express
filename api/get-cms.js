const Airtable = require("airtable");
const mmd = require('micromarkdown');

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "CMS";
const viewName = "";

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
const cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
let cachedResponse = null;
let cachedResponseDate = null;

export default (req, res) => {
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) {
    return res.send(cachedResponse);
  } else {
    // Select the first 10 records from the view.
    base(tableName)
      .select({
        maxRecords: 30
      })
      .firstPage(function (error, records) {
        if (error) {
          return res.send({ error: error });
        } else {
          cachedResponse = {
            records: records.map(record => {
              return {
                key: record.get("key"),
                title: record.get("title"),
                body_en: mmd.parse(nl2br(record.fields.body_en)),
                body_es: nl2br(record.fields.body_es),
                picture: record.get("picture") || [],
                secondary_en: record.get("secondary_en"),
                secondary_es: record.get("secondary_es"),
                href: record.get("href")
              };
            })
          };
          cachedResponseDate = new Date();

          return res.send(cachedResponse);
        }
      });
  }
}

// utilities
function nl2br(str, replaceMode, isXhtml) {

  var breakTag = (isXhtml) ? '<br />' : '<br>';
  var replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
}