const Airtable = require("airtable");
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);
const tableName = "Pages";
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
        maxRecords: 10
      })
      .firstPage(function (error, records) {
        if (error) {
          return res.send({ error: error });
        } else {
          cachedResponse = {
            records: records.map(record => {
              console.log(record.fields.body);
              return {
                key: record.get("key"),
                title: record.get("title"),
                body: record.fields.body,
                picture: record.get("picture") || []
              };
            })
          };
          cachedResponseDate = new Date();

          return res.send(cachedResponse);
        }
      });
  }
}
